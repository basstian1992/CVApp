'use client';
import React, { useState } from 'react';
import { useCV } from '@/context/CVContext';
import { formatRut, validateRut } from '@/utils/rutValidation';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import AIEnhanceButton from '@/components/AIEnhanceButton';

type PersonalData = {
  fullName: string;
  rut: string;
  nationality: string;
  militarySituation: string;
  address: string;
};

export default function PersonalDataStep() {
  const { personalData: formData, setPersonalData: setFormData } = useCV();
  const [rutError, setRutError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'rut') {
      // Si contiene letras (distintas de K), asumimos que es pasaporte o ID extranjero
      if (/[a-jl-zA-JL-Z]/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
        setRutError('');
      } else {
        const formatted = formatRut(value);
        setFormData(prev => ({ ...prev, [name]: formatted }));
        if (formatted.length >= 8 && formatted.includes('-')) {
          setRutError(validateRut(formatted) ? '' : 'Aviso: El RUT parece inválido. (Ignorar si es otro documento)');
        } else {
          setRutError('');
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Setup Voice Recognition for the address field
  const handleAddressTranscript = (transcript: string) => {
    setFormData(prev => ({ ...prev, address: (prev.address + ' ' + transcript).trim() }));
  };

  const { isListening, isSupported, toggleListening } = useVoiceRecognition(handleAddressTranscript);

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">Datos Personales</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <div className="relative">
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez González"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <div className="absolute right-2 top-2">
              <AIEnhanceButton 
                compact 
                currentText={formData.fullName} 
                contextInfo="Corrige la ortografía y tildes de este nombre propio de persona" 
                onEnhanced={(t) => setFormData(p => ({...p, fullName: t}))} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT / Documento de Identidad</label>
            <input 
              type="text" 
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="Ej. 12.345.678-9 o Pasaporte"
              maxLength={20}
              className={`w-full px-4 py-3 rounded-xl border ${rutError ? 'border-orange-300 focus:ring-orange-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'} focus:ring-2 outline-none transition-all`}
            />
            {rutError && <p className="text-orange-500 text-xs mt-1">{rutError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
            <input 
              type="text" 
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Situación Militar</label>
          <select 
            name="militarySituation"
            value={formData.militarySituation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value="Al día">Al día</option>
            <option value="No realizada">No realizada</option>
            <option value="Exento">Exento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
            <span>Domicilio</span>
            {isSupported && (
              <button 
                type="button"
                onClick={toggleListening}
                className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full ${isListening ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'} transition-colors shadow-sm`}
              >
                {isListening ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-600"></span> Escuchando...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    Dictar por voz
                  </>
                )}
              </button>
            )}
          </label>
          <div className="relative">
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej. Av. Providencia 1234, Santiago"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <div className="absolute right-2 top-2">
              <AIEnhanceButton 
                compact 
                currentText={formData.address} 
                contextInfo="Corrige la ortografía y formato de esta dirección domiciliaria en Chile" 
                onEnhanced={(t) => setFormData(p => ({...p, address: t}))} 
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
