'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItemType = 'product' | 'pack';

export interface CartItem {
    id: string;
    type: CartItemType;
    name: string;
    priceUSD: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalUSD: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        let isMounted = true;
        let parsed = null;
        const savedCart = localStorage.getItem('ks-cart');
        if (savedCart) {
            try {
                parsed = JSON.parse(savedCart);
            } catch (e) {
                console.error('Error loading cart', e);
            }
        }
        if (isMounted && parsed) {
            setCart(parsed);
        }
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        localStorage.setItem('ks-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                return prev.map(item =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const totalUSD = cart.reduce((total, item) => total + (item.priceUSD * item.quantity), 0);
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalUSD,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
