'use client';
import React from 'react';
import { useCV } from '@/context/CVContext';
import AIEnhanceButton from '@/components/AIEnhanceButton';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

export default function SummaryStep() {
  const { summary, setSummary } = useCV();

  const { isListening, isSupported, toggleListening } = useVoiceRecognition((transcript) => {
    setSummary((prev) => (prev + ' ' + transcript).trim());
  });

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 font-sans mb-2">Perfil y Resumen</h2>
      <p className="text-sm text-gray-500 mb-6">Un buen resumen (3 o 4 líneas) al inicio del CV aumenta enormemente tus posibilidades. Escribe o dicta brevemente quién eres y qué buscas.</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between items-center">
          <span>Descripción de tu perfil</span>
          {isSupported && (
            <button 
              type="button"
              onClick={toggleListening}
              className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full ${isListening ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'} transition-colors shadow-sm`}
            >
              {isListening ? (
                <><span className="w-2 h-2 rounded-full bg-red-600"></span> Escuchando...</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> Dictar tu resumen</>
              )}
            </button>
          )}
        </label>
        
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4 text-sm text-blue-800">
          <strong>Ejemplo para dictar:</strong> "Soy responsable, aprendo rápido y tengo ganas de trabajar. Tengo experiencia atendiendo gente."
        </div>

        <textarea 
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Habla o escribe aquí tu presentación..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[150px] resize-y"
        />
        
        <div className="mt-3">
          <AIEnhanceButton 
            currentText={summary}
            contextInfo="Este es el resumen o perfil profesional al inicio de un Curriculum Vitae. Mejora la redacción para que suene proactivo, profesional, formal y persuasivo. Limítalo a un máximo de 50 palabras."
            onEnhanced={(t) => setSummary(t)} 
          />
        </div>
      </div>
    </div>
  );
}
