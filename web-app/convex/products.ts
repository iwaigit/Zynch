import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Obtener todos los productos activos de un inquilino
 */
export const getActive = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
    },
});

/**
 * Crear un nuevo producto
 */
export const create = mutation({
    args: {
        tenantId: v.id("tenants"),
        name: v.string(),
        description: v.string(),
        priceUSD: v.number(),
        category: v.string(), // 'lenceria', 'toys', 'digital'
        image: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", {
            ...args,
            active: true,
            createdAt: Date.now(),
        });
    },
});