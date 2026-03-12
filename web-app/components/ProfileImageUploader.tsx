'use client';

import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { processImage } from '@/lib/image';
import { imageSchema } from '@/lib/validators';
import { Id } from '@/convex/_generated/dataModel';

interface ProfileImageUploaderProps {
    /** Slot index: 0 = Foto Principal, 1 = Foto Secundaria */
    index: number;
    /** URL actual de la imagen (resuelta desde storage o URL externa) */
    currentUrl?: string;
    /** ID del inquilino (Convex ID) */
    tenantId?: Id<"tenants">;
    /** Nombre del performer para la watermark */
    performerName: string;
    /** Callback al terminar el upload exitosamente */
    onUploaded?: () => void;
}

/**
 * Componente de upload de foto de perfil con:
 * - Validación Zod (tipo y tamaño)
 * - Pipeline processImage (resize → watermark → WebP)
 * - Upload directo a Convex Storage
 * - Preview inmediato
 * - Botón de eliminar
 */
export default function ProfileImageUploader({
    index,
    currentUrl,
    tenantId,
    performerName,
    onUploaded,
}: ProfileImageUploaderProps) {
    const generateUploadUrl = useMutation(api.siteConfig.generateProfileImageUploadUrl);
    const saveImage = useMutation(api.siteConfig.saveProfileImage);
    const deleteImage = useMutation(api.siteConfig.deleteProfileImage);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setIsUploading(true);

        try {
            // 1. Validación Zod
            setProgress('Validando imagen...');
            const validation = imageSchema.safeParse({ size: file.size, type: file.type });
            if (!validation.success) {
                setError(validation.error.issues[0]?.message || 'Error de validación');
                return;
            }

            // 2. Preview inmediato (antes de procesar)
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // 3. Procesar (resize + watermark + WebP)
            setProgress('Procesando imagen...');
            const slotLabel = index === 0 ? 'PERFIL_01' : 'PERFIL_02';
            const processed = await processImage(file, slotLabel, performerName || 'Performer');

            // 4. Obtener URL de upload de Convex
            setProgress('Subiendo a Convex Storage...');
            const postUrl = await generateUploadUrl({ tenantId: tenantId! });
            const result = await fetch(postUrl, {
                method: 'POST',
                headers: { 'Content-Type': processed.type },
                body: processed,
            });

            if (!result.ok) throw new Error('Error al subir al servidor');

            const { storageId } = await result.json();

            // 5. Guardar storageId en siteConfig
            setProgress('Guardando...');
            if (!tenantId) throw new Error("ID de inquilino no disponible.");
            await saveImage({
                tenantId,
                storageId: storageId as Id<'_storage'>,
                index
            });

            setProgress('');
            onUploaded?.();
        } catch (err: unknown) {
            const error = err as Error;
            setError(error?.message || 'Error inesperado al subir la foto.');
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Eliminar esta foto de perfil?')) return;
        setIsUploading(true);
        setPreviewUrl(null);
        try {
            if (!tenantId) throw new Error("ID de inquilino no disponible.");
            await deleteImage({ tenantId, index });
            onUploaded?.();
        } finally {
            setIsUploading(false);
        }
    };

    const displayUrl = previewUrl || currentUrl;
    const label = index === 0 ? 'Foto Principal' : 'Foto Secundaria';

    return (
        <div className="space-y-2">
            {/* Label */}
            <label className="text-[8px] font-black uppercase tracking-widest text-white/30 block">
                {label} — Convex Storage
            </label>

            {/* Drop Zone / Preview */}
            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
                    relative group border-2 border-dashed rounded-lg overflow-hidden
                    transition-all cursor-pointer
                    ${displayUrl
                        ? 'border-white/20 hover:border-[var(--color-neon-cyan)]/60'
                        : 'border-white/10 hover:border-[var(--color-neon-cyan)]/40 bg-white/[0.02] hover:bg-white/[0.04]'
                    }
                    ${isUploading ? 'pointer-events-none opacity-70' : ''}
                `}
                style={{ minHeight: '160px' }}
            >
                {displayUrl ? (
                    /* Preview de imagen */
                    <div className="relative w-full" style={{ aspectRatio: '4/5', maxHeight: '200px' }}>
                        <img
                            src={displayUrl}
                            alt={label}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay al hover */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <span className="text-[9px] font-black uppercase text-white/80 tracking-widest">
                                🔄 Cambiar Foto
                            </span>
                            <button
                                type="button"
                                onClick={e => { e.stopPropagation(); handleDelete(); }}
                                className="text-[8px] font-black uppercase px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded transition-colors"
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                        {/* Badge storage */}
                        <div className="absolute top-1 left-1 bg-[var(--color-neon-cyan)]/90 text-black text-[6px] font-black uppercase px-1.5 py-0.5 rounded">
                            STORAGE
                        </div>
                    </div>
                ) : (
                    /* Zona vacía */
                    <div className="flex flex-col items-center justify-center gap-3 p-8">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-2xl text-white/20 group-hover:text-[var(--color-neon-cyan)] transition-colors">
                            📷
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-[9px] font-black uppercase text-white/30 group-hover:text-white/60 transition-colors">
                                Toca para subir foto
                            </p>
                            <p className="text-[7px] text-white/15 font-mono">
                                JPG, PNG, WEBP · Máx 10MB
                            </p>
                        </div>
                    </div>
                )}

                {/* Progress Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--color-neon-cyan)] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[8px] font-black uppercase text-[var(--color-neon-cyan)] font-mono">
                            {progress}
                        </p>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <p className="text-[8px] font-black uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                    ⚠️ {error}
                </p>
            )}

            {/* Pipeline Info */}
            <p className="text-[6px] font-mono text-white/15 leading-relaxed">
                ✓ Validación Zod · ✓ Resize 1280px · ✓ Marca de Agua · ✓ WebP 75%
            </p>

            {/* Hidden Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
}
