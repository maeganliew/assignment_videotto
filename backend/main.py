from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from video_utils import get_candidate_clips
import time

app = FastAPI()

# Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STATUS = {"state": "idle"}
CANDIDATE_CLIPS = []

@app.get("/status")
def get_status():
    return STATUS

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    global CANDIDATE_CLIPS
    try:
        STATUS["state"] = "processing"

        path = f"uploads_{file.filename}"
        with open(path, "wb") as f:
            f.write(await file.read())

        # Extract candidate clips
        CANDIDATE_CLIPS = get_candidate_clips(path, clip_duration=5, step=2)

        STATUS["state"] = "completed"
        return {"message": "Video uploaded successfully"}

    except Exception as e:
        STATUS["state"] = "failed"
        return {"error": str(e)}
    
@app.get("/candidates")
def get_candidates():
    return CANDIDATE_CLIPS
