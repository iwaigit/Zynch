import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Genera un código de 6 dígitos y lo guarda para el correo dado.
 * En una implementación real, aquí se dispararía un correo vía n8n o Resend.
 */
export const generateCode = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const email = args.email.toLowerCase();
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Expiración en 15 minutos
        const expiresAt = Date.now() + 15 * 60 * 1000;

        // Limpiar códigos viejos para este email
        const existing = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", email))
            .collect();

        for (const otp of existing) {
            await ctx.db.delete(otp._id);
        }

        await ctx.db.insert("otps", {
            email,
            code,
            expiresAt,
        });

        // NOTA: Aquí el Admin Maestro recibiría una notificación vía n8n 
        // indicando que un nuevo lead está intentando validar su correo.
        console.log(`Código OTP para ${email}: ${code}`);

        return { success: true, message: "Código enviado al correo (Simulado)" };
    },
});

/**
 * Verifica si el código proporcionado es válido para el correo.
 */
export const verifyCode = mutation({
    args: { email: v.string(), code: v.string() },
    handler: async (ctx, args) => {
        const email = args.email.toLowerCase();

        const validOtp = await ctx.db
            .query("otps")
            .withIndex("by_email", (q) => q.eq("email", email))
            .filter((q) => q.eq(q.field("code"), args.code))
            .first();

        if (!validOtp) {
            throw new Error("Código inválido.");
        }

        if (Date.now() > validOtp.expiresAt) {
            await ctx.db.delete(validOtp._id);
            throw new Error("El código ha expirado.");
        }

        // El código es válido. Se elimina para que solo se use una vez.
        await ctx.db.delete(validOtp._id);

        return { success: true };
    },
});
