'use client';
import React from 'react';
import { useCV } from '@/context/CVContext';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import AIEnhanceButton from '@/components/AIEnhanceButton';

type Education = {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export default function EducationStep() {
  const { educations, setEducations } = useCV();

  const handleAddEducation = () => {
    setEducations([...educations, { id: Date.now().toString(), institution: '', degree: '', startDate: '', endDate: '' }]);
  };

  const handleRemoveEducation = (id: string) => {
    if (educations.length > 1) {
      setEducations(educations.filter(edu => edu.id !== id));
    }
  };

  const handleChange = (id: string, field: keyof Education, value: string) => {
    setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-sans">Formación Académica</h2>
        <button 
          onClick={handleAddEducation}
          className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
        >
          + Añadir Estudios
        </button>
      </div>
      
      <div className="space-y-8">
        {educations.map((edu, index) => (
          <EducationForm 
            key={edu.id} 
            education={edu} 
            index={index}
            onChange={(field, value) => handleChange(edu.id, field, value)}
            onRemove={() => handleRemoveEducation(edu.id)}
            canRemove={educations.length > 1}
          />
        ))}
      </div>
    </div>
  );
}

function EducationForm({ 
  education, 
  index, 
  onChange, 
  onRemove, 
  canRemove 
}: { 
  education: Education, 
  index: number,
  onChange: (field: keyof Education, value: string) => void,
  onRemove: () => void,
  canRemove: boolean
}) {
  return (
    <div className="p-5 border border-gray-100 bg-slate-50 rounded-xl relative">
      {canRemove && (
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          title="Eliminar este estudio"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      )}
      
      <h3 className="font-medium text-gray-700 mb-4">Estudio {index + 1}</h3>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Institución Educativa</label>
          <div className="relative">
            <input 
              type="text" 
              value={education.institution}
              onChange={(e) => onChange('institution', e.target.value)}
              placeholder="Ej. Universidad de Chile o Liceo San José"
              className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <div className="absolute right-1.5 top-1.5">
              <AIEnhanceButton 
                compact 
                currentText={education.institution} 
                contextInfo="Corrige la ortografía y mejora el formato del nombre de esta institución educativa en Chile" 
                onEnhanced={(t) => onChange('institution', t)} 
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Título o Grado Obtenido</label>
          <div className="relative">
            <input 
              type="text" 
              value={education.degree}
              onChange={(e) => onChange('degree', e.target.value)}
              placeholder="Ej. Ingeniería Comercial, o Enseñanza Media Completa"
              className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <div className="absolute right-1.5 top-1.5">
              <AIEnhanceButton 
                compact 
                currentText={education.degree} 
                contextInfo="Corrige la ortografía y formaliza el nombre de este título o grado académico" 
                onEnhanced={(t) => onChange('degree', t)} 
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Inicio</label>
            <input 
              type="month" 
              value={education.startDate}
              onChange={(e) => onChange('startDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Término</label>
            <input 
              type="month" 
              value={education.endDate}
              onChange={(e) => onChange('endDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
