import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Usuarios con registro KS+5números
    users: defineTable({
        email: v.string(),
        password: v.string(), // Formato: KSXXXXX
        birthdate: v.string(),
        isVerified: v.boolean(),
        phone: v.optional(v.string()), // Formato internacional +XXXXX
        whatsappVerified: v.optional(v.boolean()),
        role: v.string(), // 'admin' (developer) | 'promoter' (business owner/Karla) | 'vip' (premium client) | 'client' (standard)
        permissions: v.optional(v.array(v.string())), // e.g., ['view_logs', 'manage_calendar', 'grant_roles']
        createdAt: v.number(),
    }).index("by_email", ["email"])
        .index("by_phone", ["phone"]),

    // Sistema de Citas Profesional
    appointments: defineTable({
        userId: v.id("users"),
        date: v.string(),
        time: v.string(),
        status: v.string(), // 'pending', 'confirmed', 'rejected'
        notes: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_date", ["date"])
        .index("by_user", ["userId"]),

    // Tienda y Pedidos
    products: defineTable({
        name: v.string(),
        description: v.string(),
        priceUSD: v.number(),
        stock: v.optional(v.number()),
        category: v.string(),
        imageUrl: v.optional(v.string()),
        image: v.optional(v.string()),
        active: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
    }),

    orders: defineTable({
        userId: v.id("users"),
        items: v.array(v.object({
            id: v.string(),
            name: v.string(),
            priceUSD: v.number(),
            type: v.string(), // 'product' | 'pack'
        })),
        totalUSD: v.number(),
        status: v.string(), // 'pending', 'paid', 'shipped', 'completed', 'cancelled'
        createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // Control de Acceso Digital
    access: defineTable({
        userId: v.id("users"),
        packId: v.string(),
        grantedAt: v.number(),
    }).index("by_user_pack", ["userId", "packId"]),

    // Logs de Actividad (CRM)
    activityLogs: defineTable({
        userId: v.id("users"),
        action: v.string(), // e.g., 'login', 'purchase', 'appointment_booked', 'view_pack'
        details: v.string(),
        timestamp: v.number(),
    }).index("by_user", ["userId"]),

    settings: defineTable({
        key: v.string(),
        value: v.any(),
    }).index("by_key", ["key"]),

    // Galería de Fotos (Marketing) - Hasta 2 docenas de fotos
    gallery: defineTable({
        storageId: v.id("_storage"),
        alt: v.string(),
        order: v.number(),
        createdAt: v.number(),
    }).index("by_order", ["order"]),

    // Configuración Global del Sitio
    siteConfig: defineTable({
        performerName: v.string(),
        tagline: v.string(),
        logoUrl: v.optional(v.string()),
        primaryColor: v.string(),
        secondaryColor: v.string(),
        socialLinks: v.object({
            instagram: v.optional(v.string()),
            twitter: v.optional(v.string()),
            onlyfans: v.optional(v.string()),
            tiktok: v.optional(v.string()),
        }),
        contactEmail: v.string(),
        bio: v.string(),
        metaDescription: v.string(),
        updatedAt: v.number(),
    }),
});
