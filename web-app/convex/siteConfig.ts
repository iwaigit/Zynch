import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Obtiene la configuración actual del sitio.
 * Retorna null si no hay ninguna configuración creada.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const config = await ctx.db.query("siteConfig").first();
        return config;
    },
});

/**
 * Actualiza la configuración del sitio o la crea si no existe.
 * Solo puede ser ejecutada por un admin (pendiente integración con roles).
 */
export const update = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("siteConfig").first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                ...args,
                updatedAt: Date.now(),
            });
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", {
                ...args,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Inicializa la configuración con los datos de Karla Spice (Seed).
 */
export const initialize = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        if (existing) return existing._id;

        return await ctx.db.insert("siteConfig", {
            performerName: "Performer Name",
            tagline: "Official Site",
            primaryColor: "#ff2d75", // Neon Pink
            secondaryColor: "#00f3ff", // Neon Cyan
            socialLinks: {
                instagram: "",
                twitter: "",
                onlyfans: "",
            },
            contactEmail: "contact@domain.fun",
            bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
            metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
            updatedAt: Date.now(),
        });
    },
});
/**
 * Fuerza el reset de la configuración a los valores de marca blanca por defecto.
 */
export const resetToDefaults = mutation({
    args: {},
    handler: async (ctx) => {
        const existing = await ctx.db.query("siteConfig").first();
        const defaults = {
            performerName: "Performer Name",
            tagline: "Official Site",
            primaryColor: "#ff2d75",
            secondaryColor: "#00f3ff",
            socialLinks: {
                instagram: "",
                twitter: "",
                onlyfans: "",
            },
            contactEmail: "contact@domain.fun",
            bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
            metaDescription: "Official Site - Exclusive Gallery, Content Packs and more.",
            updatedAt: Date.now(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, defaults);
            return existing._id;
        } else {
            return await ctx.db.insert("siteConfig", defaults);
        }
    },
});
