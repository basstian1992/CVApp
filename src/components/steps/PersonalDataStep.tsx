'use client';
import React, { useState } from 'react';
import { useCV } from '@/context/CVContext';
import { formatRut, validateRut } from '@/utils/rutValidation';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import AIEnhanceButton from '@/components/AIEnhanceButton';
import { enhanceTextWithAI } from '@/utils/aiHelper';

type PersonalData = {
  fullName: string;
  rut: string;
  nationality: string;
  militarySituation: string;
  address: string;
  phone: string;
  email: string;
  birthDate: string;
  showBirthDate: boolean;
  driverLicense: string;
  hasDisability: boolean;
  disabilityType: string;
  disabilityPercentage: string;
  photo: string | null;
};

export default function PersonalDataStep() {
  const { personalData: formData, setPersonalData: setFormData } = useCV();
  const [rutError, setRutError] = useState('');
  const [activeVoiceField, setActiveVoiceField] = useState<keyof PersonalData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'rut') {
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

  const handleTranscript = (transcript: string) => {
    if (activeVoiceField && typeof formData[activeVoiceField] === 'string') {
      setFormData(prev => ({ 
        ...prev, 
        [activeVoiceField]: ((prev[activeVoiceField] as string) + ' ' + transcript).trim() 
      }));
    }
  };

  const handleDictationEnd = async () => {
    if (activeVoiceField && typeof formData[activeVoiceField] === 'string') {
      try {
        const enhancedText = await enhanceTextWithAI(formData[activeVoiceField] as string, `Corrige y mejora el texto para el campo de CV: ${activeVoiceField}`);
        if (enhancedText) {
          setFormData(prev => ({ ...prev, [activeVoiceField]: enhancedText }));
        }
      } catch (e) {
        console.error("AI Auto-enhance error", e);
      }
    }
  };

  const { isListening, isSupported, startListening, stopListening } = useVoiceRecognition(handleTranscript, handleDictationEnd);

  const toggleVoice = (field: keyof PersonalData) => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
    } else {
      if (isListening) stopListening();
      setActiveVoiceField(field);
      setTimeout(() => startListening(), 100);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => setFormData(prev => ({ ...prev, photo: null }));

  const renderVoiceButton = (field: keyof PersonalData) => {
    if (!isSupported) return null;
    const isActive = isListening && activeVoiceField === field;
    return (
      <button 
        type="button"
        onClick={() => toggleVoice(field)}
        title="Dictar por voz"
        className={`p-1.5 rounded-full transition-colors shadow-sm ${isActive ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-blue-50 text-blue-600 border border-transparent hover:bg-blue-100 hover:border-blue-200'}`}
      >
        {isActive ? <div className="w-4 h-4 rounded-full bg-red-600"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
      </button>
    );
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">Datos Personales</h2>
      
      <div className="space-y-5">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-white flex items-center justify-center">
              {formData.photo ? <img src={formData.photo} alt="Foto" className="w-full h-full object-cover" /> : <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>}
            </div>
            {formData.photo && <button onClick={removePhoto} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotografía (Opcional)</label>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              {formData.photo ? 'Cambiar Foto' : 'Subir Foto'}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <div className="relative">
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ej. Juan Pérez González" className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="absolute right-2 top-2 flex items-center gap-1.5">
              {renderVoiceButton('fullName')}
              <AIEnhanceButton compact currentText={formData.fullName} contextInfo="Corrige la ortografía y tildes de este nombre propio de persona" onEnhanced={(t) => setFormData(p => ({...p, fullName: t}))} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT / Documento de Identidad</label>
            <div className="relative">
              <input type="text" name="rut" value={formData.rut} onChange={handleChange} placeholder="Ej. 12.345.678-9" maxLength={20} className={`w-full pl-4 pr-12 py-3 rounded-xl border ${rutError ? 'border-orange-300 focus:ring-orange-500' : 'border-gray-200 focus:ring-blue-500'} focus:ring-2 outline-none`} />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                {renderVoiceButton('rut')}
              </div>
            </div>
            {rutError && <p className="text-orange-500 text-xs mt-1">{rutError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
            <div className="relative">
              <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                {renderVoiceButton('nationality')}
                <AIEnhanceButton compact currentText={formData.nationality} contextInfo="Corrige ortografía de nacionalidad" onEnhanced={(t) => setFormData(p => ({...p, nationality: t}))} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="relative">
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Ej. +569 1234 5678" className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                {renderVoiceButton('phone')}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ej. juan@correo.com" className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                {renderVoiceButton('email')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <div className="relative mb-2">
              <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Ej. 15 de Marzo 1990" className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                {renderVoiceButton('birthDate')}
                <AIEnhanceButton compact currentText={formData.birthDate} contextInfo="Mejora el formato de esta fecha de nacimiento" onEnhanced={(t) => setFormData(p => ({...p, birthDate: t}))} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" name="showBirthDate" checked={formData.showBirthDate} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              Mostrar en el CV
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Situación Militar</label>
            <select name="militarySituation" value={formData.militarySituation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="Al día">Al día</option>
              <option value="No realizada">No realizada</option>
              <option value="Exento">Exento</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Domicilio</label>
          <div className="relative">
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Ej. Av. Providencia 1234, Santiago" className="w-full pl-4 pr-24 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="absolute right-2 top-2 flex items-center gap-1.5">
              {renderVoiceButton('address')}
              <AIEnhanceButton compact currentText={formData.address} contextInfo="Corrige la ortografía y formato de esta dirección domiciliaria en Chile" onEnhanced={(t) => setFormData(p => ({...p, address: t}))} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Licencia de Conducir</label>
            <div className="relative">
              <input type="text" name="driverLicense" value={formData.driverLicense} onChange={handleChange} placeholder="Ej. Clase B o No tiene" className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                {renderVoiceButton('driverLicense')}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input type="checkbox" name="hasDisability" checked={formData.hasDisability} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
              ¿Tienes alguna discapacidad?
            </label>
            
            {formData.hasDisability && (
              <div className="grid grid-cols-2 gap-3 mt-2 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Tipo de discapacidad</label>
                  <div className="relative">
                    <input type="text" name="disabilityType" value={formData.disabilityType} onChange={handleChange} placeholder="Ej. Física, Visual" className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    <div className="absolute right-1 top-1.5 flex items-center gap-1.5">
                      {renderVoiceButton('disabilityType')}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Porcentaje (%)</label>
                  <div className="relative">
                    <input type="text" name="disabilityPercentage" value={formData.disabilityPercentage} onChange={handleChange} placeholder="Ej. 30%" className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    <div className="absolute right-1 top-1.5 flex items-center gap-1.5">
                      {renderVoiceButton('disabilityPercentage')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
