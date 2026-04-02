import os
import json
import numpy as np
import pandas as pd

# Paths
BASE = os.path.dirname(os.path.abspath(__file__))
TEST_CSV       = os.path.join(BASE, "exoTest.csv")
FOLDED_NPY     = os.path.join(BASE, "X_test_folded.npy")
OUT_DIR        = os.path.join(BASE, "frontend", "public", "data")

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

print("Loading exoTest.csv...")
df_test = pd.read_csv(TEST_CSV)
df_test["true_label"] = (df_test["LABEL"] == 2).astype(int)

flux_cols = [c for c in df_test.columns if c.startswith("FLUX.")]
X_test_raw = df_test[flux_cols].values.astype(np.float32)

print("Loading X_test_folded.npy...")
X_test_folded = np.load(FOLDED_NPY).astype(np.float32)

print("Computing Z-score normalization...")
means = X_test_raw.mean(axis=1, keepdims=True)
stds  = X_test_raw.std(axis=1, keepdims=True)
stds[stds == 0] = 1
X_test_norm = ((X_test_raw - means) / stds).astype(np.float32)

true_labels = df_test["true_label"].values

print("Exporting stars meta list (stars.json)...")
stars_meta = []
for i, label in enumerate(true_labels):
    stars_meta.append({
        "index": int(i),
        "true_label": int(label),
        "is_planet": bool(label == 1),
    })

with open(os.path.join(OUT_DIR, "stars.json"), "w") as f:
    json.dump(stars_meta, f, separators=(',', ':'))

print("Exporting individual star blobs (star_0.json to star_569.json)...")
for i in range(len(true_labels)):
    star_data = {
        "index": int(i),
        "true_label": int(true_labels[i]),
        "is_planet": bool(true_labels[i] == 1),
        "raw_flux": [round(float(x), 5) for x in X_test_norm[i]],
        "folded_flux": [round(float(x), 5) for x in X_test_folded[i]],
    }
    with open(os.path.join(OUT_DIR, f"star_{i}.json"), "w") as f:
        json.dump(star_data, f, separators=(',', ':'))
    
    if i % 100 == 0:
        print(f"Exported {i}/570 stars...")

print("Export Complete! 570 files written to frontend/public/data/")
