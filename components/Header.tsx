
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        Audio Noise Cleaner AI
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
        Upload your audio file. We'll transcribe the speech and then re-synthesize it with a crystal-clear AI voice, effectively removing all background noise.
      </p>
    </header>
  );
};
