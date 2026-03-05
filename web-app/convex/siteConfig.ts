import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireTenantAccess, requireStaff } from "./permissions";

const statSchema = v.object({
    label: v.string(),
    value: v.number(),
    color: v.string(),
});

const DEFAULT_STATS = [
    { label: "Encanto", value: 95, color: "#be2e57" },
    { label: "Estilo", value: 98, color: "#9ead5c" },
    { label: "Energía", value: 92, color: "#fff300" },
    { label: "Misterio", value: 88, color: "#bd00ff" },
];

/**
 * Genera una URL de subida para las fotos de perfil en Convex Storage.
 * Solo usuarios autenticados del tenant pueden generar URLs.
 */
export const generateProfileImageUploadUrl = mutation({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        await requireStaff(ctx, args.tenantId);
        return await ctx.storage.generateUploadUrl();
    },
});

/**
 * Guarda el storageId de una foto de perfil en la posición indicada (0 o 1).
 * Solo staff del tenant puede modificar fotos de perfil.
 */
export const saveProfileImage = mutation({
    args: {
        tenantId: v.id("tenants"),
        storageId: v.id("_storage"),
        index: v.number(), // 0 = primera, 1 = segunda
    },
    handler: async (ctx, args) => {
        // Verificar que el usuario sea staff del tenant
        await requireStaff(ctx, args.tenantId);

        const existing = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .first();
        if (!existing) throw new Error("Configuración del inquilino no encontrada.");

        const currentIds: (Id<"_storage"> | null)[] = [
            ...(existing.profileImageIds || [null, null]),
        ];

        const oldId = currentIds[args.index];
        if (oldId) {
            try { await ctx.storage.delete(oldId); } catch { /* ignorar */ }
        }

        while (currentIds.length <= args.index) currentIds.push(null);
        currentIds[args.index] = args.storageId;

        await ctx.db.patch(existing._id, {
            profileImageIds: currentIds.filter((id): id is Id<"_storage"> => id !== null),
            updatedAt: Date.now(),
        });
    },
});

/**
 * Elimina una foto de perfil del storage.
 */
export const deleteProfileImage = mutation({
    args: {
        tenantId: v.id("tenants"),
        index: v.number()
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .first();
        if (!existing) return;

        const currentIds = [...(existing.profileImageIds || [])];
        const idToDelete = currentIds[args.index];
        if (idToDelete) {
            try { await ctx.storage.delete(idToDelete); } catch { /* ignorar */ }
            currentIds.splice(args.index, 1);
            await ctx.db.patch(existing._id, {
                profileImageIds: currentIds,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Obtiene la configuración actual del sitio por slug o fallback.
 */
export const get = query({
    args: { slug: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let tenant;
        if (args.slug) {
            tenant = await ctx.db
                .query("tenants")
                .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
                .first();
        } else {
            tenant = await ctx.db.query("tenants").first();
        }

        if (!tenant) return null;

        const config = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant!._id))
            .first();
        if (!config) return null;

        let resolvedProfileImages = [...(config.profileImages || [])];
        if (config.profileImageIds && config.profileImageIds.length > 0) {
            const storageUrls = await Promise.all(
                config.profileImageIds.map(id => ctx.storage.getUrl(id))
            );
            resolvedProfileImages = storageUrls.filter((url): url is string => url !== null);
        }

        return {
            ...config,
            profileImages: resolvedProfileImages,
        };
    },
});

/**
 * Actualiza la configuración del sitio.
 */
export const update = mutation({
    args: {
        tenantId: v.id("tenants"),
        performerName: v.string(),
        tagline: v.string(),
        profileImages: v.array(v.string()),
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
        height: v.optional(v.string()),
        eyeColor: v.optional(v.string()),
        locations: v.optional(v.array(v.string())),
        weight: v.optional(v.string()),
        stats: v.optional(v.array(statSchema)),
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
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .first();
        const { tenantId, ...rest } = args;
        if (existing) {
            await ctx.db.patch(existing._id, { ...rest, updatedAt: Date.now() });
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", { ...args, updatedAt: Date.now() });
        }
    },
});

/**
 * Inicializa un inquilino con valores por defecto.
 */
export const initialize = mutation({
    args: { name: v.string(), slug: v.string() },
    handler: async (ctx, args) => {
        let tenant = await ctx.db
            .query("tenants")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!tenant) {
            const tenantId = await ctx.db.insert("tenants", {
                name: args.name,
                slug: args.slug,
                planType: "free",
                status: "active",
                createdAt: Date.now(),
            });
            tenant = await ctx.db.get(tenantId);
        }

        const existing = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenant!._id))
            .first();

        if (existing) return existing._id;

        return await ctx.db.insert("siteConfig", {
            ...getDefaults(tenant!._id),
            tenantId: tenant!._id,
            performerName: tenant!.name,
        });
    },
});

export const resetToDefaults = mutation({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("siteConfig")
            .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
            .first();
        const defaults = { ...getDefaults(args.tenantId), profileImageIds: undefined };

        if (existing?.profileImageIds) {
            await Promise.all(
                existing.profileImageIds.map(id =>
                    ctx.storage.delete(id).catch(() => { /* ignorar */ })
                )
            );
        }

        if (existing) {
            await ctx.db.patch(existing._id, defaults);
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", { ...defaults, tenantId: args.tenantId });
        }
    },
});

function getDefaults(tenantId: Id<"tenants">) {
    return {
        tenantId,
        performerName: "Performer Name",
        tagline: "Official Site",
        profileImages: [
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop"
        ],
        primaryColor: "#be2e57",
        secondaryColor: "#9ead5c",
        backgroundColor: "#0f0f11",
        socialLinks: { instagram: "", twitter: "", onlyfans: "", tiktok: "" },
        contactEmail: "contact@domain.fun",
        bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
        metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
        height: "1.68m",
        eyeColor: "Café",
        locations: ["Caracas"],
        weight: "55kg",
        stats: DEFAULT_STATS,
        schedule: { is24h: true, workingDays: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"] },
        pricing: { h1: 100, h2: 180, night: 500 },
        vesRate: 40,
        taxiIncluded: false,
        paymentMethods: ["Ca$h", "Pago móvil", "Zelle"],
        services: ["Trato de Novia", "Cita Social", "Masajes Relajantes"],
        targetAudience: ["Hombres"],
        activePromo: { label: "Promo Apertura", description: "1 Hora c/taxi incluido en zona céntrica", isActive: false },
        personalMessage: "¡Contáctame para una experiencia inolvidable!",
        updatedAt: Date.now(),
    };
}
