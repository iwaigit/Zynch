---
name: convex-best-practices
description: Patrones de normalización, aislamiento de inquilinos y optimización de queries en Convex para Zynch.
---

# Zynch Skill: Convex Professional Patterns

Este skill define cómo interactuar con el backend de Convex en Zynch para asegurar que sea escalable, seguro y multi-tenant.

## 🛡️ Aislamiento Multi-Tenant (Regla de Oro)

Todas las tablas (excepto las globales) **DEBEN** incluir un `tenantId`. Nunca realices una query sin filtrar por `tenantId`.

### Patrón de Query Segura:
```typescript
export const getByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    // 1. Siempre verificar permisos si el contexto tiene identidad
    const identity = await ctx.auth.getUserIdentity();
    // ... lógica de validación ...

    // 2. Query indexada
    return await ctx.db
      .query("mi_tabla")
      .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
      .collect();
  },
});
```

## 📊 Normalización y Esquema

1. **Índices**: Cada tabla con `tenantId` debe tener un índice `by_tenant`.
2. **Tipado Estricto**: Usa `v.id("nombre_tabla")` en lugar de strings simples para IDs.
3. **Fechas**: Almacena siempre como `number` (timestamps de Unix) para facilitar comparaciones y ordenamiento.

## 🚀 Optimización de Rendimiento

- **Evita .filter()**: Siempre prefiere `.withIndex()` y `.range()`. Los filtros en memoria son lentos en datasets grandes.
- **Pagination**: Usa `ctx.db.query(...).paginate(args.paginationOpts)` para listas largas (ej: logs, galería).
- **Triggers Simulados**: Realiza limpiezas o actualizaciones en cascada dentro de la misma mutación para mantener la integridad.

## 🔐 Seguridad (RLS)

Implementa siempre la función `requireTenantAccess` (ubicada en `convex/permissions.ts`) al inicio de cada mutación sensible.

---
*Cerebro Zynch v1.0*
