
import React from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
  fileName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, fileName }) => {
  return (
    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
      <h4 className="font-semibold text-indigo-400 mb-3">{title}</h4>
      <audio controls src={src} className="w-full"></audio>
      <a
        href={src}
        download={fileName}
        className="mt-3 inline-block w-full text-center px-4 py-2 bg-slate-700 text-slate-300 font-medium text-sm rounded-md hover:bg-slate-600 transition-colors"
      >
        Download "{fileName}"
      </a>
    </div>
  );
};
