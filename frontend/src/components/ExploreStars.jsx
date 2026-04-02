import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import * as ort from 'onnxruntime-web';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// ─── Virtualised star list ────────────────────────────────────────────────────
// Renders only the visible rows to avoid 570 DOM nodes.
const ROW_H = 40; // pixels per row

function VirtualList({ items, selectedIndex, onSelect }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientH, setClientH] = useState(600);

  useEffect(() => {
    if (containerRef.current) setClientH(containerRef.current.clientHeight);
  }, []);

  const handleScroll = useCallback((e) => setScrollTop(e.target.scrollTop), []);

  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - 3);
  const endIdx   = Math.min(items.length, Math.ceil((scrollTop + clientH) / ROW_H) + 3);
  const visible  = items.slice(startIdx, endIdx);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * ROW_H, position: 'relative' }}>
        {visible.map((star, i) => {
          const absIdx = startIdx + i;
          const isSelected = selectedIndex === star.index;
          return (
            <div
              key={star.index}
              onClick={() => onSelect(star.index)}
              style={{ position: 'absolute', top: absIdx * ROW_H, width: '100%', height: ROW_H }}
              className={`flex items-center justify-between px-3 cursor-pointer text-sm transition-colors ${
                isSelected
                  ? 'bg-muted text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-muted/40'
              }`}
            >
              <span>Star {star.index}</span>
              {star.is_planet && (
                <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                  Host
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Plot config shared ────────────────────────────────────────────────────────
const commonLayout = (xTitle, yTitle) => ({
  height: 320,
  margin: { l: 60, r: 20, t: 16, b: 56 },
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font: { family: '"Space Grotesk", sans-serif', color: '#6B7280', size: 12 },
  xaxis: {
    title: { text: xTitle, standoff: 12, font: { color: '#6B7280', size: 11 } },
    color: '#6B7280',
    showgrid: false,
    zeroline: false,
    linecolor: '#2A2A2A',
    tickcolor: '#2A2A2A',
  },
  yaxis: {
    title: { text: yTitle, standoff: 12, font: { color: '#6B7280', size: 11 } },
    color: '#6B7280',
    gridcolor: '#1A1A1A',
    zeroline: false,
    linecolor: '#2A2A2A',
    tickcolor: '#2A2A2A',
  },
});
const plotConfig = { responsive: true, displayModeBar: false };

// ─── Main component ────────────────────────────────────────────────────────────
export default function ExploreStars() {
  const [stars,        setStars]        = useState([]);
  const [filter,       setFilter]       = useState('all');
  const [apiError,     setApiError]     = useState(false);
  const [loadingList,  setLoadingList]  = useState(true);

  const [selectedIdx,  setSelectedIdx]  = useState(null);
  const [starData,     setStarData]     = useState(null);
  const [loadingStar,  setLoadingStar]  = useState(false);
  const [starError,    setStarError]    = useState(false);

  const [modelRunning, setModelRunning] = useState(false);
  const [modelResult,  setModelResult]  = useState(null);
  const [modelError,   setModelError]   = useState(false);

  // ── fetch star list ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Fetch the 15KB static dataset registry instead of waiting for a backend to boot 
    axios.get(`/data/stars.json`, { timeout: 10000 })
      .then(res => {
        setStars(res.data);
        setLoadingList(false);
      })
      .catch(() => {
        setApiError(true);
        setLoadingList(false);
      });
  }, []);

  // ── fetch selected star data ─────────────────────────────────────────────────
  useEffect(() => {
    if (selectedIdx === null) return;
    setStarData(null);
    setModelResult(null);
    setModelError(false);
    setStarError(false);
    setLoadingStar(true);

    // Fetch individual ~40KB static JSON payload instantly
    axios.get(`/data/star_${selectedIdx}.json`, { timeout: 8000 })
      .then(res => {
        setStarData(res.data);
        setLoadingStar(false);
      })
      .catch(() => {
        setStarError(true);
        setLoadingStar(false);
      });
  }, [selectedIdx]);

  // ── run model ────────────────────────────────────────────────────────────────
  const handleRunModel = async () => {
    if (!starData) return;
    setModelRunning(true);
    setModelResult(null);
    setModelError(false);
    try {
      // 1. Initialize ONNX runtime session (Downloads once, caches internally)
      const session = await ort.InferenceSession.create('/model.onnx');
      
      // 2. Perform Client-Side Z-Score Normalization
      const flux = starData.raw_flux;
      const mean = flux.reduce((a, b) => a + b, 0) / flux.length;
      const std = Math.sqrt(flux.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / flux.length) || 1;
      const normalizedFlux = Float32Array.from(flux, x => (x - mean) / std);
      
      // 3. Create WebGL/WASM Tensor Payload
      const tensor = new ort.Tensor('float32', normalizedFlux, [1, 3197, 1]);
      const feeds = { [session.inputNames[0]]: tensor };
      
      // 4. Execute Edge AI Inference Graph
      const results = await session.run(feeds);
      const prob = results[session.outputNames[0]].data[0];
      const prediction = prob >= 0.5 ? 1 : 0;
      
      setModelResult({
        probability: Number(prob.toFixed(6)),
        prediction: prediction,
        is_planet_detected: prediction === 1
      });
    } catch (err) {
      console.error("[Edge AI Error]", err);
      setModelError(true);
    } finally {
      setModelRunning(false);
    }
  };

  // ── derived ──────────────────────────────────────────────────────────────────
  const counts = { planet: stars.filter(s => s.is_planet).length, total: stars.length };
  const filteredStars = stars.filter(s => {
    if (filter === 'planet')     return s.is_planet;
    if (filter === 'non-planet') return !s.is_planet;
    return true;
  });

  const filters = [
    { id: 'all',        label: `All (${counts.total})` },
    { id: 'planet',     label: `Planet Hosts (${counts.planet})` },
    { id: 'non-planet', label: `Non-Planet (${counts.total - counts.planet})` },
  ];

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pt-2">
      <h2 className="text-3xl font-bold mb-8 tracking-tight text-white shrink-0">
        Explore Kepler Data
      </h2>

      <div className="flex-1 grid grid-cols-12 gap-10 min-h-0">

        {/* ── LEFT: Star list ─────────────────────────────────────────────── */}
        <div className="col-span-3 border-r border-border pr-6 flex flex-col min-h-0">

          {/* Filter tabs */}
          <div className="shrink-0 mb-5 space-y-2">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`block w-full text-left text-sm py-1 transition-colors ${
                  filter === f.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          {apiError ? (
            <div className="text-sm text-gray-600 leading-relaxed">
              Failed to load dataset.<br />
              Please refresh the page.
            </div>
          ) : loadingList ? (
            <div className="text-sm text-gray-600">Loading dataset…</div>
          ) : (
            <VirtualList
              items={filteredStars}
              selectedIndex={selectedIdx}
              onSelect={(idx) => {
                setSelectedIdx(idx);
                setModelResult(null);
              }}
            />
          )}
        </div>

        {/* ── RIGHT: Star detail ──────────────────────────────────────────── */}
        <div className="col-span-9 overflow-y-auto pb-12 pr-2 min-h-0">

          {selectedIdx === null ? (
            <div className="flex h-64 items-center justify-center text-gray-600 border border-border text-sm">
              Select a star from the list to begin exploring.
            </div>
          ) : loadingStar ? (
            <div className="flex h-64 items-center justify-center text-gray-600 border border-border text-sm">
              Loading measurements for Star {selectedIdx}…
            </div>
          ) : starError ? (
            <div className="flex h-64 items-center justify-center text-gray-600 border border-border text-sm">
              Failed to load data for Star {selectedIdx}. Please refresh the page.
            </div>
          ) : starData ? (
            <div className="space-y-10">

              {/* Star header */}
              <div className="border-b border-border pb-5 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Star #{starData.index}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">
                    {starData.is_planet ? 'Confirmed Planet Host' : 'Non-Planet Star'}
                  </p>
                </div>
              </div>

              {/* Raw light curve */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Raw Light Curve
                </p>
                <Plot
                  data={[{
                    y: starData.raw_flux,
                    x: starData.raw_flux.map((_, i) => i),
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#4A90E2', width: 1 },
                    hovertemplate: 'Measurement %{x}<br>Flux: %{y:.4f}<extra></extra>',
                  }]}
                  layout={commonLayout('Measurement Number', 'Flux (Relative Brightness)')}
                  config={plotConfig}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Phase folded curve */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Phase Folded Light Curve
                </p>
                <Plot
                  data={[{
                    y: starData.folded_flux,
                    x: starData.folded_flux.map((_, i) => i),
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#E8A838', width: 2 },
                    hovertemplate: 'Phase Bin %{x}<br>Flux: %{y:.4f}<extra></extra>',
                  }]}
                  layout={commonLayout('Phase (Bins)', 'Flux')}
                  config={plotConfig}
                  style={{ width: '100%' }}
                />
                <p className="text-xs text-gray-600 mt-3 leading-relaxed max-w-2xl">
                  The phase folded curve stacks all repeating transit signals on top of each
                  other, amplifying the planet signal and canceling random noise.
                </p>
              </div>

              {/* Run model */}
              <div className="border border-border p-8">
                <button
                  onClick={handleRunModel}
                  disabled={modelRunning}
                  className="text-sm uppercase tracking-[0.2em] border-b pb-1 transition-colors disabled:opacity-40
                    text-accent border-accent hover:opacity-70"
                >
                  {modelRunning ? 'Analysing…' : 'Analyse This Star'}
                </button>
                <p className="text-[10px] text-gray-600 mt-2">
                  Runs the trained 1D CNN locally in your browser via WebAssembly — no server required.
                </p>

                {modelError && (
                  <p className="mt-6 text-sm text-gray-600">
                    Inference failed. The model file may still be loading — please try again in a moment.
                  </p>
                )}

                {modelResult && (() => {
                  const pct          = (modelResult.probability * 100).toFixed(1);
                  const pred         = modelResult.prediction;
                  const actual       = starData.is_planet;
                  const correct      = (pred === 1) === actual;

                  // Four distinct cases
                  const isTruePositive  = pred === 1 && actual === true;
                  const isTrueNegative  = pred === 0 && actual === false;
                  const isFalsePositive = pred === 1 && actual === false;
                  const isFalseNegative = pred === 0 && actual === true;

                  return (
                    <div className="mt-8 space-y-10">

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-8 border-t border-border pt-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Confidence</p>
                          <p className="text-2xl font-bold text-white">{pct}%</p>
                          <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                            The sigmoid output of the neural network, representing how certain the model is that a planet signal is present.
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Prediction</p>
                          <p className="text-2xl font-bold text-white">
                            {pred === 1 ? 'Planet Detected' : 'No Planet Detected'}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                            Threshold: 0.5. Confidence above 50% classifies the star as a planet host.
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">Ground Truth</p>
                          <p className="text-2xl font-bold text-white">
                            {actual ? 'Planet Host' : 'Non-Planet'}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                            The confirmed label from the Kepler dataset — this is the real, verified answer.
                          </p>
                        </div>
                      </div>

                      {/* Rich explanation block */}
                      <div className={`border-t pt-8 space-y-4 ${correct ? 'border-border' : 'border-border'}`}>

                        {/* ── True Positive ── */}
                        {isTruePositive && (
                          <>
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="text-[10px] uppercase tracking-widest text-accent">True Positive</span>
                              <span className="text-[10px] text-gray-600">Prediction: Planet / Reality: Planet</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              This is a real world orbiting a distant star. The CNN correctly identified the periodic
                              transit signature embedded in this star's light curve.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              A true positive is the rarest and most meaningful outcome for this model. Out of only
                              5 confirmed planet hosts in the entire 570-star test set, the model found <strong className="text-gray-300">2</strong>.
                              This star is one of them. The convolutional layers learned to recognize the characteristic
                              bathtub-shaped dip — a flat drop in flux maintained for a predictable duration — repeating
                              at the planet's orbital period. With a confidence of {pct}%, the model assigned a strong
                              planet signal to this light curve.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              Zoom into the raw light curve above and look for repeating downward spikes at regular
                              intervals. Those dips are the planet transiting — physically blocking a fraction
                              of the star's light as it passes between the star and Kepler's detector.
                            </p>
                          </>
                        )}

                        {/* ── True Negative ── */}
                        {isTrueNegative && (
                          <>
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="text-[10px] uppercase tracking-widest text-gray-400">True Negative</span>
                              <span className="text-[10px] text-gray-600">Prediction: No Planet / Reality: No Planet</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              The model correctly determined that this star has no detectable planet. No periodic
                              transit signature was found in the light curve.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              This is the expected outcome for the vast majority of stars. In the test set, 565 of 570
                              stars are confirmed non-planet hosts. The model's confidence of {pct}% means the CNN
                              found no meaningful repeating dip — only the kind of irregular, non-periodic brightness
                              variations that come from stellar noise, flares, and instrumental drift.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              Look at the raw light curve — the variations you see are real, but they are random.
                              They don't repeat at a fixed interval, which is the key difference. Without periodicity,
                              there is no transit signal, and without a transit there is no planet.
                            </p>
                          </>
                        )}

                        {/* ── False Positive ── */}
                        {isFalsePositive && (
                          <>
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="text-[10px] uppercase tracking-widest text-gray-400">False Positive</span>
                              <span className="text-[10px] text-gray-600">Prediction: Planet / Reality: No Planet</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              The model predicted a planet here, but none has been confirmed. This is a false alarm.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              CNN v1 produced 3 false positives across the full test set. A false positive happens
                              when a non-periodic pattern in the light curve happens to resemble a transit signal
                              closely enough to fool the model. Common causes include stellar flares — sudden, sharp
                              brightness drops caused by magnetic activity on the star's surface — or instrumental
                              artifacts introduced by the Kepler telescope itself.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              With a confidence of {pct}%, the model was convinced enough to flag this star. In a
                              real search pipeline, this star would be passed to human astronomers for follow-up
                              observation. A second measurement using radial velocity — detecting the star's subtle
                              wobble caused by a planet's gravitational pull — would immediately rule out a false alarm,
                              since no wobble would be observed.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              False positives are a cost of sensitivity. A model tuned to find every real planet
                              will inevitably flag some non-planets. The trade-off between recall and precision is
                              at the core of this entire problem.
                            </p>
                          </>
                        )}

                        {/* ── False Negative ── */}
                        {isFalseNegative && (
                          <>
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="text-[10px] uppercase tracking-widest text-gray-400">False Negative</span>
                              <span className="text-[10px] text-gray-600">Prediction: No Planet / Reality: Planet</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              This star has a confirmed planet host, but its signature falls below the current
                              detection threshold of the model.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              In exoplanet science, many "real" planets are nearly invisible in raw light curves.
                              With a confidence of {pct}%, the CNN did not find a strong enough repeating pattern
                               here to trigger a positive detection. This is often because the signal-to-noise
                              ratio (SNR) is too low for the model's current sensitivity level.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              Several physical factors contribute to these detection challenges. If the planet is
                              very small (like Earth compared to the Sun), the dip in brightness is almost
                              imperceptible against the star's natural flickering. If the orbit is very long, 
                              Kepler may have only captured one or two transits—not enough for the convolutional 
                              filters to differentiate a pattern from random noise.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              This case highlights the importance of "Recall" in science. While CNN v1 is excellent
                              at avoiding most false alarms, these subtle "edge cases" are where next-generation
                              models—using deeper architectures and more diverse training data—aim to improve.
                              In a real-world pipeline, this star would likely be flagged for advanced multi-stage
                              processing or manual review by a citizen science team.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
