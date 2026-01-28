import numpy as np
import cv2
import librosa


def get_audio_energy(video_path, start, end):
   y, sr = librosa.load(video_path, sr=None, offset=start, duration=end-start)
   energy_score = np.mean(y**2)
   return energy_score


def get_candidate_clips(video_path, clip_duration=5, step=2):
   cap = cv2.VideoCapture(video_path)
   if not cap.isOpened():
       raise Exception("Cannot open video")


   fps = cap.get(cv2.CAP_PROP_FPS)
   total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
   duration = total_frames / fps


   candidates = []
   start_time = 0


   while start_time < duration:
       end_time = min(start_time + clip_duration, duration)
       frame_score = 0
       prev_frame = None
       valid_frame_found = False


       # For each clip sample 5 frames
       sample_times = np.linspace(start_time, end_time, 5)
       for t in sample_times:
           frame_idx = int(t * fps)
           cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
           ret, frame = cap.read()
           if not ret:
               continue
           frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.float32)
           if prev_frame is None:
               prev_frame = frame_gray
               valid_frame_found = True
               continue
           diff = np.sum(np.abs(frame_gray - prev_frame))
           frame_score += diff
           prev_frame = frame_gray

            # average per frame difference
           frame_score /= max(len(sample_times) - 1, 1)
            # average per pixel
           frame_score /= (frame_gray.shape[0] * frame_gray.shape[1])


       if valid_frame_found:
           audio_score = get_audio_energy(video_path, start_time, end_time) * 10000
           combined_score = 0.6 * frame_score + 0.4 * audio_score
           candidates.append({
               "start": float(start_time),
               "end": float(end_time),
               "motion_score": float(frame_score),
               "audio_score": float(audio_score),
               "score": float(combined_score)
           })


       start_time += step


   cap.release()
   return candidates
