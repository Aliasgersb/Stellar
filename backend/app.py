import os
import sys
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ─── Paths ───────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEST_CSV       = os.path.join(BASE, "exoTest.csv")
FOLDED_NPY     = os.path.join(BASE, "X_test_folded.npy")
MODEL_PATH     = os.path.join(BASE, "cnn_model.h5")

# ─── Load data once on startup ────────────────────────────────────────────────
print("Loading exoTest.csv …", flush=True)
df_test = pd.read_csv(TEST_CSV)

# The CSV has a LABEL column (2 = planet, 1 = not planet)
# Convert to binary: 1 = planet, 0 = not planet
df_test["true_label"] = (df_test["LABEL"] == 2).astype(int)

# Flux values are columns FLUX.1 … FLUX.3197
flux_cols = [c for c in df_test.columns if c.startswith("FLUX.")]
X_test_raw = df_test[flux_cols].values.astype(np.float32)  # (570, 3197)

# MEMORY OPTIMISATION: Drop flux columns from DataFrame once they are in the array
# This saves ~30MB of RAM.
df_test.drop(columns=flux_cols, inplace=True)
import gc
gc.collect()

print("Loading X_test_folded.npy …", flush=True)
X_test_folded = np.load(FOLDED_NPY).astype(np.float32)     # (570, 200)

# Z-score normalise raw flux row-wise (mirrors training preprocessing)
means = X_test_raw.mean(axis=1, keepdims=True)
stds  = X_test_raw.std(axis=1, keepdims=True)
stds[stds == 0] = 1
X_test_norm = (X_test_raw - means) / stds

true_labels = df_test["true_label"].values  # (570,)

# ─── Load model ──────────────────────────────────────────────────────────────
model = None
def load_model():
    global model
    try:
        import tensorflow as tf
        print(f"TensorFlow {tf.__version__} – loading {MODEL_PATH} …", flush=True)
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded OK.", flush=True)
    except Exception as e:
        print(f"[WARNING] Could not load model: {e}", flush=True)

load_model()

# ─── Routes ──────────────────────────────────────────────────────────────────

@app.route("/stars", methods=["GET"])
def get_stars():
    """Return metadata for all 570 test stars."""
    stars = []
    for i, label in enumerate(true_labels):
        stars.append({
            "index": int(i),
            "true_label": int(label),
            "is_planet": bool(label == 1),
        })
    return jsonify(stars)


@app.route("/star/<int:index>", methods=["GET"])
def get_star(index):
    """Return raw flux, folded flux, and label for one star."""
    if index < 0 or index >= len(true_labels):
        return jsonify({"error": "Index out of range"}), 404

    return jsonify({
        "index": index,
        "true_label": int(true_labels[index]),
        "is_planet": bool(true_labels[index] == 1),
        "raw_flux": X_test_norm[index].tolist(),
        "folded_flux": X_test_folded[index].tolist(),
    })


@app.route("/predict", methods=["POST"])
def predict():
    """Run CNN v1 on a provided flux array."""
    if model is None:
        return jsonify({"error": "Model not loaded on server"}), 503

    body = request.get_json(silent=True)
    if not body or "flux" not in body:
        return jsonify({"error": "Expected JSON body with key 'flux'"}), 400

    flux = np.array(body["flux"], dtype=np.float32)
    if flux.shape[0] != 3197:
        return jsonify({"error": f"Expected 3197 flux values, got {flux.shape[0]}"}), 400

    # Reshape for CNN: (1, 3197, 1)
    x = flux.reshape(1, 3197, 1)
    prob = float(model.predict(x, verbose=0)[0][0])
    prediction = int(prob >= 0.5)

    return jsonify({
        "probability": round(prob, 6),
        "prediction": prediction,
        "is_planet_detected": bool(prediction == 1),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
