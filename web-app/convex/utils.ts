import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Obtener el usuario actualmente autenticado desde el contexto de Clerk.
 */
export async function getAuthUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Buscamos al usuario en nuestra DB por su email (vinculado a Clerk)
    return await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email!))
        .first();
}

/**
 * Validador de acceso: Asegura que el usuario tenga permiso sobre un tenant específico.
 */
export async function requireTenantAccess(
    ctx: QueryCtx | MutationCtx,
    tenantId: Id<"tenants">
) {
    const user = await getAuthUser(ctx);
    if (!user) {
        throw new Error("No autenticado. Por favor, inicia sesión.");
    }

    // El admin global tiene acceso a todo
    if (user.role === "admin") return user;

    // Otros roles deben pertenecer al tenant solicitado
    if (user.tenantId !== tenantId) {
        throw new Error("Acceso denegado: No tienes permiso para ver estos datos.");
    }

    return user;
}
