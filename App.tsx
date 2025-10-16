
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AudioPlayer } from './components/AudioPlayer';
import { Loader } from './components/Loader';
import { transcribeAudio, synthesizeSpeech } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AudioData } from './types';

const App: React.FC = () => {
  const [originalAudio, setOriginalAudio] = useState<AudioData | null>(null);
  const [processedAudio, setProcessedAudio] = useState<{ url: string; fileName: string } | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setOriginalAudio({
      file,
      url: URL.createObjectURL(file),
    });
    setProcessedAudio(null);
    setTranscription('');
    setError(null);
  };

  const handleProcessAudio = useCallback(async () => {
    if (!originalAudio) return;

    setIsLoading(true);
    setError(null);
    setProcessedAudio(null);
    setTranscription('');

    try {
      const { data: base64Data, mimeType } = await fileToBase64(originalAudio.file);

      // Step 1: Transcribe audio to text
      const transcript = await transcribeAudio(base64Data, mimeType);
      setTranscription(transcript);

      // Step 2: Synthesize speech from the transcript
      const synthesizedAudioBase64 = await synthesizeSpeech(transcript);

      // Step 3: Create a playable URL for the synthesized audio
      const audioBlob = new Blob(
        [Uint8Array.from(atob(synthesizedAudioBase64), c => c.charCodeAt(0))],
        { type: 'audio/wav' }
      );
      const processedAudioUrl = URL.createObjectURL(audioBlob);
      
      const originalFileName = originalAudio.file.name.split('.').slice(0, -1).join('.');
      setProcessedAudio({
        url: processedAudioUrl,
        fileName: `${originalFileName}_clean.wav`
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
    } finally {
      setIsLoading(false);
    }
  }, [originalAudio]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <Header />

        <main className="mt-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 sm:p-8 ring-1 ring-slate-700">
          <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {originalAudio && (
            <div className="mt-6 text-center">
              <button
                onClick={handleProcessAudio}
                disabled={isLoading}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
              >
                {isLoading ? 'Processing...' : '✨ Clean Audio'}
              </button>
            </div>
          )}
          
          {isLoading && <Loader />}

          {processedAudio && (
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Transcription:</h3>
                <p className="p-4 bg-slate-900/70 rounded-lg border border-slate-700 text-slate-300 italic">
                  "{transcription}"
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {originalAudio && (
                  <AudioPlayer 
                    src={originalAudio.url}
                    title="Original Audio" 
                    fileName={originalAudio.file.name}
                  />
                )}
                <AudioPlayer 
                  src={processedAudio.url} 
                  title="Cleaned Audio" 
                  fileName={processedAudio.fileName}
                />
              </div>
            </div>
          )}
        </main>
      </div>
       <footer className="w-full max-w-4xl mx-auto text-center mt-8 py-4 text-slate-500 text-sm">
          <p>Powered by Google Gemini API</p>
        </footer>
    </div>
  );
};

export default App;
