'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function PedidosAdmin() {
    const { name, initials } = useSiteConfig();
    const orders = useQuery(api.orders.listAll);

    return (
        <div className="min-h-screen bg-[#0d0d12] text-white flex">

            <main className="flex-1 p-8 md:p-12 space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter">Gestión de <span className="neon-text-cyan">Pedidos</span></h2>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Panel de Control de Ventas y CRM</p>
                    </div>
                </header>

                <div className="glass-card bg-[#1a1a25]/80 border-white/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Fecha</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Cliente</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Items</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Total</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Estado</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-white/40">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((order) => (
                                <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 text-xs font-mono text-white/60">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-black text-white uppercase italic">{initials}-{order._id.toString().slice(-4)}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            {order.items.map((item: any, i: number) => (
                                                <div key={i} className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">
                                                    • {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs font-black text-[var(--color-neon-cyan)]">${order.totalUSD}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/40'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-[10px] font-black uppercase italic text-white/20 hover:text-[var(--color-neon-pink)] transition-colors">
                                            Detalles →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!orders && (
                        <div className="p-12 text-center text-white/20 font-black uppercase italic tracking-widest animate-pulse">
                            Cargando Registro de Ventas...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
