/**
 * Translate technical error messages to user-friendly Spanish messages
 */
export function translateError(error: string): string {
    // Remove Convex technical prefixes
    const cleanError = error.replace(/\[CONVEX [^\]]+\]\s*/g, '').replace(/\[Request ID: [^\]]+\]\s*/g, '');

    // Email errors
    if (cleanError.includes('email') || cleanError.includes('correo')) {
        if (cleanError.includes('ya está registrado') || cleanError.includes('already exists')) {
            return '📧 Este correo ya tiene una cuenta. Por favor inicia sesión o usa otro correo.';
        }
        if (cleanError.includes('inválido') || cleanError.includes('invalid')) {
            return '📧 El formato del correo es incorrecto. Verifica que incluya el símbolo @ y un dominio válido.';
        }
    }

    // Password errors
    if (cleanError.includes('contraseña') || cleanError.includes('password') || cleanError.includes('clave')) {
        if (cleanError.includes('dígitos') || cleanError.includes('números')) {
            return `🔑 La contraseña debe comenzar con tus iniciales seguidas de 5 números.`;
        }
    }

    // Phone errors
    if (cleanError.includes('teléfono') || cleanError.includes('phone') || cleanError.includes('WhatsApp')) {
        if (cleanError.includes('formato') || cleanError.includes('internacional')) {
            return '📱 El teléfono debe incluir el código de país. Ejemplo: +584121234567';
        }
        if (cleanError.includes('corto') || cleanError.includes('largo')) {
            return '📱 El número de teléfono no tiene la longitud correcta. Verifica que sea un número válido.';
        }
    }

    // Age errors
    if (cleanError.includes('edad') || cleanError.includes('años') || cleanError.includes('age') || cleanError.includes('birthdate')) {
        if (cleanError.includes('18')) {
            return '🎂 Debes ser mayor de 18 años para registrarte en esta plataforma.';
        }
        if (cleanError.includes('fecha') || cleanError.includes('verifica')) {
            return '🎂 La fecha de nacimiento no es válida. Por favor verifica que sea correcta.';
        }
    }

    // Login errors
    if (cleanError.includes('Credenciales inválidas') || cleanError.includes('Invalid credentials')) {
        return '🔐 El correo o la contraseña son incorrectos. Verifica tus datos e intenta nuevamente.';
    }

    // Generic fallback - clean up any remaining technical jargon
    const userFriendlyError = cleanError
        .replace(/Server Error/gi, '')
        .replace(/Uncaught Error:/gi, '')
        .replace(/at handler/gi, '')
        .replace(/Called by client/gi, '')
        .trim();

    // If we still have a clean message from backend, use it
    if (userFriendlyError && !userFriendlyError.includes('convex') && !userFriendlyError.includes('handler')) {
        return `⚠️ ${userFriendlyError}`;
    }

    // Ultimate fallback
    return '⚠️ Hubo un problema al procesar tu solicitud. Por favor verifica tus datos e intenta nuevamente.';
}
