'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { processImage } from '@/lib/image';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { imageSchema } from '@/lib/validators';

export default function GaleriaAdmin() {
    const { tenantId, name, initials } = useSiteConfig();
    const photos = useQuery(api.gallery.listPhotos, { tenantId });
    const generateUploadUrl = useMutation(api.gallery.generateUploadUrl);
    const savePhoto = useMutation(api.gallery.savePhoto);
    const deletePhoto = useMutation(api.gallery.deletePhoto);

    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !tenantId) return;

        // 1. Zod Validation
        const validation = imageSchema.safeParse({ size: file.size, type: file.type });
        if (!validation.success) {
            alert(validation.error.issues[0]?.message || "Error de validación");
            return;
        }

        if ((photos?.length || 0) >= 24) {
            alert("Has alcanzado el límite de 2 docenas (24 fotos) en la galería.");
            return;
        }

        setIsUploading(true);
        try {
            // 2. Generar Nombre Secuencial (InitialsF_01, InitialsF_02...)
            const nextOrder = (photos?.length || 0) + 1;
            const sequentialName = `${initials}F_${String(nextOrder).padStart(2, '0')}`;

            // 3. Procesar Imagen (Resize + Watermark + Rename + Compress)
            const processedFile = await processImage(file, sequentialName, name);

            const postUrl = await generateUploadUrl({ tenantId: 'default-tenant' as any });
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": processedFile.type },
                body: processedFile,
            });
            const { storageId } = await result.json();

            await savePhoto({
                tenantId,
                storageId: storageId as Id<"_storage">,
                alt: sequentialName,
                order: nextOrder,
            });

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error al subir la imagen.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: Id<"gallery">) => {
        if (confirm('¿Estás seguro de eliminar esta foto?')) {
            if (!tenantId) return;
            await deletePhoto({ id, tenantId });
        }
    };

    return (
        <main className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight leading-none whitespace-nowrap">Gestión de <span className="neon-text-pink">Galería</span></h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Contenido Visual en Convex Storage ({photos?.length || 0}/24)</p>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || (photos?.length || 0) >= 24}
                        className={`px-8 py-4 font-black uppercase text-xs tracking-widest transition-all shadow-pop ${isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-[var(--color-neon-cyan)]'
                            }`}
                    >
                        {isUploading ? 'Subiendo...' : '+ Subir Nueva Foto'}
                    </button>
                </div>
            </header>

            {/* Advertencia de Contenido Explícito */}
            <div className="glass-card bg-red-500/5 border border-red-500/20 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                    <span className="text-2xl">⚠️</span>
                    <div className="space-y-2">
                        <h3 className="text-sm font-black uppercase tracking-widest text-red-400">Advertencia de Contenido</h3>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Esta galería contiene material de carácter explícito sexual destinado exclusivamente para mayores de 18 años.
                            Al gestionar y publicar este contenido, usted confirma su responsabilidad legal y acepta que todo el material cumple
                            con las regulaciones aplicables. La distribución no autorizada está estrictamente prohibida.
                        </p>
                    </div>
                </div>
            </div>

            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos?.map((img) => (
                    <div key={img._id} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-sm group-hover:from-[var(--color-neon-cyan)]/20 transition-all duration-500" />

                        <div
                            onClick={() => setSelectedImage(img)}
                            className="relative glass-card bg-[#1a1a25]/80 border-white/10 overflow-hidden group-hover:border-[var(--color-neon-cyan)]/30 transition-all cursor-pointer"
                        >
                            <div className="aspect-[3/4] overflow-hidden relative border-b border-white/5">
                                <img
                                    src={img.url || ''}
                                    alt={img.alt}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(img._id); }}
                                        className="w-12 h-12 rounded-full bg-black border border-white/20 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all"
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Ver Grande</span>
                                </div>
                            </div>
                            <div className="p-3 flex justify-between items-center bg-black/40">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white truncate max-w-[100px]">{img.alt}</p>
                                    <p className="text-[7px] text-white/20 uppercase font-bold tracking-tighter">#{img.order}</p>
                                </div>
                                <div className="text-[8px] font-black italic text-[var(--color-neon-cyan)]">LIVE</div>
                            </div>
                        </div>
                    </div>
                ))}

                {!photos && [1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-2xl border border-white/10" />
                ))}

                {photos && photos.length < 24 && (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative border-2 border-dashed border-white/5 rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-4 hover:border-[var(--color-neon-cyan)]/30 transition-all bg-white/[0.02] hover:bg-white/[0.04]"
                    >
                        <span className="text-4xl text-white/20 group-hover:text-[var(--color-neon-cyan)] transition-colors">+</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-colors">Añadir</span>
                    </button>
                )}
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full h-full max-h-[90vh] flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all">
                            ✕
                        </button>
                        <img
                            src={selectedImage.url || ''}
                            alt={selectedImage.alt}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/10"
                        />
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <span className="glass-card px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white">
                                {selectedImage.alt}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}