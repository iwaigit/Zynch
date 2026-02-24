import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Listar todos los logs de un inquilino
 */
export const listAll = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("activityLogs")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .order("desc")
            .take(100);
    },
});

/**
 * Listar logs de un usuario específico dentro de un inquilino 
 */
export const listByUser = query({
    args: {
        tenantId: v.id("tenants"),
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("activityLogs")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .take(50);
    },
});
