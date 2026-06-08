'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProgressBar from '@/components/ProgressBar';
import PersonalDataStep from '@/components/steps/PersonalDataStep';
import ExperienceStep from '@/components/steps/ExperienceStep';
import EducationStep from '@/components/steps/EducationStep';
import SkillsStep from '@/components/steps/SkillsStep';
import SummaryStep from '@/components/steps/SummaryStep';
import CVPreview from '@/components/steps/CVPreview';

export default function Home() {
  const steps = ['Datos Personales', 'Experiencia', 'Formación', 'Habilidades', 'Resumen'];
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[family-name:var(--font-geist-sans)] text-slate-900 selection:bg-blue-200 flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/5 blur-3xl -z-10 rounded-b-full transform -translate-y-1/2"></div>
      
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/20 bg-white relative">
              <Image src="/logo.png" alt="CVApp Logo" fill sizes="40px" className="object-cover scale-[1.08]" priority onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-blue-600 font-bold text-lg leading-none tracking-tighter">CV</span>'; }} />
            </div>
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 tracking-tight">CV App</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-100/50 px-3 py-1.5 rounded-full border border-blue-200/50 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              App Gratuita
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-grow relative z-10">
        
        {currentStep === 1 && !showPreview && (
          <div className="mb-14 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-2">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl shadow-blue-500/20 bg-white flex items-center justify-center overflow-hidden border-4 border-white relative">
                  <Image src="/logo.png" alt="CVApp Logo Grande" fill sizes="(max-width: 768px) 128px, 160px" className="object-cover scale-[1.08]" priority onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 tracking-tight pb-2">
                CVApp - Currículum Gratis en 1 minuto
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                Destaca tu perfil profesional con nuestra App gratuita. Genera tu currículum en minutos con herramientas avanzadas e intuitivas.
              </p>
              <p className="text-md md:text-lg text-blue-700 max-w-2xl mx-auto font-semibold bg-blue-50 py-2 px-4 rounded-xl border border-blue-100 inline-block">
                Esperamos te sirva este regalo de parte de OMIL Talagante y <a href="https://www.asesoriapublica.cl" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">www.asesoriapublica.cl</a>
              </p>
              <div className="flex flex-col items-center gap-4 mt-6">
                <button 
                  onClick={() => document.getElementById('cv-builder-start')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 text-xl border-2 border-white/20 w-full max-w-md justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Creemos tu CV
                  <span className="block text-xs font-normal opacity-90 -mt-1 ml-2 border-l border-white/30 pl-2">rápido, gratis<br/>y paso a paso</span>
                </button>
                <Link href="/capacitate" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 text-lg border-2 border-white/20 w-full max-w-md justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Capacítate
                  <span className="block text-xs font-normal opacity-90 -mt-1 ml-2 border-l border-white/30 pl-2">mejora tus habilidades para<br/>asegurar tu contratación</span>
                </Link>
              </div>
            </div>

            {/* Social Justice Manifesto */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <blockquote className="relative bg-white/90 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-2xl shadow-xl text-center">
                <div className="text-blue-500 mb-3 flex justify-center">
                  <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                </div>
                <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
                  "Está hecho para las comunidades y personas cesantes en Chile, porque creemos en la justicia social, en la equidad, y en que la IA debe estar al uso de la fuerza trabajadora."
                </p>
              </blockquote>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/60 backdrop-blur-sm border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Asistencia IA</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Impulsado por IA avanzada. Mejora tu redacción, corrige ortografía y dale un tono profesional a tu experiencia con un solo clic.</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">🎙️</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Dictado por Voz</h3>
                <p className="text-slate-600 text-sm leading-relaxed">¿No quieres escribir? Presiona el micrófono y simplemente cuéntanos tu experiencia. El sistema redactará por ti.</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Uso Intuitivo</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Diseñado pensando en ti. Una interfaz limpia y guiada paso a paso para que cualquier persona pueda crear un currículum perfecto.</p>
              </div>
            </div>
            
            {/* Didactic Alert */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm mt-8">
              <div className="text-3xl flex-shrink-0 animate-bounce">💡</div>
              <div>
                <h4 className="font-bold text-indigo-900 mb-1 text-lg">¡Consejo para un CV Perfecto!</h4>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  Para llenar tu currículum de forma rápida y profesional, te sugerimos utilizar nuestras herramientas:<br/>
                  <span className="inline-flex items-center gap-1 font-semibold mt-2 text-blue-700 bg-white px-2 py-1 rounded-md shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> Dictado por Voz</span> para hablar en lugar de escribir.<br/>
                  <span className="inline-flex items-center gap-1 font-semibold mt-2 text-purple-700 bg-white px-2 py-1 rounded-md shadow-sm">✨ Arreglar con IA</span> (el botón de estrellita) para corregir ortografía y sonar mucho más formal.
                </p>
              </div>
            </div>
          </div>
        )}

        {!showPreview ? (
          <div id="cv-builder-start">
            <ProgressBar currentStep={currentStep} totalSteps={steps.length} steps={steps} />

            <div className="mt-10 transition-all duration-500 ease-in-out">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PersonalDataStep />
              <div className="max-w-2xl mx-auto mt-4 flex justify-end">
                <button 
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Siguiente: Experiencia
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ExperienceStep />
              <div className="max-w-2xl mx-auto mt-4 flex justify-between">
                <button onClick={handleBack} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all">Atrás</button>
                <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  Siguiente: Formación <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <EducationStep />
              <div className="max-w-2xl mx-auto mt-4 flex justify-between">
                <button onClick={handleBack} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all">Atrás</button>
                <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  Siguiente: Habilidades <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SkillsStep />
              <div className="max-w-2xl mx-auto mt-4 flex justify-between">
                <button onClick={handleBack} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all">Atrás</button>
                <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  Siguiente: Resumen <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SummaryStep />
              <div className="max-w-2xl mx-auto mt-4 flex justify-between">
                <button onClick={handleBack} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all">Atrás</button>
                <button onClick={() => { setShowPreview(true); window.scrollTo(0,0); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Finalizar y Ver CV
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setShowPreview(false)} className="mb-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-xl transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Volver a editar
            </button>
            <CVPreview />
          </div>
        )}
      </main>
      
      <footer className="w-full bg-slate-900 text-slate-400 py-10 mt-auto relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <span className="font-medium text-slate-300">Web y App Registrada</span>
          </div>
          <p className="text-sm text-center">
            Desarrollado por <a href="https://www.asesoriapublica.cl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-blue-500/30 underline-offset-4 transition-colors">www.asesoriapublica.cl</a><br/>
            Un regalo para la comunidad de OMIL Talagante
          </p>
          <div className="h-px w-24 bg-slate-800 my-2"></div>
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Asesoría Pública. Todos los derechos reservados.<br/>
            CV App es una herramienta de uso gratuito.
          </p>
        </div>
      </footer>
    </div>
  );
}
