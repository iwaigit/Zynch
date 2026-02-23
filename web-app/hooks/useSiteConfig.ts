import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { siteConfig as staticConfig } from "@/config/site";

/**
 * Hook para obtener la configuración del sitio desde Convex.
 * Si los datos aún no cargan o hay un error, retorna los valores por defecto.
 */
export function useSiteConfig() {
    const dynamicConfig = useQuery(api.siteConfig.get);

    if (!dynamicConfig) {
        return {
            ...staticConfig,
            isLoading: dynamicConfig === undefined,
        };
    }

    return {
        name: dynamicConfig.performerName,
        tagline: dynamicConfig.tagline,
        description: dynamicConfig.metaDescription,
        bio: dynamicConfig.bio,
        logo: dynamicConfig.logoUrl,
        links: {
            instagram: dynamicConfig.socialLinks.instagram || "",
            twitter: dynamicConfig.socialLinks.twitter || "",
            onlyfans: dynamicConfig.socialLinks.onlyfans || "",
            tiktok: dynamicConfig.socialLinks.tiktok || "",
        },
        email: dynamicConfig.contactEmail,
        colors: {
            primary: dynamicConfig.primaryColor,
            secondary: dynamicConfig.secondaryColor,
        },
        isLoading: false,
    };
}
