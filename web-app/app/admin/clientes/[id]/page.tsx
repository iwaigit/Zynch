'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function FichaClienteAdmin() {
    const { tenantId } = useSiteConfig();
    const params = useParams();
    const userId = params.id as string;
    const clientData = useQuery(api.crm.getClientDetails,
        tenantId ? { tenantId, userId: userId as Id<"users"> } : "skip"
    );
    const updateUserRole = useMutation(api.crm.updateUserRole);

    const [role, setRole] = useState("");
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (clientData?.user) {
            setRole(clientData.user.role || 'client');
            setPermissions(clientData.user.permissions || []);
        }
    }, [clientData]);

    const handleSaveRole = async () => {
        if (!clientData || !tenantId) return;
        await updateUserRole({
            tenantId,
            userId: clientData.user._id as Id<"users">,
            role,
            permissions
        });
        setIsEditing(false);
    };

    const togglePermission = (perm: string) => {
        if (permissions.includes(perm)) {
            setPermissions(permissions.filter(p => p !== perm));
        } else {
            setPermissions([...permissions, perm]);
        }
    };

    if (!clientData) {
        return (
            <main className="flex-1 p-12 text-center animate-pulse uppercase font-black text-white/20 tracking-widest">
                Cargando Ficha del Cliente...
            </main>
        );
    }

    const { user, orders, appointments, logs, access } = clientData;

    return (
        <main className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none whitespace-nowrap">Ficha: <span className="neon-text-pink">{user.email.split('@')[0]}</span></h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">ID: {user._id.toString()} | Miembro desde: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Perfil y Datos */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Gestión de Roles (Admin Only) */}
                    <section className="glass-card bg-[#1a1a25]/60 p-6 border-white/5 space-y-4 border-l-4 border-[var(--color-neon-pink)]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <h3 className="text-[10px] font-black uppercase text-[var(--color-neon-pink)] tracking-widest">Nivel de Acceso</h3>
                            <button
                                onClick={() => isEditing ? handleSaveRole() : setIsEditing(true)}
                                className="text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors text-white/40"
                            >
                                {isEditing ? '💾 Guardar' : '✏️ Editar'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-bold text-white/20 uppercase mb-2">Rol del Usuario</p>
                                {isEditing ? (
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-xs font-bold text-white uppercase outline-none focus:border-[var(--color-neon-pink)]"
                                    >
                                        <option value="client">Cliente Standard</option>
                                        <option value="vip">Cliente VIP 💎</option>
                                        <option value="promoter">Promotora (Staff)</option>
                                        <option value="admin">Administrador Total</option>
                                    </select>
                                ) : (
                                    <div className={`text-xs font-black uppercase tracking-widest px-3 py-2 rounded border border-white/5 ${role === 'admin' ? 'bg-red-500/20 text-red-500' :
                                        role === 'promoter' ? 'bg-[var(--color-neon-pink)]/20 text-[var(--color-neon-pink)]' :
                                            role === 'vip' ? 'bg-[var(--color-neon-yellow)]/20 text-[var(--color-neon-yellow)]' :
                                                'bg-white/5 text-white/60'
                                        }`}>
                                        {role === 'admin' ? '🛡️ Administrador' :
                                            role === 'promoter' ? '💃 Promotora' :
                                                role === 'vip' ? '💎 VIP Member' : '👤 Cliente'}
                                    </div>
                                )}
                            </div>

                            {/* Permisos para Promotoras */}
                            {(role === 'promoter' || role === 'admin') && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <p className="text-[9px] font-bold text-white/20 uppercase mb-2">Permisos Especiales</p>
                                    <div className="space-y-2 bg-black/20 p-3 rounded">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                disabled={!isEditing}
                                                checked={permissions.includes('dashboard_editor')}
                                                onChange={() => togglePermission('dashboard_editor')}
                                                className="accent-[var(--color-neon-cyan)]"
                                            />
                                            <span className="text-[10px] font-bold uppercase text-white/60 group-hover:text-white transition-colors">Editor de Dashboard</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                disabled={!isEditing}
                                                checked={permissions.includes('grant_vip')}
                                                onChange={() => togglePermission('grant_vip')}
                                                className="accent-[var(--color-neon-cyan)]"
                                            />
                                            <span className="text-[10px] font-bold uppercase text-white/60 group-hover:text-white transition-colors">Otorgar VIP a Usuarios</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="glass-card bg-[#1a1a25]/60 p-6 border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest border-b border-white/5 pb-2">Información de Contacto</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[9px] font-bold text-white/20 uppercase">Email</p>
                                <p className="text-xs">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-white/20 uppercase">Teléfono / WhatsApp</p>
                                <p className="text-xs font-mono">{user.phone || 'No registrado'}</p>
                                {user.whatsappVerified && <span className="text-[8px] text-green-500 font-black uppercase">Verificado</span>}
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-white/20 uppercase">Fecha de Nacimiento</p>
                                <p className="text-xs">{user.birthdate}</p>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card bg-[#1a1a25]/60 p-6 border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-[var(--color-neon-cyan)] tracking-widest border-b border-white/5 pb-2">Acceso a Packs VIP</h3>
                        <div className="space-y-2">
                            {access.length > 0 ? access.map((a: any) => (
                                <div key={a._id} className="text-[10px] font-black uppercase italic text-white/80">
                                    ⚡ {a.packId.replace('pack-', '').toUpperCase()}
                                </div>
                            )) : (
                                <p className="text-[10px] text-white/20 uppercase font-black italic">Sin accesos digitales</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Historial y Actividad */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pedidos */}
                    <section className="glass-card bg-[#1a1a25]/60 p-6 border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest border-b border-white/5 pb-2">Historial de Pedidos ({orders.length})</h3>
                        <div className="space-y-2">
                            {orders.map((order: any) => (
                                <div key={order._id} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded">
                                    <div className="text-[10px] font-bold">
                                        {new Date(order.createdAt).toLocaleDateString()} - ${order.totalUSD}
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 text-white/40">
                                        {order.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Logs */}
                    <section className="glass-card bg-[#1a1a25]/60 p-6 border-white/5 space-y-4">
                        <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest border-b border-white/5 pb-2">Registro de Actividad (CRM Logs)</h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {logs.map((log: any) => (
                                <div key={log._id} className="text-[10px] border-l border-white/10 pl-4 py-2 space-y-1 hover:border-[var(--color-neon-pink)] transition-colors">
                                    <p className="text-white/30 font-mono text-[8px]">{new Date(log.timestamp).toLocaleString()}</p>
                                    <p className="font-bold text-white/80 uppercase">{log.action.replace(/_/g, ' ')}</p>
                                    <p className="text-white/40 italic">{log.details}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
