---
name: tailwind-design-system
description: Guía de estilo camaleónico y tokens visuales para temas dinámicos en Zynch.
---

# Zynch Skill: Chameleon Design System (Tailwind)

Zynch no tiene un solo estilo; se adapta a la identidad de cada cliente. Este skill define cómo lograr esa flexibilidad.

## 🎨 Temas Dinámicos (CSS Variables)

No uses colores estáticos de Tailwind (ej: `text-pink-500`) para elementos de marca. Usa variables cargadas desde la configuración del tenant.

### Configuración en `globals.css`:
```css
:root {
  --primary: #ff2d75;
  --secondary: #00f3ff;
  --background: #0a0a0a;
}

[data-theme="custom"] {
  --primary: var(--tenant-primary);
  --secondary: var(--tenant-secondary);
}
```

### Uso en Componentes:
```html
<button class="bg-[var(--primary)] hover:opacity-90 transition-all">
  Agendar Cita
</button>
```

## 📐 Layout & Responsive

1. **Mobile First**: Diseña siempre primero para móviles (donde la mayoría de los clientes acceden).
2. **Glassmorphism**: Aplica efectos de desenfoque (`backdrop-blur-md`) y bordes semitransparentes para un look premium/nocturno.
3. **Spacing**: Usa la escala estándar de Tailwind para mantener la armonía visual.

## 🎞️ Micro-Animaciones

Usa `framer-motion` o transiciones nativas de Tailwind para:
- Hovers en botones.
- Aparición suave de imágenes en la galería.
- El pulso de "En Vivo" o notificaciones.

---
*Cerebro Zynch v1.0*
