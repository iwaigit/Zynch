'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { registrationSchema } from '@/lib/validators';
import { translateError } from '@/lib/errorMessages';

export type FormMode = 'register' | 'login' | 'forgot';

interface RegisterFormProps {
    initialMode?: FormMode;
    onClose?: () => void;
}

export default function RegisterForm({ initialMode = 'register', onClose }: RegisterFormProps) {
    const { name } = useSiteConfig();
    const initials = name.split(' ').map(n => n[0]).join('');
    const { login: authLogin } = useAuth();
    const registerMutation = useMutation(api.users.register);
    const loginMutation = useMutation(api.users.login);
    const [mode, setMode] = useState<FormMode>(initialMode);
    const [formData, setFormData] = useState({
        email: '',
        birthdate: '',
        phone: '+',
        password: initials,
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [loginData, setLoginData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            if (mode === 'forgot') {
                alert('Funcionalidad de recuperación en desarrollo. Contacta a soporte.');
                setStatus('idle');
                return;
            }

            if (mode === 'register') {
                // Validate with Zod
                const validation = registrationSchema.safeParse(formData);

                if (!validation.success) {
                    const firstError = validation.error.issues[0];
                    throw new Error(firstError.message);
                }

                // Use validated and transformed data
                const validatedData = validation.data;

                const userId = await registerMutation({
                    email: validatedData.email,
                    password: validatedData.password,
                    birthdate: validatedData.birthdate,
                    phone: validatedData.phone
                });

                authLogin({ id: userId, email: validatedData.email, role: 'client' });

                // Auto-redirect for new registrations
                setTimeout(() => {
                    window.location.href = '/perfil';
                }, 1500);
            } else {
                // Login
                const userData = await loginMutation({
                    email: formData.email,
                    password: formData.password
                });

                setLoginData(userData);
                authLogin(userData);

                // Auto-redirect based on role
                setTimeout(() => {
                    if (userData.role === 'admin') {
                        window.location.href = '/admin';
                    } else if (userData.role === 'promoter') {
                        window.location.href = '/promoter';
                    } else {
                        window.location.href = '/perfil';
                    }
                }, 1500);
            }

            localStorage.setItem('ks-age-verified', 'true');
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            // Translate technical errors to user-friendly messages
            const userMessage = translateError(err.message || 'Error desconocido');
            setErrorMsg(userMessage);
        }
    };

    // Error state display
    if (status === 'error') {
        return (
            <div className="glass-card p-10 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="text-6xl">⚠️</div>
                <h2 className="text-3xl font-black uppercase italic text-red-400">
                    Error en los Datos
                </h2>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-white/90 font-bold text-sm">
                        {errorMsg}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setStatus('idle');
                        setErrorMsg('');
                    }}
                    className="cyber-button w-full neon-border-cyan"
                >
                    ← Volver a Intentar
                </button>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="glass-card p-10 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="text-6xl">{mode === 'forgot' ? '📧' : '✨'}</div>
                <h2 className="text-3xl font-black uppercase italic neon-text-cyan">
                    {mode === 'forgot' ? 'Correo Enviado' : '¡Acceso Concedido!'}
                </h2>
                <p className="text-white/60 font-bold">
                    {mode === 'forgot'
                        ? 'Revisa tu bandeja de entrada para el código de recuperación.'
                        : `Bienvenido de nuevo al ecosistema premium de ${name}.`}
                </p>
                <button
                    onClick={() => {
                        if (mode === 'forgot') {
                            setMode('login');
                        } else {
                            // Redirect based on role
                            const userRole = loginData?.role || 'client';
                            if (userRole === 'admin') {
                                window.location.href = '/admin';
                            } else if (userRole === 'promoter') {
                                window.location.href = '/promoter';
                            } else {
                                window.location.href = '/perfil';
                            }
                        }
                    }}
                    className="cyber-button w-full neon-border-pink"
                >
                    {mode === 'forgot' ? 'Volver al Login' :
                        loginData?.role === 'admin' ? 'Ir al Dashboard Admin' :
                            loginData?.role === 'promoter' ? 'Ir al Dashboard Promotor' :
                                'Ir a Mi Perfil'}
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card p-8 md:p-12 w-full max-w-lg mx-auto relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-neon-pink)] opacity-50" />

            <div className="relative z-10 space-y-8">
                <header className="text-center space-y-2 relative">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute -top-2 -right-2 text-white/40 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    )}
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter neon-text-pink">
                        {mode === 'register' ? 'REGISTRO' : mode === 'login' ? 'LOGIN' : 'RECUPERAR'} <span className="text-white">VIP</span>
                    </h2>
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        {mode === 'register' ? 'Únete al universo exclusivo' : 'Accede a tu cuenta premium'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Profesional</label>
                        <input
                            type="email"
                            required
                            placeholder="tu@email.com"
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-lg font-bold outline-none focus:border-[var(--color-neon-cyan)] transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Nacimiento (18+)</label>
                                <input
                                    type="date"
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-lg font-bold text-xs outline-none focus:border-[var(--color-neon-pink)] transition-colors"
                                    value={formData.birthdate}
                                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">WhatsApp (Intl)</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+58..."
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-lg font-bold text-xs outline-none focus:border-[var(--color-neon-cyan)] transition-colors"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {mode !== 'forgot' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 flex justify-between">
                                <span>Clave ({initials} + 5 números)</span>
                                {mode === 'login' && (
                                    <button type="button" onClick={() => setMode('forgot')} className="text-ks-neon-cyan hover:underline hover:neon-text-cyan transition-all">¿Olvidaste tu clave?</button>
                                )}
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={7}
                                placeholder={`${initials}12345`}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-lg font-bold outline-none focus:border-[var(--color-neon-yellow)] tracking-widest"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value.toUpperCase() })}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="cyber-button w-full mt-4 flex items-center justify-center gap-3 group"
                    >
                        <span>
                            {status === 'loading' ? 'Procesando...' : mode === 'register' ? 'Obtener Acceso' : mode === 'login' ? 'Entrar' : 'Enviar Código'}
                        </span>
                        <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
                        {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === 'register' ? 'login' : 'register');
                                setStatus('idle');
                            }}
                            className="ml-2 text-ks-neon-pink hover:underline hover:neon-text-pink transition-all"
                        >
                            {mode === 'register' ? 'Inicia Sesión' : 'Regístrate aquí'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
