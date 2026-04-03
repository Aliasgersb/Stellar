import React from 'react';

const Section = ({ title, children }) => (
  <section className="mb-20">
    <h3 className="text-xl font-bold text-white mb-6 tracking-tight border-b border-border pb-4">{title}</h3>
    <div className="text-gray-400 leading-[1.9] text-[0.97rem] space-y-5">{children}</div>
  </section>
);

const DiagramContainer = ({ children, caption }) => (
  <div className="my-10">
    <div className="border border-border py-12 px-6 bg-[#0A0A0A] flex items-center justify-center overflow-x-auto rounded-sm">
      {children}
    </div>
    {caption && <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-4 text-center">{caption}</p>}
  </div>
);

const TransitDiagram = () => (
  <div className="w-full max-w-md flex flex-col items-center min-w-[300px]">
    <svg viewBox="0 0 400 120" className="w-full overflow-visible">
      {/* Grid line */}
      <line x1="0" y1="30" x2="400" y2="30" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="4 4" />
      {/* Light Curve */}
      <path 
        d="M 0 30 L 140 30 L 160 90 L 240 90 L 260 30 L 400 30" 
        fill="none" 
        stroke="#4A90E2" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      {/* Labels */}
      <text x="0" y="20" fill="#6B7280" fontSize="10" fontFamily="monospace">Relative Flux (1.0)</text>
      <text x="200" y="110" fill="#E8A838" fontSize="10" fontFamily="monospace" textAnchor="middle">Transit Trough (Planet passes star)</text>
      {/* Guide lines */}
      <line x1="140" y1="30" x2="140" y2="90" stroke="#E8A838" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      <line x1="260" y1="30" x2="260" y2="90" stroke="#E8A838" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      {/* Depth bracket */}
      <path d="M 380 30 L 390 30 L 390 90 L 380 90" fill="none" stroke="#6B7280" strokeWidth="1" opacity="0.5" />
      <text x="395" y="63" fill="#6B7280" fontSize="10" fontFamily="monospace">Depth</text>
    </svg>
  </div>
);

const SMOTETable = () => (
  <div className="w-full max-w-lg mx-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left font-normal text-gray-500 py-3 pr-6 text-xs uppercase tracking-widest">Dataset Phase</th>
          <th className="text-right font-normal text-gray-500 py-3 px-4 text-xs uppercase tracking-widest">Planet Hosts</th>
          <th className="text-right font-normal text-gray-500 py-3 pl-4 text-xs uppercase tracking-widest">Non-Planets</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border/40 hover:bg-white/5 transition-colors">
          <td className="py-4 pr-6 text-gray-300">Raw Kepler Training Data</td>
          <td className="py-4 px-4 text-right text-gray-400">37 <span className="text-[10px] text-gray-600 block">(0.73%)</span></td>
          <td className="py-4 pl-4 text-right text-gray-400">5,050 <span className="text-[10px] text-gray-600 block">(99.27%)</span></td>
        </tr>
        <tr className="hover:bg-white/5 transition-colors">
          <td className="py-4 pr-6 text-gray-300">After SMOTE <span className="text-[10px] text-accent block uppercase mt-1">Synthetic Balancing</span></td>
          <td className="py-4 px-4 text-right text-accent font-semibold">5,050 <span className="text-[10px] text-accent/50 block">(50%)</span></td>
          <td className="py-4 pl-4 text-right text-gray-400">5,050 <span className="text-[10px] text-gray-500 block">(50%)</span></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const CNNArchitecture = () => (
  <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-3xl font-mono text-xs gap-3 md:gap-0 mx-auto">
    <div className="flex flex-col items-center">
      <div className="px-4 py-3 border border-border bg-dark text-gray-300 w-32 text-center rounded-sm">
        Input
        <div className="text-[10px] text-gray-500 mt-1">Raw Flux Array</div>
        <div className="text-[10px] text-gray-500">(3197, 1)</div>
      </div>
    </div>

    <div className="h-6 w-px md:w-6 md:h-px bg-border flex-shrink-0 relative">
      <div className="hidden md:block absolute right-0 top-[-3px] w-2 h-2 border-t border-r border-border transform rotate-45"></div>
      <div className="md:hidden absolute bottom-0 left-[-3px] w-2 h-2 border-b border-r border-border transform rotate-45"></div>
    </div>

    <div className="flex flex-col gap-2">
      <div className="px-4 py-3 border border-accent/20 bg-[#120F08] text-accent w-32 text-center rounded-sm">
        Conv1D
        <div className="text-[10px] text-accent/60 mt-1">Filters: 8</div>
        <div className="text-[10px] text-accent/60">ReLU</div>
      </div>
      <div className="px-4 py-2 border border-border/50 bg-dark text-gray-400 w-32 text-center text-[10px] rounded-sm">
        MaxPool1D
      </div>
    </div>

    <div className="h-6 w-px md:w-6 md:h-px bg-border flex-shrink-0 relative">
      <div className="hidden md:block absolute right-0 top-[-3px] w-2 h-2 border-t border-r border-border transform rotate-45"></div>
      <div className="md:hidden absolute bottom-0 left-[-3px] w-2 h-2 border-b border-r border-border transform rotate-45"></div>
    </div>

    <div className="flex flex-col gap-2">
      <div className="px-4 py-3 border border-accent/20 bg-[#120F08] text-accent w-32 text-center rounded-sm">
        Conv1D
        <div className="text-[10px] text-accent/60 mt-1">Filters: 16</div>
        <div className="text-[10px] text-accent/60">ReLU</div>
      </div>
      <div className="px-4 py-2 border border-border/50 bg-dark text-gray-400 w-32 text-center text-[10px] rounded-sm">
        MaxPool1D
      </div>
      <div className="px-4 py-2 border border-border/50 bg-dark text-gray-500 w-32 text-center text-[10px] rounded-sm border-dashed">
        Dropout
        <div className="text-[10px] text-gray-600">rate: 0.5</div>
      </div>
    </div>

    <div className="h-6 w-px md:w-6 md:h-px bg-border flex-shrink-0 relative">
      <div className="hidden md:block absolute right-0 top-[-3px] w-2 h-2 border-t border-r border-border transform rotate-45"></div>
      <div className="md:hidden absolute bottom-0 left-[-3px] w-2 h-2 border-b border-r border-border transform rotate-45"></div>
    </div>

    <div className="flex flex-col items-center">
      <div className="px-4 py-3 border border-border bg-dark text-white w-32 text-center rounded-sm">
        Dense
        <div className="text-[10px] text-gray-500 mt-1">Units: 16</div>
        <div className="text-[10px] text-gray-500">Activ: Sigmoid</div>
      </div>
    </div>
  </div>
);

const CompareTable = () => (
  <div className="w-full max-w-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
    <div className="bg-[#0A0A0A] p-6 text-center">
      <h4 className="text-gray-300 font-mono text-sm mb-3">Random Forest</h4>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        Treats points independently. Cannot detect repeating shapes over time.
      </p>
      <div className="text-gray-400 font-mono text-xs">Result: 0 Planets</div>
    </div>
    <div className="bg-[#120F08] p-6 text-center">
      <h4 className="text-accent font-mono text-sm mb-3">CNN v1</h4>
      <p className="text-xs text-[#E8A838]/70 leading-relaxed mb-4">
        Scans sequence structurally. Understands periodic transit dependencies.
      </p>
      <div className="text-accent font-mono font-bold text-xs">Result: 2 Planets</div>
    </div>
  </div>
);

const PhaseFoldingDiagram = () => (
  <div className="w-full max-w-sm flex flex-col items-center gap-5 py-6 min-w-[280px]">
    
    {/* Raw Time Series */}
    <div className="w-full border border-border p-5 relative bg-[#0A0A0A] rounded-sm">
      <div className="absolute top-3 left-4 text-[9px] uppercase tracking-widest text-gray-500 font-medium">Raw Time Series</div>
      <svg viewBox="0 0 300 40" className="w-full mt-6">
        {/* Subtle grid line */}
        <line x1="0" y1="20" x2="300" y2="20" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="2 2" />
        {/* Stylized realistic light curve */}
        <path 
          d="M 0 20 L 15 19 L 30 21 L 40 19 L 45 20 L 52 35 L 58 35 L 65 20 L 80 21 L 95 19 L 110 20 L 125 19 L 132 20 L 139 35 L 145 35 L 152 20 L 165 21 L 180 19 L 195 20 L 210 20 L 218 19 L 225 20 L 232 35 L 238 35 L 245 20 L 260 21 L 275 19 L 290 20 L 300 19" 
          fill="none" 
          stroke="#6B7280" 
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
    
    {/* Connector */}
    <div className="flex flex-col items-center justify-center gap-1.5 text-gray-500">
      <div className="h-4 w-px bg-border"></div>
      <div className="text-[10px] uppercase tracking-widest bg-[#0A0A0A] z-10 px-2 font-medium">Fold on Orbital Period</div>
      <div className="h-4 w-px bg-border relative">
        <div className="absolute bottom-0 left-[-3px] w-2 h-2 border-b border-r border-border transform rotate-45"></div>
      </div>
    </div>
    
    {/* Phase Folded Curve */}
    <div className="w-full border border-accent/20 bg-[#120F08] p-5 relative rounded-sm shadow-[0_0_15px_rgba(232,168,56,0.03)]">
     <div className="absolute top-3 left-4 text-[9px] uppercase tracking-widest text-accent font-medium">Phase Folded Curve</div>
      <svg viewBox="0 0 300 50" className="w-full mt-6 bg-transparent">
        {/* Baseline & Trough guidelines */}
        <line x1="0" y1="20" x2="300" y2="20" stroke="#E8A838" strokeWidth="1" strokeDasharray="2 2" opacity="0.15" />
        <line x1="0" y1="40" x2="300" y2="40" stroke="#E8A838" strokeWidth="1" strokeDasharray="2 2" opacity="0.15" />
        
        {/* Ambient Glow */}
        <path 
          d="M 0 20 L 110 20 L 130 40 L 170 40 L 190 20 L 300 20" 
          fill="none" 
          stroke="#E8A838" 
          strokeWidth="6" 
          opacity="0.15"
          strokeLinejoin="round"
        />
        {/* Crisp Main Curve */}
        <path 
          d="M 0 20 L 110 20 L 130 40 L 170 40 L 190 20 L 300 20" 
          fill="none" 
          stroke="#E8A838" 
          strokeWidth="2" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

export default function HowItWorks() {
  return (
    <div className="max-w-3xl pt-2 pb-20">
      <h2 className="text-3xl font-bold mb-4 tracking-tight text-white">How It Works</h2>
      <p className="text-gray-500 text-sm mb-16">
        A technical walkthrough of the science, the data, and the machine learning methodology.
      </p>

      <Section title="What are exoplanets and why do we search for them">
        <p>
          Exoplanets are planets orbiting stars outside our solar system. As of 2024, over 5,500
          have been confirmed. We search for them because they represent the first step toward
          answering one of the oldest questions in science: is life a singular accident, or does
          it emerge wherever conditions allow?
        </p>
        <p>
          The Kepler Space Telescope, launched in 2009 and retired in 2018, stared continuously
          at a patch of sky containing roughly 150,000 stars. Every 30 minutes it recorded the
          brightness of every star in its field of view — producing one of the most complete
          stellar time-series datasets ever assembled.
        </p>
      </Section>

      <Section title="The transit method — how a planet reveals itself">
        <p>
          When a planet passes directly in front of its star from Earth's perspective, it blocks
          a tiny fraction of the star's light. This causes a brief, repeating dip in the star's
          measured brightness. The Earth transiting our Sun as seen from a distant star would
          cause a 0.008% decrease in brightness — 8 parts in 100,000. Kepler was sensitive
          enough to detect dips of this magnitude.
        </p>
        
        <DiagramContainer caption="Anatomy of a planetary transit light curve">
          <TransitDiagram />
        </DiagramContainer>

        <p>
          The shape of the dip is recognizable. The star's light curve drops sharply, holds at a
          reduced level — forming a characteristic flat-bottomed trough — then rises again as the
          planet passes. This bathtub-shaped pattern, repeating at the planet's orbital period,
          is the fingerprint of a transit. A real planet producing multiple transits over years of
          observation creates a repeating, periodic signal embedded in the light curve.
        </p>
      </Section>

      <Section title="The dataset and the class imbalance problem">
        <p>
          The Kepler labeled time series dataset contains 5,087 training stars. Of these, only 37
          are confirmed planet hosts — 0.73% of the data. The remaining 5,050 are non-planet
          stars. This is a severe class imbalance. A naive classifier that labels every single
          star as a non-planet achieves 99.3% accuracy and finds exactly zero planets.
        </p>
        
        <DiagramContainer caption="Training data distribution before and after SMOTE application">
          <SMOTETable />
        </DiagramContainer>

        <p>
          To address this, SMOTE — Synthetic Minority Oversampling Technique — was applied during
          training. SMOTE generates new synthetic planet examples by interpolating between real
          ones in feature space: selecting two known planet light curves, creating a weighted
          midpoint between them, and treating that as a new training example. This brought the
          training distribution to 5,050 planet and 5,050 non-planet examples. The test set of
          570 stars was left untouched.
        </p>
      </Section>

      <Section title="Why Random Forest failed">
        <p>
          The first model attempted was a Random Forest classifier with 100 decision trees,
          treating each of the 3,197 flux values as an independent feature. A decision tree asks
          yes/no questions: "Is flux measurement 847 less than –0.3?" It builds a branching
          structure of such questions on each of its trees, then aggregates all 100 votes.
        </p>
        
        <DiagramContainer caption="Fundamental architectural difference in approach">
          <CompareTable />
        </DiagramContainer>

        <p>
          The fundamental problem is that Random Forest has no concept of sequence, order, or
          periodicity. A planet transit is not a property of individual flux values — it is a
          shape that appears at specific positions in time and repeats at a fixed interval. Knowing
          that measurement 1,200 has a particular value tells you nothing in isolation. The
          relationship between measurements 1,198, 1,199, 1,200, 1,201, and 1,202 is what matters.
          Random Forest cannot reason about this relationship. It found zero planets out of five.
        </p>
      </Section>

      <Section title="Why a Convolutional Neural Network works">
        <p>
          A 1D Convolutional Neural Network processes the light curve as a sequence. A
          convolutional filter — a small window of fixed width — slides across the entire 3,197
          measurements one step at a time. At each position, it computes a weighted sum of the
          values in the window, learning to activate strongly when it detects a particular local
          pattern. After training, the first convolutional layer develops filters that respond to
          sharp dips in flux. The second learns that these dips carry significance only when they
          repeat periodically.
        </p>
        
        <DiagramContainer caption="The 1D CNN architecture used in this application">
          <CNNArchitecture />
        </DiagramContainer>

        <p>
          The architecture used here has two convolutional layers each followed by max pooling,
          a fully connected dense layer, dropout regularization, and a sigmoid output. It was
          trained on the SMOTE-balanced dataset for 10 epochs with a class weight of 2 applied
          to planet examples. Using a prediction threshold of 0.5, it found 2 of the 5 real
          planets in the test set.
        </p>
      </Section>

      <Section title="Phase folding">
        <p>
          Phase folding is a signal processing technique that amplifies a periodic signal by
          stacking all its repetitions on top of each other. Given an estimate of the planet's
          orbital period, each of the 3,197 flux measurements is assigned a phase value between
          0 and 1 based on where it falls within the orbit. Measurements from different orbits
          that share the same phase are averaged together.
        </p>

        <DiagramContainer caption="Signal-to-noise amplification via phase folding">
          <PhaseFoldingDiagram />
        </DiagramContainer>

        <p>
          The result: random noise — which has no preferred phase — cancels out across the
          average. The transit signal — which appears at the same phase every orbit — grows
          stronger with each orbit stacked. A light curve that showed a noisy, hard-to-see dip
          is transformed into a clean 200-bin curve with a single unmistakable trough where the
          planet transit occurs. The lightkurve library's Box Least Squares (BLS) algorithm was
          used to estimate the best orbital period for each star.
        </p>
        <p>
          Phase folding was used as the input preprocessing stage for CNN v2 (BLS period
          estimation), CNN v3, and CNN v4 (custom period estimation). Each of these models
          received a 200-bin folded curve as input rather than the raw 3,197-point sequence.
          Understanding how this choice affected their results is covered in the next section.
        </p>
      </Section>

      <Section title={<span id="why-cnn-v1">Why CNN v1 was chosen — the full experiment</span>}>
        <p>
          Four CNN architectures were trained across different data preparation strategies and
          evaluated on the same 570-star test set. Here is what each one taught us, and why
          the results came out the way they did.
        </p>

        <div className="border-l-2 border-border pl-5 space-y-6 my-2">

          <div>
            <p className="text-white text-sm font-semibold mb-1">CNN v2 & v3 — Phase folded models &nbsp;<span className="text-gray-600 font-normal text-xs">Result: 1 / 5 planets</span></p>
            <div className="space-y-4">
              <p>
                Phase folding is theoretically superior because it acts like stacking sliced paper: it places all transits exactly on top of each other to cancel noise and create one deep, clear dip. However, it requires an automated algorithm (like BLS) to mathematically guess the planet's exact orbital period first. On this specific dataset, both phase-folded models failed for two verified mathematical reasons:
              </p>
              <div className="pl-4 border-l border-border/50 space-y-3 pb-1 text-[0.95rem]">
                <p>
                  <strong className="text-gray-300 font-semibold">1. The 66-day Window constraint:</strong> The Kaggle dataset is chopped into 66-day snippets (3,197 measurements). An Earth-like planet takes 365 days to orbit, meaning it would transit at most <em>once</em> in this data. Algorithms require at least three transits to calculate a repeating period. If the orbit takes longer than ~22 days, automated mathematical folding is completely impossible.
                </p>
                <p>
                  <strong className="text-gray-300 font-semibold">2. Harmonic Aliasing:</strong> Even for planets with short orbits that transit frequently (like Star 3), period-finding algorithms easily suffer from "aliasing." They get confused by the math and confidently select a multiple of the true period (e.g. guessing 16 days instead of 4). When folded over an incorrectly wide window, the cuts don't stack perfectly; instead, multiple jagged, messy dips are smeared side-by-side.
                </p>
              </div>
              <p>
                When the automated folding guessed the period incorrectly, it completely destroyed the transit shape, feeding corrupted data to both CNN v2 and CNN v3. This explains why they failed to detect planets that were visibly obvious to the human eye in the raw data.
              </p>
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-1">CNN v4 — Custom phase folded, 2-layer &nbsp;<span className="text-gray-600 font-normal text-xs">Result: 2 / 5 planets — 6 false positives</span></p>
            <p>
              Reducing back to a 2-layer architecture recovered the recall — CNN v4 found
              2 of 5 planets, matching CNN v1. But the noisy phase-folded input introduced
              a new problem: 6 false positives, double CNN v1's count. Imperfect period
              estimates left artifacts in the folded curves that the model learned to treat
              as planet signals. CNN v4 proves the preprocessing pipeline was the bottleneck,
              not the architecture.
            </p>
          </div>

          <div>
            <p className="text-white text-sm font-semibold mb-1">CNN v1 — Raw normalized flux, 2-layer &nbsp;<span className="text-accent text-xs font-normal">Selected ✓ — 2 / 5 planets, 3 false positives</span></p>
            <p>
              CNN v1 skipped phase folding entirely, training directly on the raw Z-score
              normalized 3,197-point flux sequence. No preprocessing step means no opportunity
              for preprocessing errors to corrupt the signal. The 2-layer architecture was
              exactly right for a 37-sample minority class: expressive enough to learn transit
              shapes, constrained enough to avoid overfitting. It matched CNN v4's recall
              while producing half the false alarms.
            </p>
          </div>
        </div>

        <p>
          The core lesson: <strong className="text-white">simpler is not always worse.</strong> When
          a training set has only 37 real examples of the target class, a modest architecture
          that trusts the raw data often outperforms a sophisticated one that introduces
          preprocessing steps with their own failure modes.
        </p>
        <p>
          It is also important to emphasise that CNN v2, v3 and v4 are not failures.
          Each one answered a specific question. The Random Forest baseline proved sequence
          understanding is essential. The phase-folded CNNs proved that sophisticated
          preprocessing can backfire on small datasets. CNN v4 isolated the architecture
          variable from the preprocessing variable. Without this systematic progression,
          there would be no principled basis for trusting CNN v1's result — it would just
          be a lucky guess rather than the conclusion of a rigorous comparison.
        </p>
      </Section>

      <Section title="Edge AI: True inference via WebAssembly">
        <p>
          A common constraint when deploying Machine Learning portfolios to free cloud hosting 
          is backend memory limits. Loading TensorFlow and a Keras model requires more RAM 
          than free tiers provide (typically 512MB), causing cloud servers to crash instantly.
        </p>
        <p>
          To solve this without sacrificing live inference, this application was architected using 
          <strong className="text-white">Edge AI</strong>. The Python CNN model was compiled into a highly compressed, 
          quantized 13MB ONNX graph format.
        </p>
        <p>
          When you click "Analyse This Star", your browser downloads this graph once and caches
          it locally. A WebAssembly engine (<code className="text-accent text-[11px] bg-accent/10 px-1 py-0.5 rounded-sm">onnxruntime-web</code>) executes the neural
          network natively on your device — no server round-trip, no latency, no cost.
        </p>
        <p>
          The star dataset — all 570 Kepler test stars with their pre-computed flux arrays —
          is stored as 570 individual static JSON files served by Vercel's global CDN. There
          is no Python server running anywhere in this deployment. Every element of the
          application, including the AI inference, runs entirely in your browser.
        </p>
      </Section>

      <Section title="Honest limitations">
        <p>
          The fundamental constraint of this project is data. Only 37 confirmed planet examples
          exist in the training set. SMOTE can balance the distribution mathematically, but it
          cannot generate the observational diversity of 37,000 real planet light curves.
          The model generalizes from very few real examples.
        </p>
        <p>
          For comparison, the Google AstroNet model achieves 95% recall on the same problem — but
          was trained on tens of thousands of labeled examples extracted from the full Kepler data
          pipeline, with domain-expert feature engineering applied. With equivalent data, the
          architecture used here would improve substantially. This project demonstrates that the
          methodology is sound and the approach is correct. The ceiling is the data, not the model.
        </p>
      </Section>
    </div>
  );
}
