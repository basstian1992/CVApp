import Link from 'next/link';

export default function CapacitatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-[family-name:var(--font-geist-sans)] text-slate-900 flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-600/5 blur-3xl -z-10 rounded-b-full transform -translate-y-1/2"></div>
      
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Volver al Inicio</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 tracking-tight">Capacitación</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Mejora tus habilidades</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Asegura tu contratación certificándote de manera gratuita. Conoce los mejores portales de cursos en línea disponibles en Chile para potenciar tu perfil profesional.
          </p>
        </div>

        <div className="space-y-6">
          {/* SENCE */}
          <a href="https://eligetucurso.sence.cl" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all transform group-hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row">
                <div className="bg-red-600 sm:w-1/3 p-6 flex flex-col justify-center items-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700"></div>
                  <h3 className="text-3xl font-extrabold relative z-10 text-center tracking-wider">SENCE</h3>
                  <p className="text-red-100 font-medium relative z-10 text-sm mt-2">Elige tu Curso</p>
                </div>
                <div className="p-6 sm:p-8 sm:w-2/3 flex flex-col justify-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Cursos Gratuitos del Gobierno</h4>
                  <p className="text-gray-600 mb-4">Accede a una amplia variedad de cursos gratuitos financiados por SENCE. Ideal para mejorar tus competencias laborales en diversas áreas, desde oficios hasta tecnología.</p>
                  <span className="text-red-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Ver cursos disponibles <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                </div>
              </div>
            </div>
          </a>

          {/* Microsoft */}
          <a href="https://learn.microsoft.com/es-es/?wt.mc_id=skillingwebcle_midfunnelcampaign_webpage_gdc_xcsa" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all transform group-hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row">
                <div className="bg-blue-600 sm:w-1/3 p-6 flex flex-col justify-center items-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700"></div>
                  <svg className="w-16 h-16 relative z-10 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/></svg>
                  <h3 className="text-2xl font-extrabold relative z-10 text-center tracking-wider">Microsoft Learn</h3>
                </div>
                <div className="p-6 sm:p-8 sm:w-2/3 flex flex-col justify-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Certificaciones Tecnológicas</h4>
                  <p className="text-gray-600 mb-4">Aprende habilidades digitales demandadas globalmente. Capacítate en inteligencia artificial, desarrollo, análisis de datos y herramientas de Microsoft 100% gratis.</p>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Comenzar a aprender <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                </div>
              </div>
            </div>
          </a>

          {/* ChileAtiende / Mine Class */}
          <a href="https://www.chileatiende.gob.cl/fichas/48867-programa-cursos-en-linea" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all transform group-hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row">
                <div className="bg-orange-500 sm:w-1/3 p-6 flex flex-col justify-center items-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <h3 className="text-3xl font-extrabold relative z-10 text-center leading-tight">Chile<br/>Atiende</h3>
                  <p className="text-orange-100 font-medium relative z-10 text-xs mt-2 text-center uppercase tracking-wider border-t border-orange-300 pt-2 w-full">Cursos en Línea</p>
                </div>
                <div className="p-6 sm:p-8 sm:w-2/3 flex flex-col justify-center">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Programa de Cursos SENCE / Mine Class</h4>
                  <p className="text-gray-600 mb-4">Accede gratis a cursos especializados, por ejemplo en minería subterránea y planificación estratégica del negocio minero. Una gran oportunidad para especializarse en el rubro.</p>
                  <span className="text-orange-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Ir a ChileAtiende <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </main>

      <footer className="w-full bg-slate-900 text-slate-400 py-10 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-center">
            Un regalo para la comunidad de OMIL Talagante y <a href="https://www.asesoriapublica.cl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">www.asesoriapublica.cl</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
