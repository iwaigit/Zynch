'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function AdminSidebar() {
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
        <aside className="w-64 bg-[#1a1a25] border-r border-white/5 p-6 flex flex-col gap-8 text-white h-screen sticky top-0 shrink-0">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter neon-text-cyan">
                {initials} <span className="text-white">ADMIN</span>
            </h1>
            <nav className="flex flex-col gap-1 font-black uppercase text-[10px] tracking-widest text-white/40">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`p-4 transition-all ${isActive
                                ? 'bg-white/5 text-white border-l-2 border-[var(--color-neon-cyan)]'
                                : `hover:bg-white/5 ${item.color}`
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
                <div className="mt-auto pt-10">
                    <Link href="/" className="p-4 block text-white/20 hover:text-white transition-colors text-[9px]">
                        ← Volver al Sitio
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
