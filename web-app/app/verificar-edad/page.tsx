'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function VerificarEdad() {
    const { name } = useSiteConfig();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0d0d12] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 cyber-grid opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff2d75]/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                {/* Branding */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter neon-text-pink leading-none">
                        SISTEMA <br />
                        <span className="text-white opacity-20">DE</span> REGISTRO
                    </h1>
                    <div className="inline-block px-4 py-1 glass-card border-[var(--color-neon-cyan)]/30">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--color-neon-cyan)]">{name} Fun v1.0</p>
                    </div>
                </div>

                {/* Main Action (The Form) */}
                <RegisterForm />

                {/* Helpful Links */}
                <footer className="text-center space-y-6 pt-8">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
                        Este es un espacio exclusivo para mayores de 18 años
                    </p>
                    <div>
                        <Link href="/" className="text-xs font-black uppercase tracking-widest text-[var(--color-neon-cyan)] hover:tracking-[0.5em] transition-all">
                            ← Volver al Menú Principal
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
}
