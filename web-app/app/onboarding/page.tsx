'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

/**
 * Proceso de Onboarding de Zynch (Flujo de dos pasos)
 * 1. Validación de Correo con OTP
 * 2. Creación de Negocio (Tenant)
 */
export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [slug, setSlug] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateOtp = useMutation(api.otp.generateCode);
    const registerTenant = useMutation(api.tenants.registerTenant);
    const router = useRouter();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await generateOtp({ email });
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Error al enviar el código.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const result = await registerTenant({
                email,
                code,
                tenantName,
                slug: slug.toLowerCase().trim(),
                password,
                phone,
            });

            if (result.success) {
                // Redirigir al login del nuevo tenant
                router.push(`/admin/login?tenant=${slug}`);
            }
        } catch (err: any) {
            setError(err.message || 'Error en el registro. Verifica el código y los datos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d12] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                <header className="text-center mb-8">
                    <div className="inline-block p-4 bg-pink-500/10 rounded-2xl mb-4">
                        <span className="text-3xl">🦎</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Únete a Zynch</h1>
                    <p className="text-zinc-500 text-sm mt-2">
                        {step === 1 ? 'Tu negocio camaleónico empieza aquí.' : 'Configura los detalles de tu negocio.'}
                    </p>
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div>
                            <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-2 font-medium">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-pink-500 transition-colors outline-none"
                                placeholder="tu@negocio.com"
                            />
                        </div>
                        <button
                            disabled={isLoading}
                            className="w-full bg-pink-600 hover:bg-pink-500 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Enviando...' : 'Obtener Acceso →'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1 font-medium">Código de Validación</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-xl font-mono tracking-widest focus:border-cyan-500 transition-colors outline-none"
                                    placeholder="000000"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1 font-medium">Nombre de tu Negocio</label>
                                <input
                                    type="text"
                                    required
                                    value={tenantName}
                                    onChange={(e) => setTenantName(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    placeholder="Ej: Pink Studio"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1 font-medium">Nombre de Usuario (Slug)</label>
                                <input
                                    type="text"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    placeholder="ej: pink-studio"
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1 font-medium">WhatsApp / Teléfono</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    placeholder="+58 412..."
                                />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-xs uppercase tracking-widest mb-1 font-medium">Contraseña (Mínimo 5 números)</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                                    placeholder="Ej: AB12345"
                                />
                            </div>
                        </div>
                        <button
                            disabled={isLoading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Creando...' : 'Comenzar Prueba de 15 Días 🦎'}
                        </button>
                    </form>
                )}

                <footer className="mt-8 text-center text-zinc-600 text-[10px] uppercase tracking-tighter">
                    Powered by Zynch.app — Tu identidad, tus reglas.
                </footer>
            </div>
        </div>
    );
}
