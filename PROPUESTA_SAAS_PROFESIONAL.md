# Propuesta de Profesionalización - Zynch SaaS

> **Fecha:** 2026-03-02  
> **Autor:** IWAI - Automated Processes (Alberto CEO + Pablo Weber)  
> **Estado:** Propuesta para revisión  
> **Versión:** 1.0

---

## Resumen Ejecutivo

Zynch by iwai ha evolucionado de una implementación personalizada (KSFun) a una plataforma SaaS multi-tenant "camaleónica". Este documento propone una arquitectura profesional para escalar el producto, permitir nuevos clientes (tenants) de forma automatizada y establecer la base para monetización.

---

## 1. Arquitectura de Carpetas SaaS (Monorepo)

Se propone reorganizar el repositorio en un monorepo estructurado:

```
Zynch/
├── apps/
│   ├── web/                    # Frontend único (Next.js) - multi-tenant por diseño
│   │   ├── app/                # Rutas dinámicas por tenant slug
│   │   ├── components/         # Componentes reutilizables
│   │   └── hooks/              # useSiteConfig(), useTenant(), etc.
│   └── admin-dashboard/        # Dashboard para IWAI gestionar todos los tenants
│       ├── tenants/            # CRUD de tenants
│       ├── billing/            # Suscripciones y pagos
│       └── analytics/          # Métricas agregadas
├── packages/
│   ├── shared-config/          # ESLint, TypeScript, Tailwind configs
│   ├── ui-components/          # Design system (shadcn/ui base)
│   └── convex-helpers/         # Utilidades para queries/mutations multi-tenant
├── infra/
│   ├── convex/                 # Schema + functions (ya existe)
│   ├── storage/                # Políticas de almacenamiento por tenant
│   └── edge-config/            # Configuración edge (Vercel)
└── docs/
    ├── saas-core/              # Arquitectura, APIs, decisiones técnicas
    ├── tenants/                # Un subfolder por cliente (karla-spice, etc.)
    └── runbooks/               # Procedimientos operativos
```

**Beneficios:**
- Código compartido reduce duplicación
- Despliegues independientes por app
- Escalabilidad para nuevos equipos

---

## 2. Multi-Tenancy Profesional (3 Capas)

### Capa 1: Base de Datos (Convex)
**Estado actual:** ✅ Implementado

```typescript
// Schema actual (ya correcto)
tenants: defineTable({
  name: v.string(),
  slug: v.string(),           // URL identifier: "karla-spice"
  ownerId: v.optional(v.id("users")),
  plan: v.string(),           // 'free' | 'pro' | 'enterprise'
  createdAt: v.number(),
}).index("by_slug", ["slug"])

// Todas las tablas tienen tenantId + índice by_tenant
users, appointments, orders, gallery, siteConfig, etc.
```

**Mejoras propuestas:**
- Implementar Row Level Security (RLS) en Convex
- Soft delete por tenant (no borrado físico)
- Data retention policies (GDPR)

### Capa 2: Almacenamiento (Convex Storage)
**Estado actual:** ⚠️ Parcial

```typescript
// Propuesta: Estructura de carpetas virtuales
// /tenants/{tenantId}/
//   ├── profile-images/
//   ├── gallery/
//   └── packs/

// Implementar middleware de upload que:
// 1. Valide el tenantId del usuario autenticado
// 2. Guarde archivos con prefijo del tenant
// 3. Aplique watermark automáticamente
```

### Capa 3: Routing & Edge (Vercel)
**Estado actual:** ❌ No implementado

**Propuesta A: Subdominios (Recomendada)**
```
karla-spice.zynch.fun    → Carga config de "karla-spice"
melissa-bennet.zynch.fun → Carga config de "melissa-bennet"
```

**Implementación:**
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const tenantSlug = hostname.replace('.zynch.fun', '');
  
  // Verificar slug existe en Convex
  // Inyectar tenant en headers para usar en layout.tsx
  req.headers.set('x-tenant-slug', tenantSlug);
  return NextResponse.rewrite(req.url);
}
```

**Propuesta B: Path-based (Fallback)**
```
zynch.fun/karla-spice
zynch.fun/melissa-bennet
```

**Propuesta C: Custom Domains (Enterprise)**
```
karlaspice.com → Apunta a Vercel → Carga tenant "karla-spice"
```

---

## 3. Onboarding Automatizado de Tenants

**Flujo completo propuesto:**

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: Registro (IWAI Admin o Self-service)                  │
└─────────────────────────────────────────────────────────────────┘
                         ↓
POST /api/admin/tenants  o  POST /api/onboard (self-service)
{
  "name": "Melissa Bennet",
  "slug": "melissa-bennet",
  "email": "melissa@email.com",
  "plan": "pro"
}
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: Provisión Automática                                  │
│  • Crear registro en tabla `tenants`                           │
│  • Crear `siteConfig` con valores por defecto                  │
│  • Crear bucket de storage dedicado                            │
│  • Crear customer en Stripe                                      │
│  • Enviar email de bienvenida con link a setup                 │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3: Setup por el Cliente (Onboarding Wizard)              │
│  • Upload logo y fotos de perfil                               │
│  • Configurar colores de marca                               │
│  • Establecer precios y horarios                               │
│  • Configurar métodos de pago aceptados                        │
│  • Conectar redes sociales                                     │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 4: Go Live                                               │
│  • Tenant disponible en {slug}.zynch.fun                       │
│  • IWAI recibe notificación de activación                      │
│  • Comienza tracking de uso para billing                       │
└─────────────────────────────────────────────────────────────────┘
```

**Pantallas del Onboarding Wizard:**

1. **Welcome** - Video introductorio de Zynch
2. **Branding** - Logo, colores, tipografía
3. **Profile** - Bio, stats (Encanto/Estilo/Energía), físico
4. **Services** - Qué ofrece, precios, duración
5. **Schedule** - Días/horarios de trabajo, 24h toggle
6. **Payment** - Métodos aceptados (Ca$h, Pago móvil, Zelle)
7. **Gallery** - Upload de fotos iniciales (con watermark auto)
8. **Review** - Preview de cómo se ve antes de publicar
9. **Publish** - Go live!

---

## 4. Modelos de Negocio (Pricing)

### Estructura de planes propuesta:

| Feature | Free | Pro ($49/mes) | Enterprise ($199/mes) |
|---------|------|---------------|----------------------|
| **Tenants** | 1 | 1 | Múltiples (franquicia) |
| **Branding** | "Powered by Zynch" | Custom domain | White-label completo |
| **Comisión** | 15% por transacción | 10% | 5% o flat fee |
| **Storage** | 1GB | 10GB | 100GB |
| **Analytics** | Básico | Avanzado + export | API access |
| **Soporte** | Email | Prioridad | Dedicado |
| **Onboarding** | Self-service | Asistido | White-glove |
| **Features** | Core | + Promo codes, bundles | + API, webhooks |

### Revenue Streams:
1. **Suscripción mensual** (MRR)
2. **Comisión por transacción** (citaspagadas, packs vendidos)
3. **Add-ons:** SMS notifications, extra storage, custom domain
4. **Enterprise:** Setup fee ($2,000-5,000) + contrato anual

---

## 5. Separación de Responsabilidades

### IWAI - Automated Processes (Equipo Core)
**Alberto CEO + Pablo Weber**
- Arquitectura y escalabilidad
- Desarrollo de nuevas features
- Seguridad y compliance
- Infraestructura (Vercel, Convex, Stripe)
- Billing y suscripciones
- Soporte técnico nivel 2

### Tenant Admin (Performer/Promoter)
**Ej: Karla Spice, Melissa Bennet**
- Contenido (fotos, bio, descripciones)
- Configuración de precios y horarios
- Gestión de citas y pedidos
- Comunicación con clientes
- Marketing personal (redes sociales)

### Clientes Finales (End Users)
- Registro verificado (edad + identidad)
- Agendar citas
- Comprar packs digitales
- Interacción con performer

---

## 6. Seguridad & Compliance

### Row Level Security (RLS) - Prioridad Alta

```typescript
// convex/permissions.ts
export async function requireTenantAccess(
  ctx: QueryCtx | MutationCtx,
  tenantId: Id<"tenants">
) {
  const user = await requireAuth(ctx);
  
  // Admin global puede acceder a todo
  if (user.role === 'admin') return true;
  
  // Usuario debe pertenecer al tenant
  if (user.tenantId !== tenantId) {
    throw new Error("Access denied: Invalid tenant");
  }
  
  return true;
}

// Uso en queries
export const getAppointments = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    await requireTenantAccess(ctx, args.tenantId);
    return ctx.db.query("appointments")
      .withIndex("by_tenant", q => q.eq("tenantId", args.tenantId))
      .collect();
  }
});
```

### GDPR / CCPA Compliance

- **Right to access:** Endpoint para exportar todos los datos del tenant
- **Right to deletion:** Soft delete + purga programada después de 30 días
- **Data retention:** Citas completadas se anonimizan después de 1 año
- **Consent tracking:** Registro de aceptación de términos por usuario

### Rate Limiting

```typescript
// Por tenant: max 100 requests/minuto
// Por IP: max 10 requests/segundo
// Prevenir abuso de endpoints de cita/pago
```

---

## 7. Roadmap de Implementación

### Fase 1: Fundamentos (Semanas 1-2)
- [ ] Implementar RLS en todas las queries/mutations
- [ ] Separar storage por tenant (prefix en archivos)
- [ ] Crear middleware de detección de tenant
- [ ] Setup Vercel Edge Config para subdominios

### Fase 2: Admin Dashboard (Semanas 3-4)
- [ ] Crear app `admin-dashboard`
- [ ] CRUD de tenants
- [ ] Vista de analytics agregados
- [ ] Gestión de billing/suscripciones

### Fase 3: Onboarding (Semanas 5-6)
- [ ] Diseñar wizard de onboarding (9 pasos)
- [ ] Implementar flujo de setup inicial
- [ ] Sistema de email notifications
- [ ] Template de welcome email

### Fase 4: Monetización (Semanas 7-8)
- [ ] Integrar Stripe (subscriptions + comisiones)
- [ ] Implementar planes (Free/Pro/Enterprise)
- [ ] Feature flags por plan
- [ ] Billing dashboard para tenants

### Fase 5: Escalabilidad (Semanas 9-10)
- [ ] Migrar a monorepo (Turborepo)
- [ ] Optimizar queries Convex (pagination, caching)
- [ ] CDN para imágenes (Cloudflare/Vercel Edge)
- [ ] Monitoring (Sentry + Convex logs)

---

## 8. Métricas de Éxito (KPIs)

| Métrica | Target Q2 2026 | Target Q4 2026 |
|---------|----------------|----------------|
| Tenants activos | 5 | 20 |
| MRR (Monthly Recurring Revenue) | $500 | $5,000 |
| GMV (Gross Merchandise Value) | $10,000 | $100,000 |
| Churn rate | <10% | <5% |
| NPS Score | >40 | >50 |
| Uptime | 99.9% | 99.95% |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Data leak entre tenants | Baja | Crítico | RLS estricto + auditoría continua |
| Abuso por contenido ilegal | Media | Alto | Términos claros + moderación + reportes |
| Competencia (OnlyFans, etc.) | Alta | Medio | Diferenciación en UX + soporte local |
| Escalabilidad técnica | Media | Alto | Monitoreo early + arquitectura preparada |
| Dependencia de Convex/Vercel | Baja | Medio | Estrategia de backup + código portable |

---

## 10. Decisiones Pendientes

1. **Routing:** ¿Subdominios (karla-spice.zynch.fun) o paths (zynch.fun/karla-spice)?
2. **Self-service:** ¿Permitir registro público o solo por invitación de IWAI?
3. **Custom domains:** ¿Incluir en Pro o solo Enterprise?
4. **Comisiones:** ¿Porcentaje variable o flat fee?
5. **Equipo:** ¿Contratar developer adicional para Fase 3+?

---

## Conclusión

Zynch tiene una base técnica sólida (Convex multi-tenant, Next.js camaleónico). La profesionalización requiere:
1. **Seguridad:** RLS completo
2. **Producto:** Onboarding fluido + admin dashboard
3. **Negocio:** Modelo de precios claro + Stripe
4. **Operaciones:** Documentación + monitoreo

**Recomendación:** Comenzar con Fase 1 (fundamentos de seguridad) antes de aceptar nuevos tenants.

---

**Documento preparado para:** Alberto CEO & Pablo Weber - IWAI Automated Processes  
**Fecha de revisión:** [Pendiente - agregar fecha cuando se discuta]  
**Próximo paso:** Reunión de decisión sobre roadmap y asignación de recursos

---

© 2026 **IWAI - Automated Processes** | [www.iwai.work](https://www.iwai.work)
