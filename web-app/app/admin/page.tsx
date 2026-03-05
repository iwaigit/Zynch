'use client';

import Link from 'next/link';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminDashboard() {
    const { name, tenantId } = useSiteConfig();
    const resetDefaults = useMutation(api.siteConfig.resetToDefaults);

    const handleReset = async () => {
        if (confirm('¿Estás seguro de resetear la marca a "Performer Name"?') && tenantId) {
            await resetDefaults({ tenantId: tenantId as any });
            window.location.reload();
        }
    };
    return (
        <main className="flex-1 p-8 md:p-12 space-y-12">
            <header className="flex justify-between items-end">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none whitespace-nowrap">Main <span className="neon-text-cyan">Control</span></h2>
                    <div className="flex items-center gap-4">
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] font-mono tracking-widest">{name} Enterprise Global Gateway</p>
                        <Link href="/admin/master" className="text-[9px] font-bold text-pink-500 hover:text-pink-400 uppercase tracking-widest border border-pink-500/20 px-2 py-0.5 rounded transition-colors">
                            Master Admin Access
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="text-[8px] font-black uppercase tracking-widest text-white/10 hover:text-red-500 transition-colors border border-white/5 px-3 py-1 rounded"
                    >
                        Reset Branding Data
                    </button>
                    <div className="glass-card bg-white/5 py-2 px-6 flex items-center gap-3 border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                        <span className="font-black uppercase text-[10px] tracking-widest text-white/60">Sistema Operativo</span>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
                <h3 className="col-span-full text-xl font-black uppercase italic tracking-tighter border-b border-white/5 pb-4">Panel de Control de {name}</h3>
                {[
                    { label: 'Visitas Hoy', value: '2,840', color: 'text-white' },
                    { label: 'Pedidos Nuevos', value: '12', color: 'neon-text-cyan' },
                    { label: 'Ventas (USD)', value: '$1,450', color: 'neon-text-yellow' },
                    { label: 'Conversión', value: '4.2%', color: 'neon-text-pink' },
                ].map((stat) => (
                    <div key={stat.label} className="glass-card p-6 border-white/5 space-y-2 group hover:border-white/20 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--color-neon-cyan)]">{name} Platform v1.0</p>
                        <p className={`text-2xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <section className="space-y-6">
                <h3 className="text-xl font-black uppercase italic tracking-tighter border-b border-white/5 pb-4">Acciones Críticas</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <Link href="/admin/galeria" className="glass-card p-8 flex flex-col justify-between group hover:border-[var(--color-neon-pink)] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-neon-pink)]/5 blur-2xl group-hover:bg-[var(--color-neon-pink)]/20 transition-all" />
                        <h4 className="font-black text-xl uppercase italic group-hover:neon-text-pink transition-colors">Subir Contenido</h4>
                        <p className="font-bold text-white/30 text-[10px] uppercase tracking-widest mt-2">Gestionar Galería y Packs</p>
                    </Link>

                    <Link href="/admin/pedidos" className="glass-card p-8 flex flex-col justify-between group hover:border-[var(--color-neon-cyan)] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-neon-cyan)]/5 blur-2xl group-hover:bg-[var(--color-neon-cyan)]/20 transition-all" />
                        <h4 className="font-black text-xl uppercase italic group-hover:neon-text-cyan transition-colors">Revisar Pedidos</h4>
                        <p className="font-bold text-white/30 text-[10px] uppercase tracking-widest mt-2">12 Ventas pendientes</p>
                    </Link>

                    <Link href="/admin/marketing" className="glass-card p-8 flex flex-col justify-between group hover:border-[var(--color-neon-yellow)] transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-neon-yellow)]/5 blur-2xl group-hover:bg-[var(--color-neon-yellow)]/20 transition-all" />
                        <h4 className="font-black text-xl uppercase italic group-hover:neon-text-yellow transition-colors">Config Marketing</h4>
                        <p className="font-bold text-white/30 text-[10px] uppercase tracking-widest mt-2">Textos, Links y Tasas</p>
                    </Link>
                </div>
            </section>
        </main>
    );
}
