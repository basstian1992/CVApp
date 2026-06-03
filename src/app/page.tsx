'use client';
import { useState } from 'react';
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
    <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)] text-slate-900 selection:bg-blue-200 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none">CV</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">CV Asistido Chile</h1>
          </div>
          <div className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
            Borrador Auto-guardado
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 w-full flex-grow">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">Crea tu Currículum</h2>
          <p className="text-center text-gray-500 text-lg">Te guiaremos paso a paso, ayudándote con Inteligencia Artificial ✨.</p>
        </div>

        {!showPreview ? (
          <>
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
        </>
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
      
      <footer className="text-center py-8 text-gray-400 text-sm mt-auto">
        &copy; {new Date().getFullYear()} CV Asistido Chile - Versión Beta
      </footer>
    </div>
  );
}
