/**
 * Configuración estática por defecto del sitio.
 * Estos valores se usan como fallback mientras carga Convex
 * o si no hay datos en la BD.
 */
export const siteConfig = {
    name: "Performer Name",
    tagline: "Official Site",
    description: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
    bio: "Official digital platform. Exclusive content, personalized experiences, and direct connection.",
    links: {
        instagram: "",
        twitter: "",
        onlyfans: "",
        tiktok: "",
    },
    email: "contact@domain.fun",
    colors: {
        primary: "#ff2d75",   // Neon Pink
        secondary: "#00f3ff", // Neon Cyan
        background: "#0a0a0a",
    }
};

export type SiteConfig = typeof siteConfig;
