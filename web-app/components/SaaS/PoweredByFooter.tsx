'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useTenant } from '@/hooks/useTenant';

/**
 * Footer obligatorio para el plan gratuito.
 * Muestra el branding de "Powered by Zynch.app".
 */
export default function PoweredByFooter() {
    const { siteConfig, isLoading: tenantLoading } = useTenant();

    const status = useQuery(
        api.tenants.getSubscriptionStatus,
        siteConfig?.tenantId ? { tenantId: siteConfig.tenantId } : 'skip'
    );

    // En una versión más avanzada, los planes Pro/Elite podrían ocultar esto.
    // Por ahora, lo mostramos según el requerimiento del usuario.
    const isFree = status?.planType === 'free';
    const performerName = siteConfig?.performerName || 'Este usuario';

    return (
        <footer className="w-full py-6 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md">
            <div className="container mx-auto px-4 text-center">
                <p className="text-zinc-500 text-xs sm:text-sm tracking-widest uppercase">
                    {isFree ? (
                        <>
                            {performerName} is powered by{' '}
                            <a
                                href="https://zynch.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-500 hover:text-pink-400 transition-colors font-bold"
                            >
                                Zynch.app
                            </a>
                        </>
                    ) : (
                        `© 2026 ${performerName} — Powered by Zynch.app`
                    )}
                </p>
            </div>
        </footer>
    );
}
