import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // --- Núcleo del SaaS: Inquilinos (Tenants) ---
    tenants: defineTable({
        name: v.string(),
        slug: v.string(), // Identificador único para la URL (ej: "karla-spice")
        ownerId: v.optional(v.id("users")),
        planType: v.string(), // 'free', 'pro', 'elite'
        status: v.string(),   // 'active', 'blocked', 'trial'
        trialEndsAt: v.optional(v.number()),
        masterNotes: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_status", ["status"]),

    // Tabla para validación de registro (One-Time Password)
    otps: defineTable({
        email: v.string(),
        code: v.string(),
        expiresAt: v.number(),
    }).index("by_email", ["email"]),

    // Historial de Suscripciones y Pagos
    subscriptions: defineTable({
        tenantId: v.id("tenants"),
        planType: v.string(),
        startDate: v.number(),
        endDate: v.number(),
        status: v.string(), // 'active', 'expired', 'cancelled'
        paymentId: v.optional(v.string()),
    }).index("by_tenant", ["tenantId"]),

    // Usuarios: Ahora vinculados a un inquilino
    users: defineTable({
        tenantId: v.optional(v.id("tenants")), // Opcional para admins globales, requerido para otros
        email: v.string(),
        password: v.string(), // Formato: [INITIALS]XXXXX
        birthdate: v.string(),
        isVerified: v.boolean(),
        phone: v.optional(v.string()),
        whatsappVerified: v.optional(v.boolean()),
        role: v.string(), // 'admin', 'promoter', 'vip', 'client'
        permissions: v.optional(v.array(v.string())),
        createdAt: v.number(),
    }).index("by_email", ["email"])
        .index("by_tenant", ["tenantId"])
        .index("by_tenant_role", ["tenantId", "role"])
        .index("by_phone", ["phone"]),

    // Sistema de Citas Profesional
    appointments: defineTable({
        tenantId: v.id("tenants"),
        userId: v.id("users"),
        date: v.string(),
        time: v.string(),
        status: v.string(), // 'pending', 'confirmed', 'rejected'
        notes: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_tenant", ["tenantId"])
        .index("by_tenant_date", ["tenantId", "date"])
        .index("by_tenant_status", ["tenantId", "status"])
        .index("by_tenant_user", ["tenantId", "userId"]),

    // Tienda y Pedidos
    products: defineTable({
        tenantId: v.optional(v.id("tenants")),
        name: v.string(),
        description: v.string(),
        priceUSD: v.number(),
        stock: v.optional(v.number()),
        category: v.string(),
        imageUrl: v.optional(v.string()),
        image: v.optional(v.string()),
        active: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
    }).index("by_tenant", ["tenantId"]),

    orders: defineTable({
        tenantId: v.optional(v.id("tenants")),
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
    }).index("by_user", ["userId"])
        .index("by_tenant_status", ["tenantId", "status"])
        .index("by_tenant", ["tenantId"]),

    // Control de Acceso Digital
    access: defineTable({
        tenantId: v.id("tenants"),
        userId: v.id("users"),
        packId: v.string(),
        grantedAt: v.number(),
    }).index("by_user_pack", ["userId", "packId"])
        .index("by_tenant", ["tenantId"]),

    // Logs de Actividad (CRM)
    activityLogs: defineTable({
        tenantId: v.optional(v.id("tenants")),
        userId: v.id("users"),
        action: v.string(),
        details: v.string(),
        timestamp: v.number(),
    }).index("by_user", ["userId"])
        .index("by_tenant", ["tenantId"]),

    settings: defineTable({
        tenantId: v.id("tenants"),
        key: v.string(),
        value: v.any(),
    }).index("by_key", ["key"])
        .index("by_tenant", ["tenantId"]),

    // Galería de Fotos (Marketing)
    gallery: defineTable({
        tenantId: v.optional(v.id("tenants")),
        storageId: v.id("_storage"),
        alt: v.string(),
        order: v.number(),
        createdAt: v.number(),
    }).index("by_order", ["order"])
        .index("by_tenant", ["tenantId"]),

    // Configuración Específica del Inquilino (Perfil/Branding)
    siteConfig: defineTable({
        tenantId: v.optional(v.id("tenants")),
        performerName: v.string(),
        initials: v.optional(v.string()),
        tagline: v.string(),
        profileImages: v.optional(v.array(v.string())),
        profileImageIds: v.optional(v.array(v.id("_storage"))),
        primaryColor: v.string(),
        secondaryColor: v.string(),
        backgroundColor: v.optional(v.string()),
        socialLinks: v.object({
            instagram: v.optional(v.string()),
            twitter: v.optional(v.string()),
            onlyfans: v.optional(v.string()),
            tiktok: v.optional(v.string()),
        }),
        contactEmail: v.string(),
        bio: v.string(),
        metaDescription: v.string(),

        // --- Físico del Perfil ---
        height: v.optional(v.string()),       // Estatura ej: "1.68m"
        eyeColor: v.optional(v.string()),     // Color de ojos ej: "Café"
        locations: v.optional(v.array(v.string())),
        weight: v.optional(v.string()),

        // --- Stats Dinámicas (Barras de Rendimiento) ---
        stats: v.optional(v.array(v.object({
            label: v.string(),   // Encanto, Estilo, etc.
            value: v.number(),   // 0-100
            color: v.string(),   // Color hex ej: "#ff2d75"
        }))),

        // --- Horario & Servicio ---
        schedule: v.optional(v.object({
            is24h: v.boolean(),
            from: v.optional(v.string()),
            to: v.optional(v.string()),
            workingDays: v.array(v.string()),
        })),
        pricing: v.optional(v.object({
            h1: v.number(),
            h2: v.optional(v.number()),
            night: v.optional(v.number()),
            customLabel: v.optional(v.string()),
            customPrice: v.optional(v.number()),
        })),
        vesRate: v.optional(v.number()),
        taxiIncluded: v.optional(v.boolean()),
        paymentMethods: v.optional(v.array(v.string())),
        services: v.optional(v.array(v.string())),
        targetAudience: v.optional(v.array(v.string())),
        activePromo: v.optional(v.object({
            label: v.string(),
            description: v.string(),
            isActive: v.boolean(),
        })),
        personalMessage: v.optional(v.string()),

        updatedAt: v.number(),
    }).index("by_tenant", ["tenantId"]),
});
