def select_top_clips(candidates, top_n=3):
    if not candidates:
        return []

    sorted_clips = sorted(candidates, key=lambda x: x["score"], reverse=True)
    top_clips = sorted_clips[:top_n]

    for i, clip in enumerate(top_clips, start=1):
        audio, motion = clip['audio_score'], clip['motion_score']
        if clip['audio_score'] == 0:
            clip['score'] = clip['motion_score']
        if motion >= audio:
            clip["reason"] = f"Clip {i} chosen for high motion (motion score={motion}). Total score: {clip['score']:.0f}"
        else:
            clip["reason"] = f"Clip {i} chosen for high audio (audio score={audio}). Total score: {clip['score']:.0f}"
    
    return top_clips