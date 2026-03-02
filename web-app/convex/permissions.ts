import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Role Definitions:
 * - admin: Developer with full dashboard access and ability to grant all roles
 * - promoter: Business owner (Performer) with access to client logs and calendar management
 * - vip: Premium client with special content access
 * - client: Standard registered user
 */

/**
 * Verifica autenticación básica y retorna el usuario
 * @throws Error si no hay usuario autenticado
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    // En Convex, la autenticación se maneja via auth.uid() o similar
    // Por ahora, buscamos el userId en el contexto o argumentos
    // Esto es un placeholder - implementación real depende de cómo manejes auth
    const user = await ctx.db.query("users").first();
    if (!user) {
        throw new Error("Authentication required");
    }
    return user;
}

/**
 * Row Level Security - Verifica que el usuario tenga acceso al tenant
 * @throws Error si el usuario no tiene acceso al tenant
 */
export async function requireTenantAccess(
    ctx: QueryCtx | MutationCtx,
    tenantId: Id<"tenants">
) {
    const user = await requireAuth(ctx);
    
    // Admin global puede acceder a todos los tenants
    if (user.role === "admin") {
        return user;
    }
    
    // Promoter solo puede acceder a su propio tenant
    if (user.role === "promoter" && user.tenantId !== tenantId) {
        throw new Error("Access denied: You can only access your own tenant");
    }
    
    // Client y VIP solo pueden acceder a su propio tenant
    if ((user.role === "client" || user.role === "vip") && user.tenantId !== tenantId) {
        throw new Error("Access denied: Invalid tenant");
    }
    
    return user;
}

/**
 * Verifica que el usuario sea admin global
 * @throws Error si no es admin
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
    const user = await requireAuth(ctx);
    if (user.role !== "admin") {
        throw new Error("Access denied: Admin role required");
    }
    return user;
}

/**
 * Verifica que el usuario sea admin o promoter del tenant
 * @throws Error si no tiene permisos de staff
 */
export async function requireStaff(ctx: QueryCtx | MutationCtx, tenantId: Id<"tenants">) {
    const user = await requireTenantAccess(ctx, tenantId);
    if (user.role !== "admin" && user.role !== "promoter") {
        throw new Error("Access denied: Staff role required");
    }
    return user;
}

/**
 * Verifica que el usuario sea el dueño del recurso o admin
 * @throws Error si no es dueño ni admin
 */
export async function requireOwnerOrAdmin(
    ctx: QueryCtx | MutationCtx,
    resourceOwnerId: Id<"users">
) {
    const user = await requireAuth(ctx);
    if (user.role === "admin") return user;
    if (user._id !== resourceOwnerId) {
        throw new Error("Access denied: You can only access your own resources");
    }
    return user;
}

/**
 * Verifica que el usuario tenga un permiso específico
 * @throws Error si no tiene el permiso
 */
export async function requirePermission(
    ctx: QueryCtx | MutationCtx,
    permission: string
) {
    const user = await requireAuth(ctx);
    
    // Admin tiene todos los permisos
    if (user.role === "admin") return user;
    
    // Verificar permisos explícitos
    if (!user.permissions?.includes(permission)) {
        throw new Error(`Access denied: Permission '${permission}' required`);
    }
    
    return user;
}

// ==================== LEGACY QUERIES (Mantener compatibilidad) ====================

// Check if user has admin role
export const isAdmin = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.role === "admin";
    },
});

// Check if user has promoter role
export const isPromoter = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.role === "promoter";
    },
});

// Check if user has admin OR promoter role (for shared permissions)
export const isStaff = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        return user?.role === "admin" || user?.role === "promoter";
    },
});

// Check if user has specific permission
export const hasPermission = query({
    args: {
        userId: v.id("users"),
        permission: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return false;

        // Admin has all permissions
        if (user.role === "admin") return true;

        // Check explicit permissions array
        return user.permissions?.includes(args.permission) ?? false;
    },
});
