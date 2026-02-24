import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Actualizar rol de usuario (específico de inquilino)
 */
export const updateUserRole = mutation({
    args: {
        tenantId: v.id("tenants"),
        userId: v.id("users"),
        role: v.string(),
        permissions: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user || user.tenantId !== args.tenantId) {
            throw new Error("Unauthorized: User not found or doesn't belong to this tenant.");
        }
        await ctx.db.patch(args.userId, {
            role: args.role,
            permissions: args.permissions || [],
        });
    },
});

/**
 * Listar clientes filtrados por inquilino
 */
export const listClients = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const users = await ctx.db
            .query("users")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .collect();

        return Promise.all(users.map(async (user) => {
            const ordersCount = (await ctx.db
                .query("orders")
                .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
                .filter((q) => q.eq(q.field("userId"), user._id))
                .collect()).length;

            const lastActivity = await ctx.db
                .query("activityLogs")
                .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
                .filter((q) => q.eq(q.field("userId"), user._id))
                .order("desc")
                .first();

            return {
                ...user,
                ordersCount,
                lastActivity: lastActivity?.action || 'Sin actividad',
            };
        }));
    },
});

/**
 * Obtener detalles de un cliente (validando inquilino)
 */
export const getClientDetails = query({
    args: { tenantId: v.id("tenants"), userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user || user.tenantId !== args.tenantId) {
            return null; // Aislamiento: No permitimos ver datos de otro inquilino
        }

        const tenantId = args.tenantId;

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .collect();

        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        const logs = await ctx.db
            .query("activityLogs")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .collect();

        const access = await ctx.db
            .query("access")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        return {
            user,
            orders,
            appointments,
            logs,
            access
        };
    },
});
