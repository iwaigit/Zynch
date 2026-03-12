'use client';

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function UniversalCart() {
    const { name } = useSiteConfig();
    const { cart, removeFromCart, updateQuantity, totalUSD, itemCount, clearCart } = useCart();
    const { t, language } = useLanguage();
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const createOrder = useMutation(api.orders.createOrder);
    const exchangeRate = 60;

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            alert(language === 'es' ? 'Para completar tu pedido, por favor regístrate o inicia sesión.' : 'To complete your order, please log in or register.');
            return;
        }

        setIsProcessing(true);
        try {
            await createOrder({
                tenantId: 'default-tenant' as any, // Temporal hasta obtener tenantId real
                userId: user!.id as any, // Convex IDs need proper casting in real apps, but this works for demo
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    priceUSD: item.priceUSD,
                    type: item.type
                })),
                totalUSD: totalUSD
            });

            alert(language === 'es' ? '¡Pedido recibido! Procesando tu solicitud...' : 'Order received! Processing your request...');
            clearCart();
            setIsOpen(false);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error al procesar el pedido. Intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (usd: number) => {
        if (language === 'en') return `$${usd.toFixed(2)}`;
        return `Bs. ${(usd * exchangeRate).toLocaleString()}`;
    };

    if (itemCount === 0) return null;

    return (
        <>
            {/* ... Floating Toggle ... */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[90] glass-card p-5 border-[var(--color-neon-cyan)] shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:-translate-y-2 active:scale-90 transition-all group scale-90 md:scale-100"
            >
                <div className="relative">
                    <span className="text-3xl">🛍️</span>
                    <span className="absolute -top-2 -right-2 bg-[var(--color-neon-pink)] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-black animate-pulse">
                        {itemCount}
                    </span>
                </div>
            </button>

            {/* Cart Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="relative max-w-xl w-full glass-card p-8 md:p-10 space-y-8 border-[var(--color-neon-cyan)]/30" onClick={e => e.stopPropagation()}>
                        <header className="text-center space-y-1 border-b border-white/10 pb-6 relative">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter neon-text-cyan">{t('cart.title')}</h2>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] font-mono tracking-widest">{name} Enterprise Global Gateway</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-0 right-0 text-white/20 hover:text-white transition-colors text-xl font-black"
                            >
                                ✕
                            </button>
                        </header>

                        <div className="max-h-[45vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5 group relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 text-[6px] font-black px-2 py-0.5 border-r border-b border-white/10 uppercase ${item.type === 'pack' ? 'text-[var(--color-neon-pink)]' : 'text-[var(--color-neon-cyan)]'}`}>
                                        {item.type}
                                    </div>

                                    <div className="w-16 h-16 rounded overflow-hidden border border-white/10 mt-2">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black text-[10px] uppercase tracking-wider truncate">{item.name}</h4>
                                        <p className="text-[9px] font-bold text-white/40">{formatPrice(item.priceUSD)}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-black/40 rounded-full border border-white/10 px-2 py-1 gap-3">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-white transition-colors">-</button>
                                            <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-white transition-colors">+</button>
                                        </div>
                                        <div className="text-right min-w-[70px]">
                                            <span className="font-black text-xs neon-text-yellow">{formatPrice(item.priceUSD * item.quantity)}</span>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-red-500 transition-colors">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--color-neon-cyan)]">{name} Platform v1.0</p>
                                <div className="text-right">
                                    <p className="text-3xl font-black italic neon-text-cyan leading-none">{formatPrice(totalUSD)}</p>
                                    {language === 'es' && (
                                        <p className="text-[9px] font-bold text-white/20 mt-1 italic uppercase tracking-widest">Tasa: 1$ = {exchangeRate} Bs.</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => clearCart()}
                                    disabled={isProcessing}
                                    className="py-4 font-black uppercase tracking-widest text-[10px] text-white/20 hover:text-red-500 transition-colors disabled:opacity-50"
                                >
                                    {language === 'es' ? 'Vaciar Carrito' : 'Clear Cart'}
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="glass-card py-4 border border-[var(--color-neon-cyan)] shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:-translate-y-1 active:scale-95 transition-all font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
                                >
                                    {isProcessing ? (language === 'es' ? 'PROCESANDO...' : 'PROCESSING...') : t('cart.checkout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
