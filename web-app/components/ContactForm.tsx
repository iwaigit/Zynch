'use client';

import { useState } from 'react';

import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function ContactForm() {
    const { name } = useSiteConfig();
    const [formData, setFormData] = useState({
        nombre: '',
        prefijo: '',
        telefono: '',
        email: '',
        mensaje: '',
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulación de envío
        setTimeout(() => {
            setStatus('success');
            setFormData({ nombre: '', prefijo: '', telefono: '', email: '', mensaje: '' });
        }, 1500);
    };

    return (
        <div className="glass-card p-6 md:p-10 w-full max-w-lg mx-auto relative overflow-hidden group border-white/5 hover:border-[var(--color-neon-cyan)]/30 transition-all duration-500">
            {/* Cyber Decoration */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--color-neon-cyan)] to-transparent opacity-50" />

            <header className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter neon-text-cyan leading-none">
                    DIME TUS <br /> <span className="text-white opacity-20 text-xl">DESEOS...</span>
                </h2>
                <div className="h-[2px] w-12 bg-[var(--color-neon-cyan)] mx-auto shadow-[0_0_10px_var(--color-neon-cyan)]" />
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Nombre Completo</label>
                    <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold text-sm text-white outline-none focus:border-[var(--color-neon-cyan)] focus:bg-white/[0.08] transition-all"
                        placeholder={`${name} Fan`}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Prefijo</label>
                        <select
                            required
                            value={formData.prefijo}
                            onChange={(e) => setFormData({ ...formData, prefijo: e.target.value })}
                            className="w-full bg-[#1a1a25] border border-white/10 p-3 rounded-lg font-bold text-sm text-white outline-none focus:border-[var(--color-neon-cyan)] transition-all"
                        >
                            <option value="">4XX</option>
                            <option value="412">412</option>
                            <option value="414">414</option>
                            <option value="424">424</option>
                            <option value="416">416</option>
                        </select>
                    </div>
                    <div className="col-span-2 space-y-1">
                        <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Teléfono</label>
                        <input
                            type="tel"
                            required
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold text-sm text-white outline-none focus:border-[var(--color-neon-cyan)] transition-all"
                            placeholder="7 dígitos"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Email Profesional</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-bold text-sm text-white outline-none focus:border-[var(--color-neon-pink)] transition-all"
                        placeholder="tu@correo.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Mensaje / Deseo</label>
                    <textarea
                        required
                        value={formData.mensaje}
                        onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg font-medium text-sm text-white/80 outline-none focus:border-[var(--color-neon-cyan)] min-h-[100px] transition-all resize-none"
                        placeholder="Escribe aquí tu mensaje especial..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`
                    glass-card w-full py-5 border border-[var(--color-neon-cyan)] 
                    hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]
                    hover:-translate-y-1 active:scale-95 transition-all duration-300
                    text-sm font-black uppercase tracking-[0.3em] text-white group
                `}
                >
                    <span className="flex items-center justify-center gap-2">
                        {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR MENSAJE'}
                        <span className="text-lg group-hover:translate-x-1 transition-transform">⚡</span>
                    </span>
                </button>

                {status === 'success' && (
                    <div className="mt-4 p-3 bg-[var(--color-neon-cyan)]/10 border border-[var(--color-neon-cyan)]/30 rounded-lg animate-in zoom-in duration-300">
                        <p className="text-center font-black text-[var(--color-neon-cyan)] text-[10px] uppercase tracking-widest">
                            ¡Recibido! Procesando tu deseo...
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
}
