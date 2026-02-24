# 🏗️ FASE 1: Sistema de Configuración Global (Zynch by iwai)

> **Estado:** En progreso  
> **Fecha inicio:** 2026-02-22  
> **Objetivo:** Hacer la app extensible y fácil de personalizar

---

## 🎯 Objetivo General

Crear un sistema de configuración centralizada que permita cambiar:
- Nombre del performer
- Branding (logo, colores, fuentes)
- Textos y descripciones
- Redes sociales
- Todo desde UN solo lugar

---

## 📋 Tareas Detalladas

### 1.1 Crear tabla `config` en Convex

**Archivo:** `convex/config.ts`

```typescript
// Schema propuesto
{
  performerName: string,      // "Zynch User" | "Melissa Bennet"
  tagline: string,            // "Premium Personal Service Platform"
  primaryColor: string,       // "#ff2d75"
  secondaryColor: string,     // "#00f3ff"
  socialLinks: {
    instagram?: string,
    twitter?: string,
    onlyfans?: string,
    tiktok?: string,
  },
  contactEmail: string,
  bio: string,                // Descripción corta
  metaDescription: string,    // Para SEO
}
```

**Queries necesarias:**
- `getConfig()` - Obtener configuración actual
- `updateConfig()` - Actualizar (solo admin)

---

### 1.2 Crear archivo `config/site.ts`

**Archivo:** `web-app/config/site.ts`

Configuración centralizada con valores por defecto + override desde Convex.

```typescript
export const siteConfig = {
  // Valores por defecto (fallback)
  default: {
    name: "Karla Spice",
    tagline: "Official Site",
    // ...
  },
  // Se sobreescribe con datos de Convex
  get current() { /* merge default + convex */ }
}
```

---

### 1.3 Reemplazar textos hardcodeados

**Archivos a modificar:**
- `app/layout.tsx` - Título, descripción
- `app/page.tsx` - Contenido principal
- `components/AboutKarla.tsx` - Nombre, bio
- `components/LinkTree.tsx` - Redes sociales
- Todo lugar donde diga "Karla Spice"

**Patrón:**
```typescript
// ANTES:
<h1>Karla Spice</h1>

// DESPUÉS:
<h1>{siteConfig.performerName}</h1>
```

---

### 1.4 Sistema de temas/colores

**Archivo:** `config/theme.ts`

```typescript
export const themes = {
  default: {
    primary: "#ff6b6b",
    secondary: "#4ecdc4",
    background: "#0a0a0a",
    text: "#ffffff"
  },
  dark: { /* ... */ },
  light: { /* ... */ }
}
```

Integrar con Tailwind usando CSS variables.

---

## ✅ Checklist

- [x] 1.1 Crear schema `siteConfig` en Convex
- [x] 1.2 Crear queries/mutations para config
- [x] 1.3 Crear `config/site.ts`
- [x] 1.4 Crear `config/theme.ts` (Integrado en siteConfig)
- [x] 1.5 Crear hook `useSiteConfig()`
- [x] 1.6 Reemplazar textos en `layout.tsx`
- [x] 1.7 Reemplazar textos en `page.tsx`
- [x] 1.8 Reemplazar textos en `AboutPerformer.tsx`
- [x] 1.9 Reemplazar textos en `LinkTree.tsx`
- [x] 1.10 Probar rebranding completo (Zynch by iwai)

---

## 🧪 Testing

1. Cambiar `performerName` a "Melissa Bennet"
2. Verificar que todos los textos cambian
3. Cambiar colores del tema
4. Verificar que el diseño se actualiza

---

## 📁 Archivos nuevos

```
web-app/
├── config/
│   ├── site.ts          # Configuración del sitio
│   └── theme.ts         # Configuración de colores
├── hooks/
│   └── useSiteConfig.ts # Hook para acceder a config
└── convex/
    └── config.ts        # Backend de configuración
```

---

## 📝 Notas

- Mantener compatibilidad con datos existentes
- Los cambios deben reflejarse inmediatamente (sin rebuild)
- Cachear config en el cliente para performance

---

*Creado: 2026-02-22*
