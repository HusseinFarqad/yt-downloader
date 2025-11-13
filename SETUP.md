# YouTube Downloader Setup Guide

## Fixing "Failed to fetch video information" Error

If you're encountering the "Failed to fetch video information" error, it's likely due to YouTube's bot protection. Here's how to fix it:

### Option 1: Configure YouTube Cookies (Recommended)

YouTube may require authentication to access video information. You can provide your YouTube cookies to bypass this restriction.

#### Steps:

1. **Install a Cookie Export Extension**
   - Chrome/Edge: [Cookie Editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
   - Firefox: [Cookie Editor](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

2. **Export Your YouTube Cookies**
   - Go to [youtube.com](https://youtube.com) and log in
   - Click on the Cookie Editor extension
   - Click "Export" and select "JSON" format
   - Copy the exported JSON

3. **Configure the Server**
   - Create a `.env` file in the `server` directory
   - Add the following line (replace `YOUR_COOKIES` with the exported JSON):
     ```
     YOUTUBE_COOKIES=YOUR_COOKIES
     ```
   - Alternatively, set the environment variable when running the server:
     ```bash
     YOUTUBE_COOKIES='[...]' npm run dev
     ```

4. **Restart the Server**
   - Stop the server (Ctrl+C)
   - Start it again: `npm run dev` or `npm start`

### Option 2: Use OAuth2 Tokens

You can also use OAuth2 tokens for authentication:

1. Set up a Google Cloud project and enable the YouTube Data API
2. Get your OAuth2 credentials (access_token and refresh_token)
3. Add to `.env`:
   ```
   YOUTUBE_OAUTH2_TOKENS={"access_token":"your_token","refresh_token":"your_refresh_token"}
   ```

### Option 3: Try Without Authentication First

The updated server code now provides better error messages. Try running the application and check the server logs for specific error details. Some videos may work without authentication.

## Additional Notes

- Cookies expire, so you may need to refresh them periodically
- Keep your cookies and tokens secure - don't commit them to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Check the server console logs for detailed error messages

## Testing

After configuration:
1. Ensure the server is running on port 5000
2. Ensure the client is running on port 3000
3. Try fetching a public YouTube video
4. Check the server console for detailed error messages if issues persist
