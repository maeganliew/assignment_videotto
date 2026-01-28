# Video Clip Analyzer

## Overview
A simple system that selects the **top 3 clips** from a video, focusing on **explainable heuristics and clarity**.

## Link to Website
https://assignment-videotto-8e4d.vercel.app/

## How It Works
1. **Video Input:** Upload a local video via the React frontend.
2. **Candidate Clips:** Video split into overlapping windows (e.g., 5s) for scoring.
3. **Scoring & Ranking:**
   - **Motion score:** High frame-to-frame differences indicate visual activity.
   - **Audio score:** High energy indicates speech or emphasis.
   - **Final score:** Weighted combination; top 3 clips selected.
4. **Clip Reasoning:** Each clip includes a short, human-readable explanation of why it was chosen (motion-dominant or audio-dominant).
5. **Status Tracking:** Backend states (`idle`, `processing`, `completed`, `failed`) are polled by the frontend.

## Tech Stack
- **Backend:** Python, FastAPI
- **Frontend:** React (Vite)
- **Video Processing:** OpenCV, NumPy, Librosa
- **Deployment:** AWS EC2 (backend), Vercel/Netlify (frontend optional)

## Tradeoffs
- Heuristic-based: simple, explainable, fast
- Limits: may miss semantic highlights; motion-heavy clips can dominate
- No transcript, ML, or scene detection

## Future Improvements
- Speech-to-text & keyword scoring
- Vertical cropping for social media
- Support Dropbox/Google Drive input
  
