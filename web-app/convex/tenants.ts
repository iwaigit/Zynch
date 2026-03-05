import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Registra un nuevo Inquilino (Tenant) en el sistema SaaS.
 * Proceso: Valida OTP -> Crea Tenant (Plan Free 15d) -> Crea Usuario Admin -> Crea SiteConfig Inicial.
 */
export const registerTenant = mutation({
    args: {
        email: v.string(),
        code: v.string(),
        tenantName: v.string(),
        slug: v.string(),
        password: v.string(), // Contraseña para el admin del tenant
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        const email = args.email.toLowerCase();

        // 1. Verificar OTP
        const validOtp = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", email))
            .filter((q) => q.eq(q.field("code"), args.code))
            .first();

        if (!validOtp || Date.now() > validOtp.expiresAt) {
            throw new Error("Código OTP inválido o expirado.");
        }

        // 2. Verificar si el slug ya existe
        const existingTenant = await ctx.db
            .query("tenants")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (existingTenant) {
            throw new Error("El nombre de usuario/slug ya está en uso.");
        }

        // 3. Crear el Inquilino (Tenant) con plan de prueba de 15 días
        const trialDays = 15;
        const tenantId = await ctx.db.insert("tenants", {
            name: args.tenantName,
            slug: args.slug,
            planType: "free",
            status: "trial",
            trialEndsAt: Date.now() + trialDays * 24 * 60 * 60 * 1000,
            createdAt: Date.now(),
        });

        // 4. Crear el Usuario Administrador del Tenant
        const adminId = await ctx.db.insert("users", {
            tenantId,
            email,
            password: args.password.toUpperCase(),
            birthdate: "2000-01-01",
            phone: args.phone,
            isVerified: true,
            role: "admin",
            permissions: ["full_access"],
            createdAt: Date.now(),
        });

        // Actualizar el dueño del tenant
        await ctx.db.patch(tenantId, { ownerId: adminId });

        // 5. Crear la Configuración Inicial Camaleónica
        await ctx.db.insert("siteConfig", {
            tenantId,
            performerName: args.tenantName,
            initials: args.slug.substring(0, 2).toUpperCase(),
            tagline: "¡Bienvenida a mi nuevo sitio Zynch!",
            primaryColor: "#9ead5c",
            secondaryColor: "#be2e57",
            backgroundColor: "#0f0f11",
            contactEmail: email,
            bio: "Configura tu biografía aquí.",
            metaDescription: `Sitio profesional de ${args.tenantName}`,
            socialLinks: {},
            updatedAt: Date.now(),
        });

        // 6. Limpiar OTP
        await ctx.db.delete(validOtp._id);

        // Notificar al Admin Maestro
        await ctx.db.insert("activityLogs", {
            tenantId,
            userId: adminId,
            action: "tenant_onboarding",
            details: `Nuevo inquilino registrado: ${args.tenantName} (${args.slug})`,
            timestamp: Date.now(),
        });

        return { success: true, tenantId };
    },
});

/**
 * Lista todos los inquilinos del sistema SaaS.
 * Exclusivo para el Administrador Maestro.
 */
export const listAll = query({
    args: { masterAdminId: v.id("users") },
    handler: async (ctx, args) => {
        const masterAdmin = await ctx.db.get(args.masterAdminId);
        if (!masterAdmin || masterAdmin.role !== "admin") {
            throw new Error("Acceso denegado: Se requiere rol de Administrador Maestro.");
        }

        const tenants = await ctx.db.query("tenants").collect();
        return Promise.all(
            tenants.map(async (tenant) => {
                const owner = tenant.ownerId ? await ctx.db.get(tenant.ownerId) : null;
                return {
                    ...tenant,
                    ownerEmail: owner?.email,
                    ownerPhone: owner?.phone,
                };
            })
        );
    },
});

/**
 * Obtener estado de suscripción para el banner informativo.
 */
export const getSubscriptionStatus = query({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const tenant = await ctx.db.get(args.tenantId);
        if (!tenant) throw new Error("Tenant no encontrado.");

        const now = Date.now();
        const daysRemaining = tenant.trialEndsAt
            ? Math.ceil((tenant.trialEndsAt - now) / (1000 * 60 * 60 * 24))
            : 0;

        return {
            planType: tenant.planType,
            status: tenant.status,
            daysRemaining: Math.max(0, daysRemaining),
            isExpired: tenant.trialEndsAt ? now > tenant.trialEndsAt : false,
        };
    },
});
