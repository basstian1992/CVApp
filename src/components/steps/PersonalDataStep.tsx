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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 dark:bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 dark:border-slate-700 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-200 dark:text-slate-200 mb-6 font-sans">Datos Personales</h2>
      
      <div className="space-y-5">
        
        {/* Photo Upload */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-4 border border-gray-100 dark:border-slate-700 dark:border-slate-700 rounded-xl bg-gray-50/50">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-800 dark:bg-slate-800 flex items-center justify-center">
              {formData.photo ? (
                <img src={formData.photo} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
              )}
            </div>
            {formData.photo && (
              <button onClick={removePhoto} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Fotografía (Opcional)</label>
            <p className="text-xs text-gray-500 dark:text-slate-400 dark:text-slate-400 mb-3">Sube una foto formal para tu currículum. Formatos recomendados: JPG o PNG.</p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              {formData.photo ? 'Cambiar Foto' : 'Subir Foto'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Nombre Completo</label>
          <div className="relative">
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez González"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">RUT / Documento de Identidad</label>
            <input 
              type="text" 
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="Ej. 12.345.678-9 o Pasaporte"
              maxLength={20}
              className={`w-full px-4 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 py-3 rounded-xl border ${rutError ? 'border-orange-300 focus:ring-orange-500' : 'border-gray-200 dark:border-slate-700 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500'} focus:ring-2 outline-none transition-all`}
            />
            {rutError && <p className="text-orange-500 text-xs mt-1">{rutError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Nacionalidad</label>
            <input 
              type="text" 
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-4 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Situación Militar</label>
          <select 
            name="militarySituation"
            value={formData.militarySituation}
            onChange={handleChange}
            className="w-full px-4 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-slate-800 dark:bg-slate-800"
          >
            <option value="Al día">Al día</option>
            <option value="No realizada">No realizada</option>
            <option value="Exento">Exento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1 flex items-center justify-between">
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
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-slate-700 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
