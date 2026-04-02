import React from 'react';

export default function ModelPerformance({ onNavigate }) {
  const matrix = [
    { label: 'True Negatives', value: 562, desc: 'Non-planet stars correctly identified', prominent: false, pos: 'tl' },
    { label: 'False Positives', value: 3,   desc: 'Non-planet stars flagged as planet', prominent: false, pos: 'tr' },
    { label: 'False Negatives', value: 3,   desc: 'Planet signatures below detection threshold', prominent: false, pos: 'bl' },
    { label: 'True Positives',  value: 2,   desc: 'Real planets found', prominent: true, pos: 'br' },
  ];

  const comparison = [
    { version: 'Random Forest',   data: 'Raw flux',             arch: '100 decision trees', result: '0 / 5 planets — Recall 0.00', selected: false },
    { version: 'CNN v1',          data: 'Raw flux',             arch: '2-layer CNN',        result: '2 / 5 planets — Recall 0.40 — 3 false positives', selected: true  },
    { version: 'CNN v2',          data: 'BLS phase folded',     arch: '3-layer CNN',        result: '1 / 5 planets — Recall 0.20', selected: false },
    { version: 'CNN v3',          data: 'Custom phase folded',  arch: '3-layer CNN',        result: '1 / 5 planets — Recall 0.20', selected: false },
    { version: 'CNN v4',          data: 'Custom phase folded',  arch: '2-layer CNN',        result: '2 / 5 planets — Recall 0.40 — 6 false positives', selected: false },
  ];

  return (
    <div className="max-w-4xl pb-20 pt-2">
      <h2 className="text-3xl font-bold mb-12 tracking-tight text-white">Model Performance</h2>

      {/* Top grid: matrix + metrics */}
      <div className="grid grid-cols-2 gap-16 mb-20">

        {/* Confusion Matrix */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">CNN v1 — Confusion Matrix</p>

          {/* Matrix with row labels on the left */}
          <div className="flex items-stretch gap-3">

            {/* Row axis labels */}
            <div className="flex flex-col justify-around text-[10px] text-gray-600 uppercase tracking-widest text-right leading-tight">
              <span>Actual:<br/>Non-Planet</span>
              <span>Actual:<br/>Planet</span>
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-2 gap-px bg-border border border-border">
              {matrix.map((cell) => (
                <div
                  key={cell.pos}
                  className={`p-8 ${cell.prominent ? 'bg-[#0F0F00]' : 'bg-dark'}`}
                >
                  <div className={`text-4xl font-bold mb-2 ${cell.prominent ? 'text-accent' : 'text-white'}`}>
                    {cell.value}
                  </div>
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${cell.prominent ? 'text-accent' : 'text-gray-400'}`}>
                    {cell.label}
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">{cell.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Column axis labels */}
          <div className="grid grid-cols-2 mt-2 text-center gap-px ml-14">
            <div className="text-[10px] text-gray-600 uppercase tracking-widest py-1">Predicted: Non-Planet</div>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest py-1">Predicted: Planet</div>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Key Metrics</p>

          <div className="space-y-6 mb-10">
            {[
              { name: 'Recall',    value: '0.40', note: 'Found 40% of all real planets' },
              { name: 'Precision', value: '0.40', note: 'When it said planet, it was right 40% of the time' },
              { name: 'F1 Score',  value: '0.40', note: 'Harmonic mean of Precision and Recall — balances both into a single score' },
            ].map(m => (
              <div key={m.name} className="border-b border-border pb-6">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-gray-400 text-sm">{m.name}</span>
                  <span className="text-white text-2xl font-bold font-mono">{m.value}</span>
                </div>
                {m.note && <p className="text-xs text-gray-600">{m.note}</p>}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            Accuracy is a misleading metric for this problem. A model that calls every single star
            a non-planet would achieve 99.3% accuracy — and find zero planets. Recall is what
            matters: out of all real planets, how many did we find?
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mb-14">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Model Comparison</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-6 text-gray-500 font-normal text-xs uppercase tracking-widest">Version</th>
              <th className="text-left py-3 pr-6 text-gray-500 font-normal text-xs uppercase tracking-widest">Data Used</th>
              <th className="text-left py-3 pr-6 text-gray-500 font-normal text-xs uppercase tracking-widest">Architecture</th>
              <th className="text-left py-3 text-gray-500 font-normal text-xs uppercase tracking-widest">Result</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map(row => (
              <tr
                key={row.version}
                className={`border-b border-border ${row.selected ? 'bg-[#0A0800]' : ''}`}
              >
                <td className="py-4 pr-6">
                  <span className={row.selected ? 'text-accent' : 'text-gray-300'}>{row.version}</span>
                  {row.selected && (
                    <span className="ml-3 text-[10px] text-gray-500 uppercase tracking-widest">In Use</span>
                  )}
                </td>
                <td className="py-4 pr-6 text-gray-500">{row.data}</td>
                <td className="py-4 pr-6 text-gray-500">{row.arch}</td>
                <td className={`py-4 ${row.selected ? 'text-white' : 'text-gray-500'}`}>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Why CNN v1? */}
      <div className="border-t border-border pt-10 max-w-2xl text-sm leading-relaxed">
        <h4 className="text-white font-semibold mb-3">Why was CNN v1 selected?</h4>
        <p className="text-gray-500">
          CNN v4 achieved the same recall (2 / 5 planets, Recall 0.40) as CNN v1 — but produced
          <strong className="text-gray-300"> 6 false positives</strong> compared to CNN v1's
          <strong className="text-gray-300"> 3</strong>. Identical planet detection at double the false alarm
          rate makes CNN v4 the inferior choice. CNN v1 delivers the best recall of all five models
          while maintaining the fewest false positives of any model that actually detected planets.
        </p>
        <button
          onClick={() => onNavigate('how', 'why-cnn-v1')}
          className="mt-4 text-accent uppercase tracking-widest text-[10px] border-b border-accent pb-0.5 hover:opacity-70 transition-opacity"
        >
          Read Technical Deep-Dive →
        </button>
      </div>
    </div>
  );
}
