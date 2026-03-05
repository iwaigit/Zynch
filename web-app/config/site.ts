/**
 * Configuración estática por defecto del sitio.
 * Estos valores se usan como fallback mientras carga Convex
 * o si no hay datos en la BD.
 */
export const siteConfig = {
    name: "Zynch by iwai",
    tagline: "Premium Personal Service Platform",
    description: "Zynch by iwai is a professional digital platform for personal services. Exclusive content, automated appointment management, and direct connection.",
    bio: "Zynch by iwai is a professional digital platform for personal services. Exclusive content, automated appointment management, and direct connection.",
    links: {
        instagram: "",
        twitter: "",
        onlyfans: "",
        tiktok: "",
    },
    email: "contact@iwai.work",
    colors: {
        primary: "#be2e57",   // Zynch Pink/Red
        secondary: "#9ead5c", // Zynch Green
        background: "#312a30",
    }
};

export type SiteConfig = typeof siteConfig;
