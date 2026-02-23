/**
 * Configuración estática por defecto del sitio.
 * Estos valores se usan como fallback mientras carga Convex
 * o si no hay datos en la BD.
 */
export const siteConfig = {
    name: "Karla Spice",
    tagline: "Official Site",
    description: "Official digital platform of Karla Spice. Exclusive content, personalized experiences, and direct connection.",
    links: {
        instagram: "https://instagram.com/karlaspice",
        twitter: "https://twitter.com/karlaspice",
        onlyfans: "https://onlyfans.com/karlaspice",
        tiktok: "",
    },
    email: "contact@karlaspice.fun",
    colors: {
        primary: "#ff2d75",   // Neon Pink
        secondary: "#00f3ff", // Neon Cyan
        background: "#0a0a0a",
    }
};

export type SiteConfig = typeof siteConfig;
