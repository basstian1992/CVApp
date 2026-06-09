'use client';
import React, { useState } from 'react';
import { useCV } from '@/context/CVContext';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import AIEnhanceButton from '@/components/AIEnhanceButton';
import { enhanceTextWithAI } from '@/utils/aiHelper';

type Education = { id: string; institution: string; degree: string; startDate: string; endDate: string; };

export default function EducationStep() {
  const { educations, setEducations } = useCV();

  const handleAddEducation = () => setEducations([...educations, { id: Date.now().toString(), institution: '', degree: '', startDate: '', endDate: '' }]);
  const handleRemoveEducation = (id: string) => { if (educations.length > 1) setEducations(educations.filter(edu => edu.id !== id)); };
  const handleChange = (id: string, field: keyof Education, value: string) => setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-sans">Formación Académica</h2>
        <button onClick={handleAddEducation} className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors">+ Añadir Estudios</button>
      </div>
      <div className="space-y-8">
        {educations.map((edu, index) => (
          <EducationForm key={edu.id} education={edu} index={index} onChange={(field, value) => handleChange(edu.id, field, value)} onRemove={() => handleRemoveEducation(edu.id)} canRemove={educations.length > 1} />
        ))}
      </div>
    </div>
  );
}

function EducationForm({ education, index, onChange, onRemove, canRemove }: { education: Education, index: number, onChange: (field: keyof Education, value: string) => void, onRemove: () => void, canRemove: boolean }) {
  const [activeVoiceField, setActiveVoiceField] = useState<keyof Education | null>(null);

  const handleTranscript = (transcript: string) => {
    if (activeVoiceField) {
      onChange(activeVoiceField, (education[activeVoiceField] + ' ' + transcript).trim());
    }
  };

  const handleDictationEnd = async () => {
    if (activeVoiceField && typeof education[activeVoiceField] === 'string') {
      try {
        const enhancedText = await enhanceTextWithAI(education[activeVoiceField] as string, `Corrige y mejora el texto para el campo de CV de educación: ${activeVoiceField}. Asegúrate de que la ortografía sea correcta y usa mayúsculas donde corresponda. Si el texto contiene meses o fechas habladas (ej. 'trece de mayo del noventa'), escríbelas en formato adecuado con el mes en mayúscula (ej. '13 de Mayo de 1990').`);
        if (enhancedText) {
          onChange(activeVoiceField, enhancedText);
        }
      } catch (e) {
        console.error("AI Auto-enhance error", e);
      }
    }
  };

  const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition(handleTranscript, handleDictationEnd);

  const toggleVoice = (field: keyof Education) => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      if (isListening) stopListening();
      setActiveVoiceField(field);
      setTimeout(() => startListening(), 100);
    }
  };

  const renderVoiceButton = (field: keyof Education) => {
    if (!isSupported) return null;
    const isActive = isListening && activeVoiceField === field;
    return (
      <button type="button" onClick={() => toggleVoice(field)} title="Dictar por voz" className={`p-1.5 rounded-full transition-colors shadow-sm ${isActive ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-blue-50 text-blue-600 border border-transparent hover:bg-blue-100 hover:border-blue-200'}`}>
        {isActive ? <div className="w-3.5 h-3.5 rounded-full bg-red-600"></div> : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
      </button>
    );
  };

  return (
    <div className="p-5 border border-gray-100 bg-slate-50 rounded-xl relative">
      {canRemove && <button onClick={onRemove} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar este estudio"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>}
      <h3 className="font-medium text-gray-700 mb-4">Estudio {index + 1}</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Institución Educativa</label>
          <div className="relative">
            <input type="text" value={education.institution} onChange={(e) => onChange('institution', e.target.value)} placeholder="Ej. Universidad de Chile o Liceo San José" className="w-full pl-3 pr-24 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
              {renderVoiceButton('institution')}
              <AIEnhanceButton compact currentText={education.institution} contextInfo="Corrige la ortografía y mejora el formato del nombre de esta institución educativa en Chile" onEnhanced={(t) => onChange('institution', t)} />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Título o Grado Obtenido</label>
          <div className="relative">
            <input type="text" value={education.degree} onChange={(e) => onChange('degree', e.target.value)} placeholder="Ej. Ingeniería Comercial, o Enseñanza Media Completa" className="w-full pl-3 pr-24 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
              {renderVoiceButton('degree')}
              <AIEnhanceButton compact currentText={education.degree} contextInfo="Corrige la ortografía y formaliza el nombre de este título o grado académico" onEnhanced={(t) => onChange('degree', t)} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Inicio</label>
            <div className="relative">
              <input type="text" value={education.startDate} onChange={(e) => onChange('startDate', e.target.value)} placeholder="Ej. Marzo 2018" className="w-full pl-3 pr-24 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                {renderVoiceButton('startDate')}
                <AIEnhanceButton compact currentText={education.startDate} contextInfo="Mejora el formato de esta fecha de inicio de estudios" onEnhanced={(t) => onChange('startDate', t)} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de Término</label>
            <div className="relative">
              <input type="text" value={education.endDate} onChange={(e) => onChange('endDate', e.target.value)} placeholder="Ej. Diciembre 2022 o Actualidad" className="w-full pl-3 pr-24 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
              <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                {renderVoiceButton('endDate')}
                <AIEnhanceButton compact currentText={education.endDate} contextInfo="Mejora el formato de esta fecha de término de estudios" onEnhanced={(t) => onChange('endDate', t)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
