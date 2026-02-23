'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import RegisterForm, { FormMode } from '@/components/RegisterForm';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function LinkTree() {
    const { name, logo, links, email } = useSiteConfig();
    const { language, setLanguage, t } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState<FormMode>('login');

    const LINKS = [
        { label: t('nav.profile'), href: '/perfil', color: 'border-[#f472b6]', glow: 'hover:shadow-[0_0_15px_rgba(244,114,182,0.4)]', icon: '✨' },
        { label: t('nav.dates'), href: '/agendar', color: 'border-[#00f3ff]', glow: 'hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]', icon: '📅' },
        { label: t('nav.shop'), href: '#tienda', color: 'border-[#fff300]', glow: 'hover:shadow-[0_0_15px_rgba(255,243,0,0.4)]', icon: '🛍️' },
        { label: t('nav.toys'), href: '#tienda', color: 'border-[#00f3ff]', glow: 'hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]', icon: '🔥' },
        { label: t('nav.vip'), href: '#contacto', color: 'border-[#bd00ff]', glow: 'hover:shadow-[0_0_15px_rgba(189,0,255,0.4)]', icon: '💎' },
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-10 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Language Toggle */}
            <div className="flex bg-white/5 p-1 rounded-full border border-white/10 glass-card scale-90">
                <button
                    onClick={() => setLanguage('es')}
                    className={`px-4 py-1.5 rounded-full font-black text-[9px] transition-all ${language === 'es' ? 'bg-white text-black' : 'text-white/40'}`}
                >
                    ES
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-1.5 rounded-full font-black text-[9px] transition-all ${language === 'en' ? 'bg-white text-black' : 'text-white/40'}`}
                >
                    EN
                </button>
            </div>

            {/* Logo Section with Context Menu */}
            <div className="relative group scale-90 md:scale-100 z-50">
                <div className="absolute -inset-3 bg-gradient-to-r from-[#ff2d75] to-[#00f3ff] rounded-full blur-[30px] opacity-10 group-hover:opacity-30 transition-opacity duration-500" />

                <div
                    onClick={() => setShowMenu(!showMenu)}
                    className="relative block glass-card p-4 rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500 cursor-pointer"
                >
                    <Image
                        src={logo || "/logo.png"}
                        alt={`${name} Logo`}
                        width={120}
                        height={120}
                        className="object-contain brightness-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    />
                </div>

                {/* Context Menu */}
                {showMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-[#0d0d12]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 z-50">
                        <div className="p-1">
                            <button
                                onClick={() => { setAuthMode('login'); setShowAuth(true); setShowMenu(false); }}
                                className="w-full text-left px-4 py-3 text-[10px] uppercase font-black tracking-widest text-white/80 hover:bg-white/5 hover:text-[var(--color-neon-cyan)] transition-colors"
                            >
                                🔐 Iniciar Sesión
                            </button>
                            <button
                                onClick={() => { setAuthMode('register'); setShowAuth(true); setShowMenu(false); }}
                                className="w-full text-left px-4 py-3 text-[10px] uppercase font-black tracking-widest text-white/80 hover:bg-white/5 hover:text-[var(--color-neon-pink)] transition-colors"
                            >
                                ✨ Registrarse
                            </button>
                            <button
                                onClick={() => { setAuthMode('forgot'); setShowAuth(true); setShowMenu(false); }}
                                className="w-full text-left px-4 py-3 text-[10px] uppercase font-black tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-colors border-t border-white/5"
                            >
                                ❓ Recuperar Clave
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Auth Modal */}
            {showAuth && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg relative">
                        <RegisterForm initialMode={authMode} onClose={() => setShowAuth(false)} />
                    </div>
                </div>
            )}

            {/* Vertical Menu */}
            <div className="w-full flex flex-col gap-4">
                {LINKS.map((link, idx) => (
                    <Link
                        key={idx}
                        href={link.href}
                        className={`
              glass-card 
              flex items-center justify-between
              p-4 border ${link.color} 
              ${link.glow} 
              transition-all duration-300 group
              no-underline text-white
              hover:-translate-y-1 active:scale-95
            `}
                    >
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">
                                {language === 'es' ? 'Sección' : 'Section'}
                            </span>
                            <span className="text-sm font-black uppercase italic tracking-tighter">{link.label}</span>
                        </div>
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300 shadow-white">{link.icon}</span>
                    </Link>
                ))}
            </div>

            {/* Contact Link */}
            <div className="text-center pt-4">
                <p className="font-bold text-[9px] tracking-[0.4em] uppercase text-[var(--color-neon-cyan)] animate-pulse">
                    {email}
                </p>
            </div>
        </div>
    );
}
