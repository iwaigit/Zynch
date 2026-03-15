'use client';

import { useEffect } from 'react';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP (Capa oscura de fondo para cerrar al hacer click afuera) */}
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* SIDEBAR OFF-CANVAS */}
      <div className="fixed top-2 bottom-2 right-2 w-[90%] max-w-sm z-[101] flex flex-col overflow-hidden rounded-[24px] bg-[#222222]/95 border border-white/5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 duration-300">
        
        {/* Cabecera Sidebar */}
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <button className="flex-1 rounded-xl bg-[#be2e57] py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#840824] active:scale-95">
            Iniciar sesión con Zynch
          </button>
          
          <button 
            onClick={onClose}
            className="ml-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-[#be2e57]/10 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links Centrales (Basado en el diseño de Transfer) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          <ul className="space-y-6">
            <li><a href="#" className="block text-base font-medium text-gray-300 hover:text-white hover:translate-x-1 transition-transform">Características</a></li>
            <li><a href="#" className="block text-base font-medium text-gray-300 hover:text-white hover:translate-x-1 transition-transform">Comparar</a></li>
            <li><a href="#" className="block text-base font-medium text-gray-300 hover:text-white hover:translate-x-1 transition-transform">Contáctanos</a></li>
            <li><a href="#" className="block text-base font-medium text-gray-300 hover:text-white hover:translate-x-1 transition-transform">Preguntas frecuentes</a></li>
            <li><a href="#" className="block text-base font-medium text-[#a2bfcc] hover:text-white hover:translate-x-1 transition-transform">Términos de servicio</a></li>
            <li><a href="#" className="block text-base font-medium text-[#a2bfcc] hover:text-white hover:translate-x-1 transition-transform">Política de privacidad</a></li>
          </ul>
        </div>

        {/* Footer Sidebar (Idioma y Tema - Paleta Zynch) */}
        <div className="flex items-center justify-between border-t border-white/5 bg-[#1a1a1a]/50 p-5">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5 text-[#9ead5c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Español
          </button>

          {/* Toggle Modo Claro/Oscuro simulado */}
          <div className="flex h-7 w-12 cursor-pointer items-center rounded-full bg-[#9fd7fb] p-1 shadow-inner shadow-black/20">
            <div className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center transform translate-x-5 transition-transform">
              {/* Luna para dark mode activa */}
              <svg className="w-3 h-3 text-[#1a1a1a]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
