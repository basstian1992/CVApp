'use client';
import React, { useState } from 'react';

interface AIEnhanceButtonProps {
  currentText: string;
  contextInfo: string;
  onEnhanced: (newText: string) => void;
  compact?: boolean;
}

export default function AIEnhanceButton({ currentText, contextInfo, onEnhanced, compact = false }: AIEnhanceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnhance = async () => {
    if (!currentText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentText,
          context: contextInfo
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con la IA');
      }

      const data = await response.json();
      if (data.enhancedText) {
        onEnhanced(data.enhancedText);
      }
    } catch (err) {
      console.error(err);
      setError('Error al mejorar el texto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentText.trim()) return null;

  return (
    <div className={`flex flex-col items-start ${compact ? 'mt-0' : 'mt-2'}`}>
      <button
        type="button"
        onClick={handleEnhance}
        disabled={isLoading || !currentText.trim()}
        title="Corregir y mejorar con IA"
        className={`flex items-center justify-center transition-all ${
          compact 
            ? `w-8 h-8 rounded-full ${isLoading ? 'bg-purple-100 text-purple-400' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`
            : `gap-2 px-4 py-2 rounded-lg text-sm font-medium ${isLoading ? 'bg-purple-100 text-purple-400 cursor-not-allowed' : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 shadow-sm'}`
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : (
          compact ? <span>✨</span> : <><span>✨</span> Enriquecer con IA</>
        )}
      </button>
      {error && !compact && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
