import { useState, useEffect } from 'react';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function MarketingAdmin() {
    const { name, initials } = useSiteConfig();
    const [formData, setFormData] = useState({
        siteTitle: '',
        heroText: '',
        subText: 'Contenido exclusivo, lencería de lujo y juguetes diseñados para tus deseos más profundos.',
        telegramLink: '@PerformerOfficial',
        whatsappLink: '+34 600 000 000',
        promoVip: 'Suscríbete para recibir contenido y ofertas especiales.'
    });

    useEffect(() => {
        if (name) {
            setFormData(prev => ({
                ...prev,
                siteTitle: `${name} Fun`,
                heroText: `Bienvenido al Universo ${initials}`,
                telegramLink: `@${name.replace(/\s+/g, '')}Official`
            }));
        }
    }, [name, initials]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="flex-1 p-8 md:p-12 space-y-12">
            <header className="space-y-2 border-b border-white/5 pb-8">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter">Marketing <span className="neon-text-cyan">& SEO</span></h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Configuración de Mensajes y Enlaces Globales</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Hero Section Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-neon-cyan)]/20 to-transparent rounded-2xl blur opacity-50 transition-opacity group-hover:opacity-100" />
                    <section className="relative glass-card bg-[#1a1a25]/90 p-8 space-y-8 border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-neon-cyan)] pb-4 border-b border-white/10">Hero (Pantalla Principal)</h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Título de Impacto</label>
                                <input
                                    name="heroText"
                                    value={formData.heroText}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold text-sm outline-none focus:border-[var(--color-neon-cyan)] transition-colors"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Texto Descriptivo</label>
                                <textarea
                                    name="subText"
                                    value={formData.subText}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold text-sm outline-none focus:border-[var(--color-neon-cyan)] transition-colors resize-none"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Links Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-neon-pink)]/20 to-transparent rounded-2xl blur opacity-50 transition-opacity group-hover:opacity-100" />
                    <section className="relative glass-card bg-[#1a1a25]/90 p-8 space-y-8 border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-neon-pink)] pb-4 border-b border-white/10">Canales de Venta Directa</h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Username Telegram</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neon-pink)] font-black">@</span>
                                    <input
                                        name="telegramLink"
                                        value={formData.telegramLink.replace('@', '')}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 p-4 pl-10 rounded-xl font-bold text-sm outline-none focus:border-[var(--color-neon-pink)] transition-colors text-ks-neon-pink"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">WhatsApp Business</label>
                                <input
                                    name="whatsappLink"
                                    value={formData.whatsappLink}
                                    onChange={handleChange}
                                    placeholder="+00 000 000 000"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl font-bold text-sm outline-none focus:border-[var(--color-neon-pink)] transition-colors"
                                />
                            </div>
                            <div className="pt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 italic text-[9px] text-white/40 leading-relaxed">
                                Nota: Estos enlaces se actualizan en tiempo de ejecución en todos los botones "Order Now" del sitio público.
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="flex justify-end pt-8">
                <button
                    onClick={() => alert('¡Variables de Marketing Sincronizadas!')}
                    className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-[var(--color-neon-cyan)] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]"
                >
                    Guardar Configuración
                </button>
            </div>
        </main>
    );
}
