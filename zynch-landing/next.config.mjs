/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',      // Obligatorio para GitHub Pages
  images: {
    unoptimized: true,   // Evita errores con imágenes estáticas
  },
};

export default nextConfig;
