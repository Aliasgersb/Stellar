import React from 'react';

export default function About() {
  return (
    <div className="max-w-2xl pt-2 pb-20">
      <h2 className="text-3xl font-bold mb-12 tracking-tight text-white">About</h2>

      <p className="text-gray-400 leading-[1.9] text-[0.97rem] mb-8">
        This project was built by Aliasger Bhabhrawala, a second year student at BITS Pilani
        pursuing a dual degree in MSc Physics and BTech Manufacturing.
      </p>
      <p className="text-gray-400 leading-[1.9] text-[0.97rem] mb-8">
        The project represents an intersection of two genuine interests — understanding the universe
        and building things. The physics background provided the scientific context. The engineering
        background provided the tools. The result is a complete machine learning pipeline applied
        to one of the most compelling questions in science: are there other worlds out there?
      </p>
      <p className="text-gray-400 leading-[1.9] text-[0.97rem] mb-16">
        The answer, at least in the Kepler data, is yes. Two of them, confirmed.
      </p>

      <div className="border-t border-border pt-10 flex flex-col gap-12">

        {/* Profile */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Profile</p>
          <div className="space-y-4">
            {[
              {
                label: 'Contact',
                content: <a href="mailto:aliasgersb@gmail.com" className="text-gray-300 hover:text-accent transition-colors">aliasgersb@gmail.com</a>,
              },
              {
                label: 'Institution',
                content: <span className="text-gray-400">BITS Pilani</span>,
              },
              {
                label: 'LinkedIn',
                content: <a href="https://www.linkedin.com/in/aliasger-bhabhrawala" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">aliasger-bhabhrawala ↗</a>,
              },
              {
                label: 'GitHub',
                content: <a href="https://github.com/Aliasgersb/Stellar" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">Aliasgersb/Stellar ↗</a>,
              },
            ].map(({ label, content }) => (
              <div key={label} className="flex gap-8 text-sm">
                <span className="text-gray-600 w-28 shrink-0">{label}</span>
                {content}
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">Project Details</p>
          <div className="space-y-4">
            {[
              {
                label: 'Built with',
                content: <span className="text-gray-500">Python · TensorFlow/Keras · ONNX · React · Vite · Vercel</span>,
              },
              {
                label: 'Dataset',
                content: <a href="https://www.kaggle.com/datasets/keplersmachines/kepler-labelled-time-series-data" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">NASA Kepler Labeled Time Series (Kaggle) ↗</a>,
              },
              {
                label: 'Research Files',
                content: <a href="https://drive.google.com/drive/folders/1tGs-ZiNkPQQ-GACaFslbuIcJZjXpBZdl?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">Colab notebooks, models &amp; datasets (Google Drive) ↗</a>,
              },
            ].map(({ label, content }) => (
              <div key={label} className="flex gap-8 text-sm">
                <span className="text-gray-600 w-28 shrink-0">{label}</span>
                {content}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
