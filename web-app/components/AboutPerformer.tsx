'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function AboutPerformer() {
    const config = useSiteConfig();
    const {
        name, bio, locations, height, eyeColor, weight, schedule, pricing,
        vesRate, taxiIncluded, paymentMethods, services, stats,
        personalMessage, targetAudience, activePromo, profileImages
    } = config;
    const { t } = useLanguage();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // Carrusel automático para las fotos de perfil
    useEffect(() => {
        if (profileImages && profileImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentImgIndex((prev) => (prev + 1) % profileImages.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [profileImages]);

    // Stats desde Convex (dinámicas)
    const statBars = stats && stats.length > 0 ? stats : [
        { label: 'Encanto', value: 95, color: '#ff2d75' },
        { label: 'Estilo', value: 98, color: '#00f3ff' },
        { label: 'Energía', value: 92, color: '#fff300' },
        { label: 'Misterio', value: 88, color: '#bd00ff' },
    ];

    const traits = [
        { label: 'Estatura', value: height || 'N/A' },
        { label: 'Ojos', value: eyeColor || 'N/A' },
        { label: 'Peso', value: weight || 'N/A' },
        { label: 'Ubicación', value: locations?.[0] || 'Caracas' },
        { label: 'Atiendo a', value: targetAudience?.join(', ') || 'Hombres' },
    ];

    const formatVES = (usd: number) => {
        return (usd * (vesRate || 0)).toLocaleString('es-VE', { minimumFractionDigits: 2 });
    };

    const images = profileImages && profileImages.length > 0
        ? profileImages
        : [
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop"
        ];

    return (
        <div className="max-w-4xl mx-auto space-y-16 py-6">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                {/* Left: Carrusel de fotos de perfil (Fijo 180px desktop) */}
                <div className="relative group flex-shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
                    <div className="w-[55%] sm:w-[40%] lg:w-[180px] relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff2d75] to-[#00f3ff] opacity-10 blur-2xl group-hover:opacity-15 transition-opacity" />
                        <div className="space-y-4">
                            <div className="relative glass-card p-1 border-white/10 group-hover:border-[var(--color-neon-pink)] transition-colors overflow-hidden">
                                <div className="aspect-[4/5] bg-[#1a1a25] relative overflow-hidden rounded-lg">
                                    {images.map((img, idx) => (
                                        <img
                                            key={img}
                                            src={img}
                                            alt={`${name} Profile ${idx}`}
                                            className={`absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110 ${idx === currentImgIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Puntero de fotos debajo */}
                            {images.length > 1 && (
                                <div className="flex justify-center gap-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImgIndex(idx)}
                                            className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${idx === currentImgIndex ? 'bg-[var(--color-neon-cyan)] w-6' : 'bg-white/10 w-2 hover:bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Floating Tag */}
                        <div className="absolute -top-2 -right-2 glass-card px-2 py-0.5 border-[var(--color-neon-pink)] shadow-[0_0_15px_rgba(255,45,117,0.1)] rotate-2 hidden lg:block z-30 opacity-60">
                            <p className="text-[8px] font-black uppercase italic tracking-widest neon-text-pink leading-none">{name}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Data & Stats */}
                <div className="flex-1 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                            DATOS <span className="text-[var(--color-neon-cyan)]">PERFORMANCE</span>
                        </h2>
                        <div className="h-0.5 w-16 bg-[var(--color-neon-cyan)] shadow-[0_0_10px_var(--color-neon-cyan)]" />
                    </div>

                    {activePromo?.isActive && (
                        <div className="bg-[var(--color-neon-pink)]/10 border border-[var(--color-neon-pink)]/30 p-4 relative overflow-hidden group animate-in zoom-in duration-500">
                            <div className="absolute top-0 right-0 bg-[var(--color-neon-pink)] text-black text-[7px] font-black px-2 py-0.5 uppercase tracking-tighter">PROMO ACTIVA</div>
                            <p className="text-[10px] font-black uppercase text-[var(--color-neon-pink)] mb-1 tracking-widest">{activePromo.label}</p>
                            <p className="text-[9px] font-bold text-white/70 uppercase leading-relaxed">{activePromo.description}</p>
                        </div>
                    )}

                    {personalMessage && (
                        <div className="bg-white/5 border-l-4 border-[var(--color-neon-pink)] p-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <p className="text-xs font-black uppercase italic tracking-widest text-white leading-relaxed">
                                "{personalMessage}"
                            </p>
                        </div>
                    )}

                    <p className="text-[10px] font-bold text-white/40 leading-relaxed max-w-md uppercase tracking-wider">
                        {bio ? bio : `Zynch by iwai | Official digital platform of ${name}. Exclusive content, personalized experiences, and direct connection.`}
                    </p>

                    {/* Quick Traits Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {traits.map(trait => (
                            <div key={trait.label} className="glass-card p-4 border-white/5 group hover:border-white/20 transition-all">
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{trait.label}</p>
                                <p className="font-black text-[11px] text-white group-hover:neon-text-cyan transition-colors truncate">{trait.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Disponibilidad Detallada */}
                    <div className="glass-card p-4 border-white/5 border-b border-[var(--color-neon-cyan)]/20">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Horario & Días</p>
                            <span className="text-[8px] font-black uppercase bg-[var(--color-neon-cyan)] text-black px-1.5 py-0.5 soft-blink">Activa Ahora</span>
                        </div>
                        <p className="font-black text-[11px] text-white mb-2">
                            {schedule?.is24h ? '24 Horas / Full Time' : 
                             'from' in schedule && 'to' in schedule ? 
                             `${schedule.from} - ${schedule.to}` : 'Horario flexible'
                            }
                        </p>
                        <div className="flex gap-1.5">
                            {schedule?.workingDays?.map((day: string) => (
                                <span key={day} className="text-[8px] font-black uppercase px-2 py-0.5 bg-white/5 border border-white/10 text-[var(--color-neon-cyan)]">
                                    {day}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats Bars */}
                    <div className="space-y-4">
                        {statBars.map(stat => (
                            <div key={stat.label} className="space-y-1.5">
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                    <span className="text-white/70">{stat.label}</span>
                                    <span className="opacity-40">{stat.value}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                        style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nueva Sección: Tarifas y Servicios */}
            <div className="grid md:grid-cols-2 gap-10 border-t border-white/5 pt-16">
                <section className="space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight text-white/90">
                            Tarifas de <span className="neon-text-cyan">Compañía</span>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Valoración Profesional - Discreción Garantizada</p>
                    </div>

                    <div className="space-y-4">
                        {(() => {
                            const items = [
                                { label: '1 Hora de Servicio', val: pricing?.h1 },
                            ];
                            
                            if (pricing && 'h2' in pricing && pricing.h2) {
                                items.push({ label: '2 Horas de Servicio', val: pricing.h2 });
                            }
                            if (pricing && 'night' in pricing && pricing.night) {
                                items.push({ label: 'Cita Nocturna', val: pricing.night });
                            }
                            if (pricing && 'customLabel' in pricing && pricing.customLabel && 'customPrice' in pricing && pricing.customPrice) {
                                items.push({ label: pricing.customLabel, val: pricing.customPrice });
                            }
                            
                            return items.filter(p => p.val).map(item => (
                                <div key={item.label} className="glass-card p-6 flex justify-between items-center border-white/5 group hover:border-[var(--color-neon-cyan)]/30 transition-all translate-x-0 overflow-hidden">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{item.label}</p>
                                        <p className="text-[9px] font-bold text-[#f8f8f8]/40 uppercase tracking-wider">
                                            ≈ Bs. {formatVES(item.val!)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black italic tracking-tighter text-white">
                                            Ref. {item.val} <span className="text-[10px] not-italic text-[var(--color-neon-cyan)] font-black tracking-widest border border-[var(--color-neon-cyan)]/30 px-1.5 py-0.5 ml-2">CA$H</span>
                                        </p>
                                    </div>
                                </div>
                            ));
                        })()}
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Traslado / Taxi</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${taxiIncluded ? 'text-green-500' : 'text-red-500/50'}`}>
                                {taxiIncluded ? '✓ INCLUIDO' : '✗ NO INCLUIDO'}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight text-white/90">
                            Estilos & <span className="neon-text-pink">Fetiches</span>
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Experiencias Personalizadas - Sin Tabúes</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {(services || []).map(service => (
                            <div key={service} className="glass-card p-4 border-white/5 border-l-2 border-[var(--color-neon-pink)]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">{service}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 border-b border-white/5 pb-2">Métodos de Pago Aceptados</h4>
                        <div className="flex flex-wrap gap-3">
                            {(paymentMethods || []).map(method => (
                                <span key={method} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 text-white/60">
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
