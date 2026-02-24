'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useAuth } from '@/context/AuthContext';

export default function AppointmentSystem() {
    const { t, language } = useLanguage();
    const { tenantId } = useSiteConfig();
    const { user } = useAuth();
    const createAppointment = useMutation(api.appointments.create);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('20:00');
    const [selectedDuration, setSelectedDuration] = useState('1h');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const durations = [
        { id: '30m', label: t('dates.duration.30m') },
        { id: '1h', label: t('dates.duration.1h') },
        { id: '2h', label: t('dates.duration.2h') },
        { id: '4h', label: t('dates.duration.4h') },
        { id: '8h', label: t('dates.duration.8h') },
        { id: '10h', label: t('dates.duration.10h') },
        { id: '12h', label: t('dates.duration.12h') },
        { id: 'weekend', label: t('dates.duration.weekend') },
    ];

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) return;
        if (!tenantId || !user) {
            alert(language === 'es' ? 'Debes iniciar sesión para agendar.' : 'You must log in to book.');
            return;
        }

        setStatus('loading');

        try {
            await createAppointment({
                tenantId,
                userId: user.id as any,
                date: selectedDate,
                time: selectedTime,
                notes: notes,
            });
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Error al agendar');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="glass-card p-12 text-center space-y-6 animate-in zoom-in duration-500 max-w-2xl mx-auto border-[var(--color-neon-cyan)]/30">
                <div className="text-7xl">📅</div>
                <h2 className="text-4xl font-black uppercase italic neon-text-cyan">{t('dates.success')}</h2>
                <p className="text-white/60 font-bold text-lg">
                    {t('dates.success_desc').replace('{date}', selectedDate).replace('{time}', selectedTime)}
                </p>
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest text-white/40">
                    Status: PENDING_CONFIRMATION
                </div>
                <button
                    onClick={() => setStatus('idle')}
                    className="cyber-button w-full mt-4 hover:border-[var(--color-neon-cyan)] shadow-sm hover:shadow-[0_0_15px_var(--color-neon-cyan)] transition-all duration-300"
                >
                    {language === 'es' ? 'AGENDAR OTRA CITA' : 'BOOK ANOTHER'}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <header className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter neon-text-pink leading-none">
                    {t('dates.title')} <br /> <span className="text-white opacity-20">{t('dates.subtitle')}</span>
                </h2>
                <div className="h-0.5 w-16 bg-[var(--color-neon-pink)] mx-auto shadow-[0_0_10px_var(--color-neon-pink)]" />
            </header>

            <form onSubmit={handleBooking} className="grid md:grid-cols-2 gap-10 items-start">
                {/* Step 1 & 2: Date & Time selection */}
                <div className="glass-card p-8 space-y-8 relative overflow-hidden border-white/5">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-neon-cyan)]" />

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-neon-cyan)] block">{t('dates.step1')}</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-[#1a1a25] border border-white/10 p-4 rounded-xl font-bold text-base text-white outline-none focus:border-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)]/50 transition-all"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-neon-cyan)] block">{t('dates.step2')}</label>
                        <div className="relative">
                            <input
                                type="time"
                                required
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full bg-[#1a1a25] border border-white/10 p-4 rounded-xl font-black text-xl text-white outline-none focus:border-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)]/50 transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">🕒</div>
                        </div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                            {language === 'es' ? '* Selecciona cualquier hora (Día o Noche)' : '* Select any hour (Day or Night)'}
                        </p>
                    </div>
                </div>

                {/* Step 3 & 4: Duration & Notes */}
                <div className="space-y-8 flex flex-col h-full">
                    <div className="glass-card p-8 space-y-6 relative border-white/5">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-neon-pink)]" />

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-neon-pink)] block">{t('dates.step3')}</label>
                            <div className="grid grid-cols-2 gap-3">
                                {durations.map(dur => (
                                    <button
                                        key={dur.id}
                                        type="button"
                                        onClick={() => setSelectedDuration(dur.id)}
                                        className={`
                                            p-3 rounded-lg font-black text-[10px] uppercase tracking-tighter transition-all duration-300 border
                                            ${selectedDuration === dur.id
                                                ? 'bg-[var(--color-neon-pink)] text-white border-[var(--color-neon-pink)] shadow-[0_0_15px_rgba(255,45,117,0.3)]'
                                                : 'glass-card border-white/10 text-white/40 hover:border-[var(--color-neon-pink)] hover:shadow-[0_0_10px_rgba(255,45,117,0.2)] hover:-translate-y-1'}
                                        `}
                                    >
                                        {dur.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block">{t('dates.step4')}</label>
                            <textarea
                                placeholder={language === 'es' ? "Indica cualquier detalle..." : "Indicate any details..."}
                                className="w-full h-32 bg-[#1a1a25] border border-white/10 p-4 rounded-xl font-medium text-sm text-white/70 outline-none focus:border-[var(--color-neon-pink)] hover:border-[var(--color-neon-pink)]/50 transition-all resize-none"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`
                            glass-card w-full h-24 border border-[var(--color-neon-pink)] 
                            hover:shadow-[0_0_20px_rgba(255,45,117,0.4)]
                            hover:-translate-y-1 active:scale-95 transition-all duration-300
                            group flex flex-col items-center justify-center gap-1
                        `}
                    >
                        <span className="text-sm font-black tracking-[0.3em] text-white">
                            {status === 'loading' ? 'LOADING...' : t('dates.btn')}
                        </span>
                        <span className="text-[8px] opacity-40 font-bold uppercase tracking-widest group-hover:opacity-100 transition-opacity">
                            {t('dates.status')}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}
