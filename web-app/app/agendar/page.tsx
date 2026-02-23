'use client';

import { useEffect, useState } from 'react';
import AppointmentSystem from '@/components/AppointmentSystem';
import Link from 'next/link';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function AgendarPage() {
    const { name } = useSiteConfig();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#0d0d12] text-white p-6 md:p-12 selection:bg-[#ff2d75] relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 cyber-grid opacity-10" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-neon-cyan)]/20 to-transparent" />
            </div>

            {/* Navigation */}
            <nav className="max-w-6xl mx-auto mb-20 flex justify-between items-center relative z-10">
                <Link href="/" className="font-black uppercase tracking-widest text-[var(--color-neon-cyan)] hover:neon-text-cyan transition-all group flex items-center gap-2">
                    <span className="group-hover:-translate-x-2 transition-transform">←</span> Volver
                </Link>
                <div className="flex gap-4 items-center">
                    <div className="h-[2px] w-12 bg-[var(--color-neon-pink)] hidden md:block" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">{name.replace(' ', '_').toUpperCase()}_BOOKING_SYSTEM</span>
                </div>
            </nav>

            <section className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <AppointmentSystem />
            </section>

            {/* Aesthetic Footer Decor */}
            <div className="max-w-6xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 opacity-30">
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-[var(--color-neon-cyan)] rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    ))}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.6em]">Premium Content Creator Ecosystem</p>
            </div>
        </main>
    );
}
