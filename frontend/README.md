# Video Clip Analyzer

A beautiful, modern web application for analyzing videos and discovering the most engaging moments.

## Features

### 🎬 Multiple Input Sources
- **File Upload**: Direct video file upload from your device
- **YouTube**: Paste any YouTube URL to analyze
- **Dropbox**: Use Dropbox share links
- **Google Drive**: Browse and select videos from Google Drive with the built-in picker

### ✨ Beautiful UI
- Modern dark theme with gradient accents
- Smooth animations and transitions
- Fully responsive design for mobile, tablet, and desktop
- Real-time status updates with visual feedback
- Card-based results display with hover effects

### 📊 Analysis Results
- Top 3 most engaging clips identified
- Timestamp information (start/end times)
- Duration calculation
- Reasoning for each clip selection

## Backend Requirements

The application expects a backend server running on `http://localhost:8000` with the following endpoints:

### Endpoints

1. `POST /upload` - Upload video file
   - Accepts: `multipart/form-data` with file field

2. `POST /upload_youtube` - Analyze YouTube video
   - Accepts: JSON with `url` field
   - Example: `{ "url": "https://youtube.com/watch?v=..." }`

3. `POST /upload_dropbox` - Analyze Dropbox video
   - Accepts: JSON with `url` field
   - Example: `{ "url": "https://dropbox.com/..." }`

4. `POST /upload_googledrive` - Analyze Google Drive video
   - Accepts: JSON with `fileId` field
   - Example: `{ "fileId": "abc123..." }`

5. `GET /status` - Check processing status
   - Returns: `{ "state": "idle" | "processing" | "completed" | "error" }`

6. `GET /topclips` - Get analysis results
   - Returns: Array of clip objects
   ```json
   [
     {
       "start": 12.5,
       "end": 25.3,
       "reason": "High engagement detected"
     }
   ]
   ```

## Google Drive Setup

To use the Google Drive picker:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google Picker API and Google Drive API
3. Create OAuth 2.0 credentials
4. Update the `client_id` in `src/components/VideoUploader.jsx`
5. Add authorized JavaScript origins for your domain

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- React 18
- Vite
- CSS3 with modern features (backdrop-filter, gradients, animations)
- Google Picker API for Drive integration
