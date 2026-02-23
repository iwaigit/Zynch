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
    ];

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden bg-[#1a1a25] border-b border-white/5 p-3 flex justify-between items-center sticky top-0 z-50 h-14">
                <div className="flex items-center gap-2">
                    <h1 className="lg:block hidden text-lg font-black uppercase italic tracking-tighter neon-text-cyan leading-none">
                        {initials} <span className="text-white">ADMIN</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Menu"
                >
                    <div className="w-6 h-4 flex flex-col justify-between relative">
                        <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`} />
                        <span className={`w-full h-0.5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </div>
                </button>
            </header>

            {/* Overlay Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 w-56 bg-[#1a1a25] border-r border-white/5 p-6 flex flex-col gap-4 text-white h-screen z-[70] transition-transform duration-300 lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isOpen ? 'shadow-[10px_0_50px_rgba(0,0,0,0.5)]' : ''}
                lg:shrink-0
            `}>
                <h1 className="hidden lg:block text-2xl font-black uppercase italic tracking-tighter neon-text-cyan mb-4">
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
