const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

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

    const info = await ytdl.getInfo(url);
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
    res.status(500).json({ error: 'Failed to fetch video information' });
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

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s-]/g, '');

    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Select format based on quality preference
    let format = quality === 'highest' ? 'highest' : 'lowest';

    // Stream the video
    ytdl(url, {
      quality: format,
      filter: 'videoandaudio'
    }).pipe(res);

  } catch (error) {
    console.error('Error downloading video:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download video' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
