'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSiteConfig } from '@/hooks/useSiteConfig';

const PACKS = [
    {
        id: 'pack_1',
        nameES: 'Pack #1: Dulce Pecado 🍒',
        nameEN: 'Pack #1: Sweet Sin 🍒',
        price: 15,
        count: '10 fotos',
        descES: 'Una probadita del paraíso.',
        descEN: 'A little taste of paradise.',
        color: 'border-pink-500',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'pack_2',
        nameES: 'Pack #2: Cyber-Heat 🔥',
        nameEN: 'Pack #2: Cyber-Heat 🔥',
        price: 30,
        count: '25 fotos',
        descES: 'Sube la temperatura del sistema.',
        descEN: 'Turn up the system temperature.',
        color: 'border-cyan-500',
        image: 'https://images.unsplash.com/photo-1529139513477-323c66b6929b?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'pack_3',
        nameES: 'Pack #3: Spice-Overload 🌶️',
        nameEN: 'Pack #3: Spice-Overload 🌶️',
        price: 50,
        count: '50 fotos + Video',
        descES: 'Acceso total y sin restricciones.',
        descEN: 'Full access without restrictions.',
        color: 'border-yellow-500',
        image: 'https://images.unsplash.com/photo-1539109132314-34755249ff95?q=80&w=400&auto=format&fit=crop'
    },
];

export default function Gallery() {
    const { name } = useSiteConfig();
    const { t, language } = useLanguage();
    const { addToCart, cart } = useCart();

    const photos = useQuery(api.gallery.listPhotos);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-16 pb-20 select-none" onContextMenu={handleContextMenu}>
            {/* Header */}
            <header className="space-y-1">
                <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter neon-text-pink leading-none">
                    {t('gallery.title')} <br /> <span className="text-white opacity-20">{t('gallery.subtitle')}</span>
                </h2>
                <div className="h-0.5 w-16 bg-[var(--color-neon-pink)] shadow-[0_0_10px_var(--color-neon-pink)]" />
            </header>

            {/* Packs Selection System */}
            <section className="grid md:grid-cols-3 gap-6">
                {PACKS.map(pack => (
                    <div key={pack.id} className={`glass-card p-8 border-t-4 ${pack.color} space-y-6 group hover:translate-y-[-4px] transition-all`}>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">{language === 'es' ? 'Colección Exclusiva' : 'Exclusive Collection'}</p>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">{language === 'es' ? pack.nameES : pack.nameEN}</h3>
                        </div>

                        <div className="space-y-2">
                            <p className="text-2xl font-black neon-text-yellow">${pack.price} USD</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/50">{pack.count} | {language === 'es' ? pack.descES : pack.descEN}</p>
                        </div>

                        <button
                            onClick={() => addToCart({
                                id: String(pack.id),
                                type: 'pack',
                                name: language === 'es' ? pack.nameES : pack.nameEN,
                                priceUSD: pack.price,
                                image: pack.image
                            })}
                            className={`
                                glass-card w-full py-4 border ${pack.color.replace('border-', 'border-[#').replace('-500', ']')}
                                hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
                                hover:-translate-y-1 active:scale-95 transition-all duration-300
                                text-[10px] uppercase font-black tracking-widest text-white
                            `}
                        >
                            {cart.find(item => item.id === String(pack.id)) ? `${t('cart.add')} (${cart.find(item => item.id === String(pack.id))?.quantity})` : (language === 'es' ? 'ADQUIRIR ACCESO ⚡' : 'BUY ACCESS ⚡')}
                        </button>
                    </div>
                ))}
            </section>

            {/* Advertencia de Contenido */}
            <div className="glass-card bg-yellow-500/5 border border-yellow-500/30 p-4 rounded-lg">
                <div className="flex items-center gap-3 justify-center text-center">
                    <span className="text-xl text-yellow-500 font-black">!</span>
                    <p className="text-[10px] md:text-xs text-white/70 font-bold">
                        {language === 'es'
                            ? `Contenido explícito para mayores de 18 años. Distribución no autorizada prohibida. © ${name}.fun`
                            : `Explicit content for ages 18+. Unauthorized distribution prohibited. © ${name}.fun`
                        }
                    </p>
                </div>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {photos?.map((img, idx) => (
                    <div
                        key={img._id}
                        onClick={() => setSelectedImage(img)}
                        className="group relative glass-card p-1 border-white/5 hover:border-[var(--color-neon-pink)] transition-all cursor-pointer overflow-hidden aspect-[3/4]"
                    >
                        <div className="absolute inset-0 z-10 bg-transparent" />

                        <img
                            src={img.url || ''}
                            alt={img.alt}
                            className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500 blur-[1px] group-hover:blur-0"
                            draggable={false}
                        />

                        <div className="absolute bottom-1.5 left-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[6px] font-black uppercase tracking-widest bg-black/80 px-1 py-0.5 border-l border-[var(--color-neon-pink)]">Look_{idx + 1}</span>
                        </div>
                    </div>
                ))}

                {!photos && [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-lg border border-white/10" />
                ))}

                {photos && photos.length === 0 && (
                    <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
                        <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em]">Próximamente contenido exclusivo...</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-2xl w-full glass-card p-1 border-[var(--color-neon-pink)]/30 group" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedImage(null)} className="absolute -top-10 right-0 text-white/50 hover:text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                            {language === 'es' ? 'Cerrar' : 'Close'} <span className="text-xl">×</span>
                        </button>

                        <div className="relative aspect-video md:aspect-[4/5] overflow-hidden rounded-lg border border-white/10">
                            <div className="absolute inset-0 z-30" />

                            <img
                                src={selectedImage.url || ''}
                                alt={selectedImage.alt}
                                className="w-full h-full object-cover select-none"
                                draggable={false}
                                onContextMenu={e => e.preventDefault()}
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black via-black/40 to-transparent flex justify-between items-end z-40">
                                <div className="space-y-0.5">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter neon-text-pink">{selectedImage.alt}</h3>
                                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.3em]">© {name} Fun - No Redistribution</p>
                                </div>
                                <button
                                    onClick={() => addToCart({
                                        id: `hd_${selectedImage._id}`,
                                        type: 'product',
                                        name: `HD Unlock: ${selectedImage.alt}`,
                                        priceUSD: 10,
                                        image: selectedImage.url || ''
                                    })}
                                    className={`
                                        glass-card border border-[var(--color-neon-pink)]
                                        hover:shadow-[0_0_15px_rgba(255,45,117,0.4)]
                                        hover:-translate-y-1 active:scale-95 transition-all duration-300
                                        text-[9px] px-4 py-2 text-white font-black uppercase tracking-widest
                                    `}
                                >
                                    {cart.find(item => item.id === `hd_${selectedImage._id}`) ? `${t('cart.add')} (${cart.find(item => item.id === `hd_${selectedImage._id}`)?.quantity})` : t('gallery.buy_hd')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}