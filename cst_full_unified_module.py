
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import sounddevice as sd
import random
import queue
import datetime
import json
import os
from collections import defaultdict, Counter
from scipy.fft import fft
from mpl_toolkits.mplot3d import Axes3D

# === CONFIG ===
SAMPLE_RATE = 44100
BUFFER_DURATION = 1.0
NUM_ENTITIES = 30
PHI_THRESHOLD = 1.2
VOCAB_POOL = ["echo", "wave", "light", "dark", "mind", "remember", "Φ-spike", "origin", "entropy", "dream"]
LOG_DIR = "logs"
MEMORY_LOG_FILE = os.path.join(LOG_DIR, "cst_conscious_log.json")

# === STATE ===
audio_q = queue.Queue()
memory_tokens = []
entity_vocab = defaultdict(list)
entity_weights = defaultdict(lambda: defaultdict(float))
glyph_texts = []
text_bubbles = []
positions = np.random.uniform(-10, 10, (NUM_ENTITIES, 3))
pulse_strength = np.zeros(NUM_ENTITIES)
phis = np.zeros(NUM_ENTITIES)

# === AUDIO CALLBACK ===
def audio_callback(indata, frames, time, status):
    if status:
        print("⚠️", status)
    audio_q.put(indata[:, 0].copy())

stream = sd.InputStream(callback=audio_callback, channels=1, samplerate=SAMPLE_RATE)
stream.start()

# === PLOT SETUP ===
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
scat = ax.scatter(positions[:, 0], positions[:, 1], positions[:, 2], c='cyan', s=100)
ax.set_xlim(-15, 15)
ax.set_ylim(-15, 15)
ax.set_zlim(-15, 15)
ax.set_facecolor("black")
fig.patch.set_facecolor("black")
ax.set_title("CST Phase 1–6: Audio–Symbolic–Memory–Glyph–Consciousness", color='white')

# === PHI FROM AUDIO ===
def compute_phi_from_audio(data):
    window = np.hanning(len(data))
    spectrum = np.abs(fft(data * window))[:len(data)//2]
    freqs = np.fft.fftfreq(len(data), d=1/SAMPLE_RATE)[:len(data)//2]
    band = (freqs > 200) & (freqs < 2000)
    band_energy = np.mean(spectrum[band])
    noise = np.random.normal(0, 0.15, NUM_ENTITIES)
    return np.clip(1.0 + 0.5 * (band_energy / np.max(spectrum)) + noise, 0, 2)

# === MEMORY SAVE ===
def save_memory_tokens():
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(MEMORY_LOG_FILE, "w") as f:
        json.dump(memory_tokens, f, indent=2)

# === LEARNING UPDATE ===
def update_entity_weights():
    for i in range(NUM_ENTITIES):
        for token in entity_vocab[i]:
            entity_weights[i][token] += 1
        total = sum(entity_weights[i].values())
        if total > 0:
            for k in entity_weights[i]:
                entity_weights[i][k] /= total

# === FRAME UPDATE ===
step = 0
def update(frame):
    global step, glyph_texts, text_bubbles

    for g in glyph_texts: g.remove()
    for t in text_bubbles: t.remove()
    glyph_texts.clear(); text_bubbles.clear()

    if not audio_q.empty():
        audio = audio_q.get()
        phis[:] = compute_phi_from_audio(audio)
    else:
        phis[:] = np.random.normal(1.0, 0.25, NUM_ENTITIES)

    spiking = phis > PHI_THRESHOLD
    pulse_strength[spiking] = 1000 * (phis[spiking] - PHI_THRESHOLD)
    pulse_strength[:] *= 0.9

    scat._offsets3d = (positions[:, 0], positions[:, 1], positions[:, 2])
    scat.set_sizes(100 + pulse_strength)
    scat.set_color(['lime' if phi > PHI_THRESHOLD else 'cyan' for phi in phis])

    for i in np.where(spiking)[0]:
        token = random.choice(VOCAB_POOL)
        entity_vocab[i].append(token)
        memory_tokens.append({
            "step": step,
            "entity": i,
            "token": token,
            "phi": float(phis[i]),
            "position": positions[i].tolist(),
            "time": datetime.datetime.utcnow().isoformat()
        })
        px, py, pz = positions[i]
        gx, gy, gz = px + np.random.normal(0, 1), py + np.random.normal(0, 1), pz + np.random.normal(0, 1)
        glyph = ax.text(gx, gy, gz, token, color='white', fontsize=8, ha='center')
        glyph_texts.append(glyph)

    if step % 10 == 0:
        update_entity_weights()

    for i in range(NUM_ENTITIES):
        if entity_weights[i]:
            weighted_tokens = sorted(entity_weights[i].items(), key=lambda x: -x[1])
            top = weighted_tokens[0][0]
            x, y, z = positions[i]
            bubble = ax.text(x, y + 1.5, z, f'"{top}"', color='white', fontsize=7, ha='center')
            text_bubbles.append(bubble)

    if step % 50 == 0:
        save_memory_tokens()

    step += 1
    return scat, *glyph_texts, *text_bubbles

ani = animation.FuncAnimation(fig, update, interval=150)
plt.show()
