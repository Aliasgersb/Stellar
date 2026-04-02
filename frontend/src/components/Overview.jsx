import React from 'react';

export default function Overview({ onNavigateToExplore }) {
  const stats = [
    { value: '5,087', label: 'Stars in training set — only 37 confirmed planet hosts (0.73%)' },
    { value: '570',   label: 'Stars in Kepler test dataset' },
    { value: '5',     label: 'NASA-confirmed planet hosts in test dataset' },
    { value: '2',     label: 'Planets successfully detected by the model' },
    { value: '0.40',  label: 'Recall achieved — versus 0.00 for a naive baseline' },
    { value: '4 CNNs + RF', label: 'Architectures trained and compared to find the best model' },
  ];

  return (
    <div className="max-w-3xl pt-2">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-10">
        NASA Kepler · Deep Learning · Exoplanet Detection
      </p>

      <h1 className="text-5xl font-bold tracking-tight text-white leading-tight mb-10">
        Finding Worlds<br />in Starlight
      </h1>

      <p className="text-gray-400 text-lg leading-[1.8] mb-16 max-w-2xl">
        This application uses the best-performing model selected from five trained architectures
        — including a Random Forest and four 1D Convolutional Neural Networks — all trained on
        real NASA Kepler Space Telescope data to detect exoplanets. The model analyzes light
        curves, brightness measurements of stars taken over time, and identifies the tiny periodic
        dips in brightness caused when a planet passes in front of its star.
      </p>

      <div className="grid grid-cols-2 gap-px border border-border bg-border mb-16">
        {stats.map((s, i) => (
          <div key={i} className="bg-dark p-8">
            <div className="text-4xl font-bold text-white mb-2 tracking-tight">{s.value}</div>
            <div className="text-sm text-gray-500 leading-relaxed">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-12 mb-12">
        <p className="text-gray-400 leading-relaxed mb-1">
          Use <span className="text-white">Explore Stars</span> to browse all 570 stars from the Kepler test dataset, view their light curves, and run the trained model in real time.
        </p>
        <p className="text-gray-400 leading-relaxed mb-1">
          Use <span className="text-white">Model Performance</span> to examine the confusion matrix, precision, recall, and how five different approaches compared.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Use <span className="text-white">How It Works</span> to understand the science, the methodology, and the honest limitations of this approach.
        </p>
      </div>

      <button
        onClick={onNavigateToExplore}
        className="text-white text-sm uppercase tracking-[0.2em] border-b border-accent text-accent pb-1 hover:opacity-70 transition-opacity"
      >
        Start Exploring
      </button>
    </div>
  );
}
