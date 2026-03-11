---
name: vercel-next-app-router
description: Mejores prácticas para Next.js 15+, Server Components y optimización de rutas dinámicas en Zynch.
---

# Zynch Skill: Next.js & Vercel Excellence

Guía para construir el frontend de Zynch usando las capacidades más modernas de Next.js y el despliegue optimizado en Vercel.

## 📂 Arquitectura de Rutas (App Router)

1. **Server Components por Defecto**: Mantén la lógica de obtención de datos en el servidor. Usa `"use client"` solo cuando necesites interactividad (hooks, event listeners).
2. **Rutas Dinámicas ([tenant])**: Zynch usa subdominios o slugs. Las páginas deben capturar el `params.tenant` para inicializar el contexto.
3. **Layouts Anidados**: Usa `layout.tsx` para persistir el estado del navbar y los temas dinámicos del tenant sin re-renderizar todo el sitio.

## ⚡ Optimización y Performance

- **Streaming & Suspense**: Envuelve componentes pesados (como galerías o dashboards) en `<Suspense>` con fallbacks elegantes.
- **Image Optimization**: Usa siempre el componente `next/image`. En Zynch, configura el `loader` para que funcione con los IDs de Convex Storage.
- **Font Optimization**: Usa `next/font/google` para cargar fuentes premium (Inter, Monsterrat) con zero layout shift.

## 🛠️ Data Fetching con Convex

Usa los hooks de `@convex-dev/react`:
- `useQuery`: Para lectura reactiva en tiempo real.
- `useMutation`: Para acciones del usuario.
- **Preloading**: Considera usar `preloadQuery` en el edge si la latencia es crítica para el SEO de la landing.

## 🌐 Edge Middleware

El archivo `middleware.ts` en la raíz es el corazón del routing multi-tenant. Debe interceptar el hostname y redirigir internamente al slug correcto del tenant.

---
*Cerebro Zynch v1.0*
