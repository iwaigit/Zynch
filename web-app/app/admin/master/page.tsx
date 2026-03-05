'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Panel Maestro de Zynch (SaaS Admin)
 * Permite gestionar inquilinos, suscripciones y leads.
 */
export default function MasterDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Redirigir si no es admin maestro
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/admin');
        }
    }, [user, authLoading, router]);

    const tenants = useQuery(
        api.tenants.listAll,
        user?.id ? { masterAdminId: user.id as any } : 'skip'
    );

    if (authLoading || !tenants) {
        return (
            <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0d12] text-zinc-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Panel Maestro Zynch
                        </h1>
                        <p className="text-zinc-500 mt-1">Gestión global de Inquilinos y SaaS</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm transition-colors">
                            Configuración SaaS
                        </button>
                        <button className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-pink-500/20">
                            Nuevo Inquilino
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Inquilinos Totales" value={tenants.length} color="text-pink-500" />
                    <StatCard title="Pruebas Activas" value={tenants.filter(t => t.status === 'trial').length} color="text-yellow-500" />
                    <StatCard title="Suscripciones Pro" value={tenants.filter(t => t.planType === 'pro').length} color="text-cyan-500" />
                </div>

                <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Inquilino / Slug</th>
                                    <th className="px-6 py-4 font-medium">Plan</th>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 font-medium">Vencimiento</th>
                                    <th className="px-6 py-4 font-medium">Contacto (n8n Ready)</th>
                                    <th className="px-6 py-4 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tenants.map((tenant) => (
                                    <tr key={tenant._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{tenant.name}</div>
                                            <div className="text-zinc-500 text-xs font-mono">{tenant.slug}.zynch.app</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${tenant.planType === 'pro' ? 'bg-cyan-500/20 text-cyan-400' :
                                                tenant.planType === 'elite' ? 'bg-purple-500/20 text-purple-400' :
                                                    'bg-zinc-500/20 text-zinc-400'
                                                }`}>
                                                {tenant.planType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${tenant.status === 'active' ? 'bg-green-500' :
                                                    tenant.status === 'trial' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`} />
                                                <span className="capitalize text-zinc-300">{tenant.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400 text-sm">
                                            {tenant.trialEndsAt ? new Date(tenant.trialEndsAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-zinc-300">{tenant.ownerEmail}</div>
                                            <div className="text-xs text-pink-500 font-mono mt-1">{tenant.ownerPhone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-zinc-800 hover:bg-pink-600 rounded-lg text-zinc-300 hover:text-white transition-all">
                                                    ⚙️
                                                </button>
                                                <button className="p-2 bg-zinc-800 hover:bg-cyan-600 rounded-lg text-zinc-300 hover:text-white transition-all">
                                                    💬
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
    return (
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h3 className="text-zinc-500 text-sm font-medium">{title}</h3>
            <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );
}
