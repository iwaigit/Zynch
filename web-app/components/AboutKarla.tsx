'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function AboutKarla() {
    const { name, bio } = useSiteConfig();
    const { t } = useLanguage();

    const stats = [
        { label: t('profile.charm'), value: 95, color: 'bg-[#ff2d75]' },
        { label: t('profile.style'), value: 98, color: 'bg-[#00f3ff]' },
        { label: t('profile.energy'), value: 92, color: 'bg-[#fff300]' },
        { label: t('profile.mystery'), value: 88, color: 'bg-[#bd00ff]' },
    ];

    const traits = [
        { label: t('profile.height'), value: '1.68m' },
        { label: t('profile.eyes'), value: t('profile.eyes_val') },
        { label: t('profile.zodiac'), value: t('profile.zodiac_val') },
        { label: 'Hobby', value: 'Gaming & Anime' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-6">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Left: Portait with Glitch Frame - Formato 16:9 */}
                <div className="relative group w-full">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-[#ff2d75] to-[#00f3ff] opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
                    <div className="relative glass-card p-1.5 border-white/10 group-hover:border-[var(--color-neon-pink)] transition-colors overflow-hidden">
                        <div className="aspect-video bg-[#1a1a25] relative overflow-hidden rounded-lg">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                                alt={`${name} Profile`}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                            />
                            {/* Cyber UI Overlays */}
                            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                                <div className="bg-black/80 px-2 py-0.5 border-l border-[var(--color-neon-pink)] text-[7px] font-black tracking-[0.4em] uppercase">SYSTEM_ACCESS: GRANTED</div>
                                <div className="bg-black/80 px-2 py-0.5 border-l border-[var(--color-neon-cyan)] text-[7px] font-black tracking-[0.4em] uppercase">BIO_SCAN: 100%</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Tag */}
                    <div className="absolute -bottom-4 -right-4 glass-card px-6 py-3 border-[var(--color-neon-pink)] shadow-[0_0_20px_rgba(255,45,117,0.2)] rotate-2 hidden md:block">
                        <p className="text-xl font-black uppercase italic tracking-tighter neon-text-pink leading-none">{name}</p>
                    </div>
                </div>

                {/* Right: Data & Stats */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                            {t('profile.title')} <br /> <span className="text-[var(--color-neon-cyan)]">{t('profile.subtitle')}</span>
                        </h2>
                        <div className="h-0.5 w-16 bg-[var(--color-neon-cyan)] shadow-[0_0_10px_var(--color-neon-cyan)]" />
                    </div>

                    <p className="text-sm font-bold text-white/50 leading-relaxed max-w-md">
                        {bio}
                    </p>

                    {/* Stats Bars */}
                    <div className="space-y-4">
                        {stats.map(stat => (
                            <div key={stat.label} className="space-y-1.5">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                    <span className="text-white/70">{stat.label}</span>
                                    <span className="opacity-40">{stat.value}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full ${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.1)] animate-in slide-in-from-left duration-1000`}
                                        style={{ width: `${stat.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Traits Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {traits.map(trait => (
                            <div key={trait.label} className="glass-card p-4 border-white/5 group hover:border-white/20 transition-all">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-0.5">{trait.label}</p>
                                <p className="font-black text-sm text-white group-hover:neon-text-cyan transition-colors">{trait.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
