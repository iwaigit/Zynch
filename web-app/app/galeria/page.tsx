'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Gallery from '@/components/Gallery';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function GaleriaPage() {
    const { name } = useSiteConfig();
    const router = useRouter();
    const { t, language } = useLanguage();
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        const v = localStorage.getItem('ks-age-verified');
        setIsVerified(v === 'true');
    }, []);

    if (isVerified === null) return null;

    return (
        <main className="min-h-screen bg-[#0d0d12] text-white p-6 md:p-12 selection:bg-[#ff2d75]">
            {/* Header / Nav */}
            <nav className="max-w-6xl mx-auto mb-16 flex justify-between items-center">
                <Link href="/perfil" className="font-black uppercase tracking-widest text-[var(--color-neon-pink)] hover:neon-text-pink transition-all text-sm">
                    {t('nav.back_profile')}
                </Link>
                <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                    EXCL_GATE_{name.replace(' ', '_').toUpperCase()}_V2
                </div>
            </nav>

            <div className="max-w-6xl mx-auto">
                {!isVerified ? (
                    // Registro Gate
                    <div className="glass-card p-12 md:p-24 text-center space-y-12 relative overflow-hidden group border-white/5 animate-in zoom-in duration-500">
                        <div className="space-y-6 relative z-10">
                            <div className="text-6xl md:text-8xl mb-8 opacity-40 group-hover:scale-110 transition-transform duration-700">🔐</div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter neon-text-pink leading-tight">
                                {t('gallery.title')} <br /> <span className="text-white">{t('gallery.subtitle')}</span>
                            </h2>
                            <p className="max-w-sm mx-auto font-bold text-white/40 text-[10px] md:text-xs uppercase tracking-[0.4em] leading-loose">
                                {t('profile.min_age')}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/verificar-edad')}
                            className={`
                                glass-card border border-[var(--color-neon-pink)]
                                hover:shadow-[0_0_25px_rgba(255,45,117,0.4)]
                                hover:-translate-y-1 active:scale-95 transition-all duration-300
                                text-xs px-16 py-6 group text-white font-black uppercase tracking-widest
                            `}
                        >
                            {language === 'es' ? 'DESBLOQUEAR AHORA' : 'UNLOCK NOW'}
                        </button>
                    </div>
                ) : !showGallery ? (
                    // Muro Legal (Legal Wall)
                    <div className="max-w-3xl mx-auto glass-card p-8 md:p-12 space-y-10 border-[var(--color-neon-pink)]/30 animate-in fade-in duration-700">
                        <header className="text-center space-y-3">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter neon-text-pink">{t('legal.title')}</h2>
                            <div className="h-0.5 w-16 bg-[var(--color-neon-pink)] mx-auto" />
                        </header>

                        <div className="space-y-6 text-xs md:text-sm font-bold text-white/50 leading-relaxed text-justify h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                            <p className="border-l-2 border-[var(--color-neon-pink)] pl-4">{t('legal.p1')}</p>
                            <p className="border-l-2 border-[var(--color-neon-cyan)] pl-4">{t('legal.p2')}</p>
                            <p className="border-l-2 border-white/20 pl-4">{t('legal.p3')}</p>
                        </div>

                        <div className="pt-6 space-y-8">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={hasAcceptedTerms}
                                        onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-6 h-6 border-2 border-white/20 rounded peer-checked:border-[var(--color-neon-pink)] peer-checked:bg-[var(--color-neon-pink)]/20 transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-[var(--color-neon-pink)] font-black">✓</div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                                    {t('legal.checkbox')}
                                </span>
                            </label>

                            <button
                                onClick={() => setShowGallery(true)}
                                disabled={!hasAcceptedTerms}
                                className={`
                                    glass-card w-full py-5 border border-[var(--color-neon-pink)]
                                    enabled:hover:shadow-[0_0_20px_rgba(255,45,117,0.4)]
                                    enabled:hover:-translate-y-1 active:scale-95 transition-all duration-300
                                    text-sm font-black uppercase tracking-[0.4em] text-white
                                    disabled:opacity-20 disabled:cursor-not-allowed group
                                `}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {t('legal.btn')}
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    // Galería Final
                    <div className="animate-in fade-in duration-1000">
                        <Gallery />
                    </div>
                )}
            </div>
        </main>
    );
}
