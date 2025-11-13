# YouTube Video Downloader

A full-stack MERN (MongoDB-free) application for downloading YouTube videos. Built with React for the frontend and Node.js/Express for the backend.

## Features

- Clean and modern UI
- Download YouTube videos in different qualities
- Video information preview (title, thumbnail, duration, author)
- Real-time loading states and error handling
- Responsive design for mobile and desktop

## Tech Stack

**Frontend:**
- React 18
- Axios for API requests
- Modern CSS with gradients

**Backend:**
- Node.js
- Express.js
- @distube/ytdl-core for YouTube video downloading
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yt-downloader
```

2. Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application

### Development Mode

You need to run both the server and client separately.

**Terminal 1 - Start the backend server:**
```bash
cd server
npm run dev
```
The server will run on http://localhost:5000

**Terminal 2 - Start the React frontend:**
```bash
cd client
npm start
```
The client will run on http://localhost:3000

The React app is configured to proxy API requests to the backend server.

### Using the Concurrent Script (Optional)

You can add a root-level package.json to run both servers concurrently:

```bash
# From root directory
npm install
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Paste a YouTube video URL into the input field
3. Click "Get Video Info" to fetch video details
4. Choose your preferred quality and click the download button
5. The video will be downloaded to your default downloads folder

## API Endpoints

### GET `/api/health`
Health check endpoint

### POST `/api/video-info`
Get information about a YouTube video
- **Body:** `{ "url": "youtube-url" }`
- **Response:** Video title, thumbnail, duration, author, and available formats

### POST `/api/download`
Download a YouTube video
- **Body:** `{ "url": "youtube-url", "quality": "highest" | "lowest" }`
- **Response:** Video file stream

## Project Structure

```
yt-downloader/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── server.js          # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the server directory (see `server/.env.example`):

```bash
PORT=5000

# Optional but recommended: YouTube authentication
# See SETUP.md for detailed instructions on how to get these values
# YOUTUBE_COOKIES='[{"name":"cookie1","value":"value1"}]'
# YOUTUBE_OAUTH2_TOKENS='{"access_token":"token","refresh_token":"token"}'
```

**Important:** If you encounter "Failed to fetch video information" errors, you'll need to configure authentication. See [SETUP.md](SETUP.md) for instructions.

## Important Notes

- **Legal Disclaimer:** Make sure you have the right to download any video. Respect copyright laws and YouTube's Terms of Service.
- **Rate Limiting:** Be mindful of YouTube's rate limits when making requests.
- **Large Files:** Downloading large videos may take time depending on your internet connection.

## Troubleshooting

### "Failed to fetch video information" Error
**This is the most common issue!** YouTube has bot protection that may block requests without proper authentication.

**Solution:** Configure YouTube cookies or OAuth2 tokens. See [SETUP.md](SETUP.md) for detailed instructions.

The server now provides better error messages. Check the server console logs for specific details about why a request failed.

### Videos not downloading
- Ensure the YouTube URL is valid
- Some videos may be restricted or age-gated
- **Authentication required:** See [SETUP.md](SETUP.md) for cookie/OAuth configuration
- Check if ytdl-core needs updating: `npm update @distube/ytdl-core`

### CORS errors
- Make sure the backend server is running on port 5000
- Check that the proxy setting in client/package.json is correct

### Port already in use
- Change the PORT in server/.env to a different port
- Update the proxy setting in client/package.json accordingly

## Future Enhancements

- [ ] Add authentication
- [ ] Download history
- [ ] Playlist support
- [ ] Audio-only downloads
- [ ] Progress bars for downloads
- [ ] Multiple quality options
- [ ] Video format selection (MP4, WebM, etc.)

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
