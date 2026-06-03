'use client';
import React from 'react';
import { useCV } from '@/context/CVContext';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import AIEnhanceButton from '@/components/AIEnhanceButton';

type WorkExperience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

export default function ExperienceStep() {
  const { experiences, setExperiences } = useCV();

  const handleAddExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' }]);
  };

  const handleRemoveExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const handleChange = (id: string, field: keyof WorkExperience, value: string) => {
    setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-sans">Historial Laboral</h2>
        <button 
          onClick={handleAddExperience}
          className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          + Añadir Experiencia
        </button>
      </div>
      
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <ExperienceForm 
            key={exp.id} 
            experience={exp} 
            index={index}
            onChange={(field, value) => handleChange(exp.id, field, value)}
            onRemove={() => handleRemoveExperience(exp.id)}
            canRemove={experiences.length > 1}
          />
        ))}
      </div>

    </div>
  );
}

// Subcomponent for each experience item
function ExperienceForm({ 
  experience, 
  index, 
  onChange, 
  onRemove, 
  canRemove 
}: { 
  experience: WorkExperience, 
  index: number,
  onChange: (field: keyof WorkExperience, value: string) => void,
  onRemove: () => void,
  canRemove: boolean
}) {
  
  // Voice integration for description
  const handleTranscript = (transcript: string) => {
    onChange('description', (experience.description + ' ' + transcript).trim());
  };
  const { isListening, isSupported, toggleListening } = useVoiceRecognition(handleTranscript);

  return (
    <div className="p-5 border border-gray-100 bg-slate-50 rounded-xl relative">
      {canRemove && (
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          title="Eliminar esta experiencia"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      )}
      
      <h3 className="font-medium text-gray-700 mb-4">Experiencia {index + 1}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Empresa</label>
          <input 
            type="text" 
            value={experience.company}
            onChange={(e) => onChange('company', e.target.value)}
            placeholder="Ej. Comercializadora Sur"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Cargo / Puesto</label>
          <input 
            type="text" 
            value={experience.position}
            onChange={(e) => onChange('position', e.target.value)}
            placeholder="Ej. Vendedor de Tienda"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Inicio</label>
          <input 
            type="month" 
            value={experience.startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Término</label>
          <input 
            type="month" 
            value={experience.endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-gray-600">Descripción de tareas (¿Qué hacías?)</label>
          {isSupported && (
            <button 
              type="button"
              onClick={toggleListening}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${isListening ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'} transition-colors shadow-sm`}
            >
              {isListening ? (
                <><span className="w-2 h-2 rounded-full bg-red-600"></span> Escuchando...</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> Dictar</>
              )}
            </button>
          )}
        </div>
        <textarea 
          value={experience.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Habla o escribe aquí lo que hacías en tu trabajo. Luego usa la IA para mejorarlo."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[100px] resize-y"
        />
        
        {/* IA Button integration */}
        <AIEnhanceButton 
          currentText={experience.description}
          contextInfo={`Descripción de tareas para el cargo de ${experience.position || 'empleado'} en la empresa ${experience.company || 'una empresa'}.`}
          onEnhanced={(newText) => onChange('description', newText)}
        />
      </div>
    </div>
  );
}
