'use client';
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCV } from '@/context/CVContext';

export default function CVPreview() {
  const { personalData, experiences, educations, skills, summary, theme } = useCV();
  const cvRef = useRef<HTMLDivElement>(null);
  
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const generatePDFBlob = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = cvRef.current as HTMLElement;
    if (!element) return new Blob();
    
    const opt = {
      margin:       10,
      filename:     `CV_${personalData.fullName.replace(/\\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    return await html2pdf().from(element).set(opt).output('blob');
  };

  // Removido el auto-descarga

  const handleDownload = async () => {
    setMessage('');
    const html2pdf = (await import('html2pdf.js')).default;
    const element = cvRef.current as HTMLElement;
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     `CV_${personalData.fullName.replace(/\\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };
    await html2pdf().from(element).set(opt).save();
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    setMessage('Generando PDF...');
    
    try {
      await handleDownload();

      if (email.trim()) {
        setMessage('Enviando copia a tu correo...');
        const pdfBlob = await generatePDFBlob();
        const file = new File([pdfBlob], 'Curriculum_Vitae.pdf', { type: 'application/pdf' });

        const formData = new FormData();
        formData.append('email', email.trim());
        formData.append('file', file);

        const res = await fetch('/api/send-cv', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        
        if (res.ok) {
          setMessage('¡CV descargado y enviado con éxito!');
        } else {
          setMessage(`CV descargado, pero hubo un error al enviar correo: ${data.error}`);
        }
      } else {
        setMessage('¡CV descargado con éxito!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Ocurrió un error al procesar el CV.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
      <div className="w-full bg-gradient-to-r from-blue-50 to-white p-6 sm:p-8 rounded-2xl shadow-sm border border-blue-100 mb-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full shadow-lg bg-white flex-shrink-0 overflow-hidden border-4 border-white flex items-center justify-center">
          <img src="/logo.png" alt="CVApp Logo" className="w-full h-full object-cover scale-[1.08]" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-2 tracking-tight">¡Tu Currículum está listo!</h3>
          <p className="text-blue-700 font-medium text-lg">éxito en tu próxima búsqueda de empleo</p>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enviarme una copia por correo (Opcional)</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="tu@correo.com" 
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all" 
          />
        </div>
        <button 
          onClick={handleFinalize} 
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 sm:py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto sm:mt-6"
        >
          {isProcessing ? (
            <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Procesando...</>
          ) : (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> {email.trim() ? 'Descargar y Enviar CV' : 'Descargar PDF'}</>
          )}
        </button>
      </div>
      {message && <div className={`w-full text-sm mb-6 p-4 rounded-xl text-center font-medium shadow-sm border ${message.includes('Error') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>{message}</div>}

      <div className="w-full overflow-x-auto pb-6 rounded-lg">
        <div className="bg-white shadow-lg border border-gray-200 mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
          <div ref={cvRef} className="cv-content font-sans" style={{ fontSize: '14px', lineHeight: '1.6', color: theme.textDark, backgroundColor: '#ffffff' }}>
          
          {/* Header */}
          <div className="pb-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-8" style={{ borderBottom: `2px solid ${theme.primary}` }}>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-4" style={{ color: theme.primary }}>{personalData.fullName || 'Tu Nombre'}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-base font-medium" style={{ color: theme.textLight }}>
                {personalData.rut && <span><strong>RUT/ID:</strong> {personalData.rut}</span>}
                {personalData.nationality && <span><strong>Nacionalidad:</strong> {personalData.nationality}</span>}
                {personalData.address && <span><strong>Domicilio:</strong> {personalData.address}</span>}
                {personalData.phone && <span><strong>Teléfono:</strong> {personalData.phone}</span>}
                {personalData.email && <span><strong>Correo:</strong> {personalData.email}</span>}
                {personalData.showBirthDate && personalData.birthDate && <span><strong>Fecha de Nacimiento:</strong> {personalData.birthDate}</span>}
                {personalData.driverLicense && <span><strong>Licencia de Conducir:</strong> {personalData.driverLicense}</span>}
                {personalData.hasDisability && <span><strong>Discapacidad:</strong> Sí {personalData.disabilityType ? `(${personalData.disabilityType} ${personalData.disabilityPercentage ? '- ' + personalData.disabilityPercentage : ''})` : ''}</span>}
                {personalData.immediateAvailability && <span><strong>Disponibilidad:</strong> Inmediata</span>}
              </div>
            </div>
            {personalData.photo && (
              <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-full overflow-hidden border-[4px] shadow-sm" style={{ borderColor: theme.primary }}>
                <img src={personalData.photo} alt="Fotografía" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-4 pb-2" style={{ color: theme.primary, borderBottom: `1px solid ${theme.bgLight}` }}>Perfil Profesional</h2>
              <p className="text-justify leading-relaxed text-base" style={{ color: theme.textDark }}>{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experiences.some(e => e.company || e.position) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-5 pb-2" style={{ color: theme.primary, borderBottom: `1px solid ${theme.bgLight}` }}>Experiencia Laboral</h2>
              <div className="space-y-6">
                {experiences.map(exp => {
                  if (!exp.company && !exp.position) return null;
                  return (
                    <div key={exp.id} className="relative pl-5 border-l-2" style={{ borderColor: theme.bgLight }}>
                      <div className="absolute w-3 h-3 rounded-full -left-[7px] top-2" style={{ backgroundColor: theme.primary }}></div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold" style={{ color: theme.textDark }}>{exp.position}</h3>
                        <span className="text-sm font-semibold px-3 py-1 rounded-md" style={{ backgroundColor: theme.bgLight, color: theme.primary }}>
                          {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Presente'}
                        </span>
                      </div>
                      <div className="text-base font-semibold mb-2 uppercase tracking-wide" style={{ color: theme.secondary }}>{exp.company}</div>
                      <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: theme.textDark }}>{exp.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.some(e => e.institution || e.degree) && (
            <div className="mb-8">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-5 pb-2" style={{ color: theme.primary, borderBottom: `1px solid ${theme.bgLight}` }}>Formación Académica</h2>
              <div className="space-y-6">
                {educations.map(edu => {
                  if (!edu.institution && !edu.degree) return null;
                  return (
                    <div key={edu.id} className="relative pl-5 border-l-2" style={{ borderColor: theme.bgLight }}>
                      <div className="absolute w-3 h-3 rounded-full -left-[7px] top-2" style={{ backgroundColor: theme.secondary }}></div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold" style={{ color: theme.textDark }}>{edu.degree}</h3>
                        <span className="text-sm font-semibold px-3 py-1 rounded-md" style={{ backgroundColor: theme.bgLight, color: theme.primary }}>
                          {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                        </span>
                      </div>
                      <div className="text-base font-medium" style={{ color: theme.textLight }}>{edu.institution}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wider mb-5 pb-2" style={{ color: theme.primary, borderBottom: `1px solid ${theme.bgLight}` }}>Habilidades Destacadas</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 rounded-lg text-sm font-bold tracking-wide shadow-sm" style={{ backgroundColor: theme.bgLight, color: theme.primary, border: `1px solid ${theme.primary}30` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      </div>

    </div>
  );
}
