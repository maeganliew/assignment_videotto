from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from video_utils import get_candidate_clips
from selector import select_top_clips
import requests
import yt_dlp as youtube_dl
from pydantic import BaseModel
import subprocess
import os

app = FastAPI()
UPLOAD_DIR = "uploads/"
uploaded_file_path = None
converted_file_path = None

# Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

class YouTubeRequest(BaseModel):
    url: str

STATUS = {"state": "idle"}
CANDIDATE_CLIPS = []
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/status")
def get_status():
    return STATUS

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    global CANDIDATE_CLIPS
    global TOP_CLIPS
    try:
        STATUS["state"] = "processing"
        CANDIDATE_CLIPS = []
        TOP_CLIPS = []

        path = f"{UPLOAD_DIR}{file.filename}"
        with open(path, "wb") as f:
            f.write(await file.read())

        converted_path = f"{UPLOAD_DIR}h264_{file.filename}"
        subprocess.run([
            "ffmpeg", "-i", path, "-y",
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "copy", converted_path
        ], check=True)
        CANDIDATE_CLIPS = get_candidate_clips(converted_path, clip_duration=5, step=2)
        
        STATUS["state"] = "completed"
        return {"message": "Video uploaded successfully"}

    except Exception as e:
        STATUS["state"] = "failed"
        return {"error": str(e)}
    

@app.get("/candidates")
def get_candidates():
    return CANDIDATE_CLIPS

@app.get("/topclips")
def get_top_clips():
    global TOP_CLIPS
    if not CANDIDATE_CLIPS:
        return {"message": "No candidates yet"}
    
    TOP_CLIPS = select_top_clips(CANDIDATE_CLIPS, top_n=3)
    return TOP_CLIPS

@app.post("/upload_youtube")
async def upload_youtube_video(request: YouTubeRequest):
    global CANDIDATE_CLIPS
    global TOP_CLIPS
    try:
        STATUS["state"] = "processing"
        CANDIDATE_CLIPS = []
        TOP_CLIPS = []

        path = "temp_video.mp4"

        ydl_opts = {
            'outtmpl': path,
            'format': 'bestvideo+bestaudio/best',
            'merge_output_format': 'mp4'
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([request.url])

        converted_path = "temp_video_h264.mp4"
        subprocess.run([
            "ffmpeg", "-i", path,
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "copy", converted_path
        ], check=True)

        CANDIDATE_CLIPS = get_candidate_clips(path, clip_duration=5, step=2)

        STATUS["state"] = "completed"
        return {"message": "YouTube video processed successfully"}

    except Exception as e:
        STATUS["state"] = "failed"
        return {"error": str(e)}