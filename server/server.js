const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Create agent with OAuth2 token if available
let agent;
const cookies = process.env.YOUTUBE_COOKIES ? JSON.parse(process.env.YOUTUBE_COOKIES) : [];
const oauth2Tokens = process.env.YOUTUBE_OAUTH2_TOKENS ? JSON.parse(process.env.YOUTUBE_OAUTH2_TOKENS) : null;

// Configure ytdl with cookies and OAuth if available
const ytdlOptions = {};
if (cookies.length > 0) {
  agent = ytdl.createAgent(cookies);
  ytdlOptions.agent = agent;
}
if (oauth2Tokens) {
  ytdlOptions.oauth2 = oauth2Tokens;
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get video info endpoint
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Use ytdlOptions if configured with cookies/OAuth
    const info = await ytdl.getInfo(url, ytdlOptions);
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      duration: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      formats: formats.map(format => ({
        quality: format.qualityLabel,
        itag: format.itag,
        hasVideo: format.hasVideo,
        hasAudio: format.hasAudio,
        container: format.container
      }))
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // Provide more specific error messages
    let errorMessage = 'Failed to fetch video information';
    if (error.message.includes('Sign in')) {
      errorMessage = 'YouTube requires authentication. Please configure YOUTUBE_COOKIES or YOUTUBE_OAUTH2_TOKENS environment variables.';
    } else if (error.message.includes('This video is unavailable')) {
      errorMessage = 'This video is unavailable or private.';
    } else if (error.message.includes('429')) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.message) {
      errorMessage = `Failed to fetch video: ${error.message}`;
    }

    res.status(500).json({ error: errorMessage });
  }
});

// Download video endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, quality } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url, ytdlOptions);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '');

    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Select format based on quality preference
    let format = quality === 'highest' ? 'highest' : 'lowest';

    // Stream the video with ytdlOptions
    const downloadOptions = {
      quality: format,
      filter: 'videoandaudio',
      ...ytdlOptions
    };

    ytdl(url, downloadOptions).pipe(res);

  } catch (error) {
    console.error('Error downloading video:', error);
    console.error('Error details:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download video' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
