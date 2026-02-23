import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Registrar un nuevo prospecto (Lead)
export const register = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        birthdate: v.string(),
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        // Obtenemos la configuración para las iniciales del nombre
        const config = await ctx.db.query("siteConfig").first();
        const initials = config ? config.performerName.split(' ').map(n => n[0]).join('').toUpperCase() : "KS";

        // Check if email already exists
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .unique();

        if (existingUser) {
            throw new Error("Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo.");
        }

        // Validate age (18+)
        const birthDate = new Date(args.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            throw new Error("Debes tener al menos 18 años para registrarte.");
        }

        if (age > 120) {
            throw new Error("Por favor verifica tu fecha de nacimiento.");
        }

        // Validate password format (Initials + 5 digits)
        const passwordRegex = new RegExp(`^${initials}\\d{5}$`);
        if (!passwordRegex.test(args.password)) {
            throw new Error(`La contraseña debe ser ${initials} seguido de 5 dígitos (ej: ${initials}12345).`);
        }

        // Validate phone format (international)
        if (!/^\+\d{10,15}$/.test(args.phone)) {
            throw new Error("El teléfono debe estar en formato internacional: +código_país + número (ej: +584121234567)");
        }

        // Insert user
        const userId = await ctx.db.insert("users", {
            email: args.email.toLowerCase(),
            password: args.password,
            birthdate: args.birthdate,
            phone: args.phone,
            isVerified: false,
            role: "client",
            createdAt: Date.now(),
        });

        // Log de Actividad: Registro
        await ctx.db.insert("activityLogs", {
            userId,
            action: "user_registered",
            details: `Nuevo usuario registrado: ${args.email} con teléfono ${args.phone}`,
            timestamp: Date.now(),
        });

        return userId;
    },
});

// Login de usuario (changed to mutation to prevent auto-execution)
export const login = mutation({
    args: {
        email: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .unique();

        if (!user || user.password !== args.password.toUpperCase()) {
            throw new Error("Credenciales inválidas.");
        }

        // Log activity
        await ctx.db.insert("activityLogs", {
            userId: user._id,
            action: "user_login",
            details: `Usuario ${user.email} inició sesión`,
            timestamp: Date.now(),
        });

        return { id: user._id, email: user.email, role: user.role, permissions: user.permissions };
    },
});

// Log user login (called after successful login)
export const logLogin = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return;

        await ctx.db.insert("activityLogs", {
            userId: args.userId,
            action: "user_login",
            details: `Usuario ${user.email} inició sesión`,
            timestamp: Date.now(),
        });
    },
});

// Grant role to user (Admin only)
export const grantRole = mutation({
    args: {
        adminId: v.id("users"),
        targetUserId: v.id("users"),
        newRole: v.string(),
        permissions: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        // Verify admin permissions
        const admin = await ctx.db.get(args.adminId);
        if (!admin || admin.role !== "admin") {
            throw new Error("Solo los administradores pueden otorgar roles.");
        }

        // Validate role
        const validRoles = ["admin", "promoter", "vip", "client"];
        if (!validRoles.includes(args.newRole)) {
            throw new Error("Rol inválido.");
        }

        // Update user role
        await ctx.db.patch(args.targetUserId, {
            role: args.newRole,
            permissions: args.permissions,
        });

        // Log activity
        await ctx.db.insert("activityLogs", {
            userId: args.targetUserId,
            action: "role_granted",
            details: `Admin ${admin.email} otorgó el rol '${args.newRole}' al usuario`,
            timestamp: Date.now(),
        });

        return true;
    },
});

// Solicitar recuperación de clave (Simulado: en realidad enviaría un email)
export const requestPasswordReset = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (!user) {
            throw new Error("El correo no está registrado.");
        }

        // Aquí generaríamos un código y lo enviaríamos por correo
        console.log(`Enviando código de recuperación a ${args.email}`);
        return true;
    },
});

// Obtener usuario por email (para login futuro)
export const getUserByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});

// TEMPORARY: Create initial admin user (delete after use)
export const createAdminUser = mutation({
    args: {
        email: v.string(),
        password: v.string(), // Format: KSXXXXX
        birthdate: v.string(),
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if admin already exists
        const existingAdmin = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "admin"))
            .first();

        if (existingAdmin) {
            throw new Error("Ya existe un usuario admin. Elimina esta mutación después de crear el admin inicial.");
        }

        // Validate password format
        const config = await ctx.db.query("siteConfig").first();
        const initials = config ? config.performerName.split(' ').map(n => n[0]).join('').toUpperCase() : "KS";
        const passwordRegex = new RegExp(`^${initials}\\d{5}$`);
        if (!passwordRegex.test(args.password)) {
            throw new Error(`La contraseña debe empezar por '${initials}' seguido de 5 números.`);
        }

        // Insert admin user
        const adminId = await ctx.db.insert("users", {
            email: args.email,
            password: args.password,
            birthdate: args.birthdate,
            phone: args.phone,
            isVerified: true,
            role: "admin",
            permissions: ["grant_roles", "view_logs", "manage_calendar", "full_access"],
            createdAt: Date.now(),
        });

        // Log activity
        await ctx.db.insert("activityLogs", {
            userId: adminId,
            action: "admin_created",
            details: `Usuario admin creado: ${args.email}`,
            timestamp: Date.now(),
        });

        return adminId;
    },
});

// Obtener usuario por ID
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// Verificar si un usuario está verificado
export const isUserVerified = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return false;
        return user.isVerified === true;
    },
});

// Actualizar estado de verificación
export const markUserAsVerified = mutation({
    args: {
        userId: v.id("users"),
        birthdate: v.string()
    },
    handler: async (ctx, args) => {
        const birthDate = new Date(args.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            throw new Error("Debes tener al menos 18 años.");
        }

        await ctx.db.patch(args.userId, {
            isVerified: true,
            birthdate: args.birthdate
        });

        return true;
    },
});

