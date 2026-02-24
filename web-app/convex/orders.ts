import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Crear un pedido vinculado a un inquilino
 */
export const createOrder = mutation({
    args: {
        tenantId: v.id("tenants"),
        userId: v.id("users"),
        items: v.array(v.object({
            id: v.string(),
            name: v.string(),
            priceUSD: v.number(),
            type: v.string(),
        })),
        totalUSD: v.number(),
    },
    handler: async (ctx, args) => {
        const orderId = await ctx.db.insert("orders", {
            tenantId: args.tenantId,
            userId: args.userId,
            items: args.items,
            totalUSD: args.totalUSD,
            status: "pending",
            createdAt: Date.now(),
        });

        await ctx.db.insert("activityLogs", {
            tenantId: args.tenantId,
            userId: args.userId,
            action: "purchase_initiated",
            details: `Pedido ${orderId.toString()} iniciado`,
            timestamp: Date.now(),
        });

        return orderId;
    },
});

/**
 * Listar todos los pedidos de un inquilino
 */
export const listAll = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .order("desc")
            .collect();

        return Promise.all(orders.map(async (order) => {
            const user = await ctx.db.get(order.userId);
            return { ...order, userName: user?.email };
        }));
    },
});

/**
 * Actualizar estado del pedido y otorgar acceso
 */
export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        tenantId: v.id("tenants"),
        status: v.string(), // 'confirmed', 'rejected', 'completed'
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order || order.tenantId !== args.tenantId) {
            throw new Error("Unauthorized: Order not found or doesn't belong to this tenant.");
        }

        await ctx.db.patch(args.id, { status: args.status });

        if (args.status === 'completed') {
            for (const item of order.items) {
                if (item.type === 'pack') {
                    await ctx.db.insert("access", {
                        tenantId: order.tenantId,
                        userId: order.userId,
                        packId: item.id,
                        grantedAt: Date.now(),
                    });
                }
            }
        }

        await ctx.db.insert("activityLogs", {
            tenantId: order.tenantId,
            userId: order.userId,
            action: `order_${args.status}`,
            details: `Pedido ${args.id} actualizado a ${args.status}`,
            timestamp: Date.now(),
        });
    },
});
