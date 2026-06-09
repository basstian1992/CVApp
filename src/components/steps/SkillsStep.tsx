'use client';
import React, { useState } from 'react';
import { useCV } from '@/context/CVContext';
import AIEnhanceButton from '@/components/AIEnhanceButton';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { enhanceTextWithAI } from '@/utils/aiHelper';

export default function SkillsStep() {
  const { skills, setSkills } = useCV();
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAdd = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleDictationEnd = async () => {
    if (currentSkill.trim()) {
      try {
        const enhancedText = await enhanceTextWithAI(currentSkill.trim(), "Mejora el nombre de esta habilidad laboral para que suene profesional y concisa (1 a 4 palabras máximo). Asegúrate de que la ortografía sea correcta y usa mayúsculas donde corresponda. Si el texto contiene meses o fechas habladas, escríbelas en formato adecuado con el mes en mayúscula (ej. '13 de Mayo de 1990').");
        if (enhancedText) {
          setCurrentSkill(enhancedText);
        }
      } catch (e) {
        console.error("AI Auto-enhance error", e);
      }
    }
  };

  const { isListening, isSupported, toggleListening } = useVoiceRecognition((transcript) => {
    setCurrentSkill((prev) => (prev + ' ' + transcript).trim());
  }, handleDictationEnd);

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 font-sans mb-2">Habilidades Destacadas</h2>
      <p className="text-sm text-gray-500 mb-6">Agrega las herramientas, programas o habilidades blandas que dominas (Ej: Excel avanzado, Trabajo en equipo, Inglés medio).</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
          <span>Nueva Habilidad</span>
          {isSupported && (
            <button 
              type="button"
              onClick={toggleListening}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${isListening ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'} transition-colors`}
            >
              {isListening ? (
                <><span className="w-2 h-2 rounded-full bg-red-600"></span> Escuchando...</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> Dictar</>
              )}
            </button>
          )}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej. Manejo de caja"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <div className="absolute right-2 top-2.5 flex items-center gap-1">
              <AIEnhanceButton 
                compact 
                currentText={currentSkill} 
                contextInfo="Mejora el nombre de esta habilidad laboral para que suene profesional y concisa (1 a 4 palabras máximo)" 
                onEnhanced={(t) => setCurrentSkill(t)} 
              />
            </div>
          </div>
          <button 
            onClick={handleAdd}
            disabled={!currentSkill.trim()}
            className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white px-5 rounded-xl font-medium transition-colors"
          >
            Añadir
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 border border-gray-100 rounded-xl">
        {skills.length === 0 && (
          <span className="text-gray-400 text-sm italic w-full text-center mt-6">No has agregado ninguna habilidad aún.</span>
        )}
        {skills.map((skill, index) => (
          <div key={index} className="bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm text-sm">
            <span>{skill}</span>
            <button 
              onClick={() => handleRemove(skill)}
              className="text-blue-300 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
