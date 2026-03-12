'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function PromoterDashboard() {
    const { name } = useSiteConfig();
    const { user, isAuthenticated, isVerified } = useAuth();
    const router = useRouter();
    const activityLogs = useQuery(api.activityLogs.listAll, { tenantId: 'default-tenant' as any }); // Temporal

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Redirect to age verification if not verified
        if (!isVerified) {
            router.push('/verificar-edad');
            return;
        }

        // Only allow promoter role
        if (user?.role !== 'promoter') {
            router.push('/');
        }
    }, [isAuthenticated, isVerified, user, router]);

    if (!isAuthenticated || !isVerified || user?.role !== 'promoter') {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0d0d12] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-5xl font-black uppercase italic tracking-tighter neon-text-pink">
                                Dashboard <span className="text-white">Promotor</span>
                            </h1>
                            <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mt-2">
                                Panel de Control de {name}
                            </p>
                        </div>
                        <Link href="/" className="cyber-button">
                            ← Volver al Sitio
                        </Link>
                    </div>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-white/40">Total Clientes</p>
                        <p className="text-4xl font-black neon-text-cyan">{activityLogs?.filter(log => log.action === 'user_registered').length || 0}</p>
                    </div>
                    <div className="glass-card p-6 space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-white/40">Logins Hoy</p>
                        <p className="text-4xl font-black neon-text-pink">
                            {activityLogs?.filter(log =>
                                log.action === 'user_login' &&
                                new Date(log.timestamp).toDateString() === new Date().toDateString()
                            ).length || 0}
                        </p>
                    </div>
                    <div className="glass-card p-6 space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-white/40">Actividad Total</p>
                        <p className="text-4xl font-black text-white">{activityLogs?.length || 0}</p>
                    </div>
                </div>

                {/* Activity Logs */}
                <section className="glass-card p-8 space-y-6">
                    <h2 className="text-2xl font-black uppercase italic neon-text-cyan">Registro de Actividad</h2>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {activityLogs?.slice(0, 50).map((log) => (
                            <div key={log._id} className="bg-white/5 border border-white/10 p-4 rounded-lg hover:border-[var(--color-neon-cyan)]/30 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-[var(--color-neon-pink)]">{log.action}</p>
                                        <p className="text-sm text-white/80">{log.details}</p>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-bold">
                                        {new Date(log.timestamp).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Calendar Link */}
                <section className="glass-card p-8 text-center space-y-4">
                    <h2 className="text-2xl font-black uppercase italic neon-text-pink">Gestión de Citas</h2>
                    <p className="text-white/60">Administra el calendario de citas con tus clientes</p>
                    <Link href="/promoter/calendario" className="cyber-button inline-block">
                        Ir al Calendario →
                    </Link>
                </section>
            </div>
        </div>
    );
}