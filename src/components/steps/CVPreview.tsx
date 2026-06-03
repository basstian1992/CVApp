'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useCV } from '@/context/CVContext';

export default function CVPreview() {
  const { personalData, experiences, educations, skills, summary } = useCV();
  const cvRef = useRef<HTMLDivElement>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const generatePDFBlob = async () => {
    // Dynamic import for client side only
    const html2pdf = (await import('html2pdf.js')).default;
    const element = cvRef.current as HTMLElement;
    if (!element) return new Blob();
    
    const opt = {
      margin:       10,
      filename:     `CV_${personalData.fullName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const pdfBlob = await html2pdf().from(element).set(opt).output('blob');
    return pdfBlob;
  };

  useEffect(() => {
    // Auto-descargar al montar el componente (pequeño retraso para que renderice bien)
    const timer = setTimeout(() => {
      handleDownload();
      setShowModal(true); // Abrir modal automáticamente después de descargar
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    setMessage('');
    const html2pdf = (await import('html2pdf.js')).default;
    const element = cvRef.current as HTMLElement;
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     `CV_${personalData.fullName.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const handleSendEmail = async () => {
    if (!email) {
      setMessage('Por favor, ingresa tu correo.');
      return;
    }
    
    setIsSending(true);
    setMessage('Generando PDF...');
    
    try {
      const pdfBlob = await generatePDFBlob();
      const file = new File([pdfBlob], 'Curriculum_Vitae.pdf', { type: 'application/pdf' });

      setMessage('Enviando correo...');
      
      const formData = new FormData();
      formData.append('email', email);
      formData.append('file', file);

      const res = await fetch('/api/send-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage('¡Enviado con éxito! Revisa tu bandeja de entrada o spam.');
        setTimeout(() => setShowModal(false), 3000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Ocurrió un error al enviar.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-end gap-4 mb-6">
        <button 
          onClick={handleDownload}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Descargar PDF
        </button>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Enviar a mi Correo
        </button>
      </div>

      {/* CV Document Container */}
      <div className="bg-white shadow-lg border border-gray-200 w-full overflow-hidden" style={{ minHeight: '297mm', padding: '20mm' }}>
        <div ref={cvRef} className="cv-content text-slate-800 font-sans" style={{ fontSize: '14px', lineHeight: '1.6' }}>
          
          {/* Header */}
          <div className="border-b-2 border-blue-600 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2">{personalData.fullName || 'Tu Nombre'}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              {personalData.rut && <span><strong>RUT/ID:</strong> {personalData.rut}</span>}
              {personalData.nationality && <span><strong>Nacionalidad:</strong> {personalData.nationality}</span>}
              {personalData.address && <span><strong>Domicilio:</strong> {personalData.address}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-blue-600 uppercase mb-2">Perfil Profesional</h2>
              <p className="text-gray-700 text-justify">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experiences.some(e => e.company || e.position) && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-blue-600 uppercase mb-3">Experiencia Laboral</h2>
              <div className="space-y-4">
                {experiences.map(exp => {
                  if (!exp.company && !exp.position) return null;
                  return (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-800">{exp.position}</h3>
                        <span className="text-sm text-gray-500 font-medium">
                          {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : '- Presente'}
                        </span>
                      </div>
                      <div className="text-blue-700 font-medium mb-1">{exp.company}</div>
                      <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.some(e => e.institution || e.degree) && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-blue-600 uppercase mb-3">Formación Académica</h2>
              <div className="space-y-3">
                {educations.map(edu => {
                  if (!edu.institution && !edu.degree) return null;
                  return (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                        <span className="text-sm text-gray-500 font-medium">
                          {edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}
                        </span>
                      </div>
                      <div className="text-gray-600">{edu.institution}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-blue-600 uppercase mb-3">Habilidades Destacadas</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modal Envío por Correo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Recibe tu CV</h3>
            <p className="text-gray-500 mb-6 text-sm">Ingresa tu correo electrónico para enviarte el PDF terminado.</p>
            
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            />
            
            {message && (
              <div className={`text-sm mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
                {message}
              </div>
            )}

            <button 
              onClick={handleSendEmail}
              disabled={isSending || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
            >
              {isSending ? (
                <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Enviando...</>
              ) : (
                'Enviar CV por Correo'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
