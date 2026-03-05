import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteConfig } from '@/hooks/useSiteConfig';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const { name, initials } = useSiteConfig();
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/admin', color: 'hover:text-[var(--color-neon-cyan)]' },
        { name: 'Marketing', href: '/admin/marketing', color: 'hover:text-[var(--color-neon-pink)]' },
        { name: 'Galería', href: '/admin/galeria', color: 'hover:text-[var(--color-neon-cyan)]' },
        { name: 'Pedidos', href: '/admin/pedidos', color: 'hover:text-[var(--color-neon-cyan)]' },
        { name: 'Clientes', href: '/admin/clientes', color: 'hover:text-[var(--color-neon-cyan)]' },
        { name: 'Packs VIP', href: '/admin/packs', color: 'hover:text-[var(--color-neon-yellow)]' },
        { name: 'Configuración', href: '/admin/config', color: 'hover:text-[var(--color-neon-pink)]' },
    ];

    return (
        <>
            {/* Mobile Open Button (Always visible when closed) */}
            <button
                onClick={() => setIsOpen(true)}
                className={`lg:hidden fixed top-6 left-6 z-40 p-3 glass-card border-white/10 hover:border-white/20 transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <div className="w-5 h-0.5 bg-white/40 mb-1" />
                <div className="w-3 h-0.5 bg-white/40 mb-1" />
                <div className="w-5 h-0.5 bg-white/40" />
            </button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:relative z-[50]
                h-screen w-64 lg:w-56
                bg-[var(--color-dark-bg)]
                border-r border-white/5 p-8
                flex flex-col
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                ${isOpen ? 'shadow-[10px_0_50px_rgba(0,0,0,0.5)]' : ''}
                lg:shrink-0
            `}>
                {/* Mobile Menu Header & Close Button */}
                <div className="lg:hidden flex justify-between items-center mb-6">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">Menu Performer</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/40 hover:text-white transition-colors text-xl font-light"
                    >
                        ×
                    </button>
                </div>

                <div className="hidden lg:block mb-8">
                    <Link href="/">
                        <img src="/zynch.png" alt="Zynch Logo" className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
                <h1 className="hidden lg:block text-xs font-black uppercase italic tracking-tighter neon-text-cyan mb-4">
                    {initials} <span className="text-white">ADMIN</span>
                </h1>
                <nav className="flex-1 flex flex-col gap-1 font-black uppercase text-[10px] tracking-widest text-white/40 overflow-y-auto custom-scrollbar pr-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`p-4 transition-all ${isActive
                                    ? 'bg-white/5 text-white border-l-2 border-[var(--color-neon-cyan)]'
                                    : `hover:bg-white/5 ${item.color}`
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                    <div className="mt-auto pt-4 pb-4">
                        <Link href="/" className="p-4 block text-white/20 hover:text-white transition-colors text-[9px]">
                            ← Volver al Sitio
                        </Link>
                    </div>
                </nav>
            </aside>
        </>
    );
}
