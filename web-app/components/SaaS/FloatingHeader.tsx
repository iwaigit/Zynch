'use client';

import { useState, useEffect } from 'react';
import SidebarMenu from './SidebarMenu';

export default function FloatingHeader() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <>
      {/* HEADER PASTILLA FLOTANTE */}
      <div className="fixed top-4 left-4 right-4 z-[50] flex items-center justify-between rounded-full bg-[#1a1a1a]/80 border border-white/5 px-4 py-3 shadow-2xl backdrop-blur-xl md:left-1/2 md:-ml-[350px] md:w-[700px]">
        
        {/* Logo / Brand Zynchito */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#be2e57]/10 text-xl shadow-inner border border-[#be2e57]/20">
            🦎
          </div>
          <span className="font-bold tracking-tight text-white text-lg">Zynch</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Botón Instalar (Solo visible si es PWA Instalable) */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="hidden md:flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-[#9fd7fb] transition hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Instalar</span>
            </button>
          )}

          {/* Icono Instalar Móvil */}
          {isInstallable && (
            <button onClick={handleInstallClick} className="md:hidden p-2 text-[#9fd7fb] bg-white/5 rounded-full">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}

          {/* Botón CTA */}
          <button className="rounded-full bg-[#be2e57] px-4 py-1.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#840824] active:scale-95">
            Log in
          </button>

          {/* Menú Hamburguesa */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* RENDER SIDEBAR OFF-CANVAS */}
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
