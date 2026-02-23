/**
 * Procesa una imagen: Redimensiona, Agrega Marca de Agua y Comprime.
 * @param file Archivo de imagen original
 * @param newName Nuevo nombre para el archivo (ej: KSF_01)
 * @returns Archivo procesado en formato WebP
 */
export async function processImage(file: File, newName: string, watermarkText: string = 'Official Content'): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const MAX_SIZE = 1280;
                let width = img.width;
                let height = img.height;

                // 1. Calcular Redimensionamiento (Manteniendo Aspect Ratio)
                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                // 2. Crear Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject("No se pudo crear el contexto del canvas");

                // 3. Dibujar Imagen Redimensionada
                ctx.drawImage(img, 0, 0, width, height);

                // 4. Agregar Marca de Agua Principal (Centro - Doble de tamaño)
                const fontSize = Math.floor(width * 0.10); // 10% del ancho (doble del original)
                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Blanco con 30% opacidad
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Dibujamos en el centro con rotación
                ctx.save();
                ctx.translate(width / 2, height / 2);
                ctx.rotate(-Math.PI / 6); // Rotar -30 grados
                ctx.fillText(watermarkText.toLowerCase(), 0, 0);
                ctx.restore();

                // 5. Agregar Marca de Agua Footer (Copyright) - 25% más grande
                const footerFontSize = Math.floor(width * 0.01875); // 1.875% del ancho (25% más que 1.5%)
                ctx.font = `${footerFontSize}px Arial`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Blanco con 50% opacidad
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                // Texto del footer con símbolo de copyright
                const copyrightText = `© ${watermarkText.toLowerCase()} - Todos los derechos reservados. Distribución no autorizada prohibida.`;
                ctx.fillText(copyrightText, width / 2, height - 10);

                // 6. Exportar como WebP comprimido
                canvas.toBlob((blob) => {
                    if (!blob) return reject("Error al comprimir imagen");

                    const processedFile = new File([blob], `${newName}.webp`, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });

                    resolve(processedFile);
                }, 'image/webp', 0.75); // Calidad 75%
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}
