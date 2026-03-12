'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from 'next/link';
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function ClientesAdmin() {
    const { name } = useSiteConfig();
    const initials = name.split(' ').map(n => n[0]).join('');
    const clients = useQuery(api.crm.listClients, { tenantId: 'default-tenant' as any }); // Temporal

    return (
        <main className="flex-1 p-8 md:p-12 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none whitespace-nowrap">Base de <span className="neon-text-cyan">Clientes</span></h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">CRM - Gestión de Usuarios y Audiencia</p>
                </div>
            </header>

            <div className="glass-card bg-[#1a1a25]/80 border-white/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">ID / Perfil</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Email</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Teléfono</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">WhatsApp</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Registro</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients?.map((client) => (
                            <tr key={client._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <div className="text-xs font-black text-white uppercase italic">{initials}-{client._id.toString().slice(-4)}</div>
                                </td>
                                <td className="p-4 text-xs text-white/60">{client.email}</td>
                                <td className="p-4 text-xs font-mono text-white/40">{client.phone || 'N/A'}</td>
                                <td className="p-4">
                                    {client.whatsappVerified ? (
                                        <span className="text-green-500 text-[10px] font-black uppercase">✔ Verificado</span>
                                    ) : (
                                        <span className="text-white/20 text-[10px] font-black uppercase">Pendiente</span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-white/40">
                                    {new Date(client.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <Link
                                        href={`/admin/clientes/${client._id}`}
                                        className="text-[10px] font-black uppercase italic text-[var(--color-neon-cyan)] hover:text-white transition-colors"
                                    >
                                        Ver Ficha →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!clients && (
                    <div className="p-12 text-center text-white/20 font-black uppercase italic tracking-widest animate-pulse">
                        Cargando Base de Clientes...
                    </div>
                )}
            </div>
        </main>
    );
}
