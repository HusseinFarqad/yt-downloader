import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setVideoInfo(null);
    setLoading(true);

    try {
      const response = await axios.post('/api/video-info', { url });
      setVideoInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch video information');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (quality) => {
    setDownloading(true);
    setError('');

    try {
      const response = await axios.post('/api/download',
        { url, quality },
        {
          responseType: 'blob',
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'video/mp4' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoInfo.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Failed to download video. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">YouTube Video Downloader</h1>
        <p className="subtitle">Download your favorite YouTube videos easily</p>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL here..."
            className="url-input"
            disabled={loading || downloading}
          />
          <button
            type="submit"
            className="search-btn"
            disabled={loading || downloading || !url}
          >
            {loading ? 'Loading...' : 'Get Video Info'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {videoInfo && (
          <div className="video-info">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="thumbnail"
            />
            <h2 className="video-title">{videoInfo.title}</h2>
            <p className="video-author">By: {videoInfo.author}</p>
            <p className="video-duration">
              Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}
            </p>

            <div className="download-buttons">
              <button
                onClick={() => handleDownload('highest')}
                disabled={downloading}
                className="download-btn quality-high"
              >
                {downloading ? 'Downloading...' : 'Download Highest Quality'}
              </button>
              <button
                onClick={() => handleDownload('lowest')}
                disabled={downloading}
                className="download-btn quality-low"
              >
                {downloading ? 'Downloading...' : 'Download Lowest Quality'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
