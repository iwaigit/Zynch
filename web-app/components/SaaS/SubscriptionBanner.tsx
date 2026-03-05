'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useTenant } from '@/hooks/useTenant';

/**
 * Banner informativo que avisa al inquilino cuántos días le quedan de prueba.
 * Solo se muestra si el plan es "free".
 */
export default function SubscriptionBanner() {
    const { siteConfig, isLoading: tenantLoading } = useTenant();

    const status = useQuery(
        api.tenants.getSubscriptionStatus,
        siteConfig?.tenantId ? { tenantId: siteConfig.tenantId } : 'skip'
    );

    if (tenantLoading || !status || status.planType !== 'free') {
        return null;
    }

    const { daysRemaining, isExpired } = status;

    return (
        <div className={`w-full py-2 px-4 transition-all duration-300 text-center font-medium shadow-lg ${isExpired ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
            }`}>
            <div className="container mx-auto flex items-center justify-center gap-2 text-sm sm:text-base">
                <span className="animate-pulse">⚠️</span>
                {isExpired ? (
                    <span><b>Tu periodo de prueba ha expirado.</b> Tu sitio ya no es visible públicamente.</span>
                ) : (
                    <span>
                        <b>Atención:</b> Te quedan <b>{daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}</b> de tu prueba gratuita.
                        <a href="/admin/billing" className="ml-2 underline hover:text-white/80 transition-colors">
                            Pásate a Pro ahora
                        </a>
                    </span>
                )}
            </div>
        </div>
    );
}
