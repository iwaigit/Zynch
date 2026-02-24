import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { siteConfig as staticConfig } from "@/config/site";

const DEFAULT_STATS = [
    { label: "Encanto", value: 95, color: "#ff2d75" },
    { label: "Estilo", value: 98, color: "#00f3ff" },
    { label: "Energía", value: 92, color: "#fff300" },
    { label: "Misterio", value: 88, color: "#bd00ff" },
];

/**
 * Hook para obtener la configuración del sitio desde Convex.
 */
export function useSiteConfig(slug?: string) {
    const dynamicConfig = useQuery(api.siteConfig.get, { slug });

    const name = dynamicConfig?.performerName || staticConfig.name;
    const initials = dynamicConfig?.initials || name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    if (!dynamicConfig) {
        return {
            ...staticConfig,
            initials,
            profileImages: [],
            height: "1.68m",
            eyeColor: "Café",
            locations: ["Caracas"],
            weight: "N/A",
            stats: DEFAULT_STATS,
            schedule: { is24h: true, workingDays: [] },
            pricing: { h1: 0 },
            vesRate: 0,
            taxiIncluded: false,
            paymentMethods: [] as string[],
            services: [] as string[],
            targetAudience: ["Hombres"],
            activePromo: { label: "", description: "", isActive: false },
            personalMessage: "",
            backgroundColor: "#0d0d12",
            tenantId: undefined,
            isLoading: dynamicConfig === undefined,
        };
    }

    return {
        name,
        initials,
        tagline: dynamicConfig.tagline,
        description: dynamicConfig.metaDescription,
        bio: dynamicConfig.bio,
        profileImages: dynamicConfig.profileImages || [],
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
            background: dynamicConfig.backgroundColor || "#0d0d12",
        },
        backgroundColor: dynamicConfig.backgroundColor || "#0d0d12",
        // Físico
        height: dynamicConfig.height || "N/A",
        eyeColor: dynamicConfig.eyeColor || "N/A",
        locations: dynamicConfig.locations || ["Caracas"],
        weight: dynamicConfig.weight || "N/A",
        // Stats
        stats: dynamicConfig.stats || DEFAULT_STATS,
        // Servicio
        schedule: dynamicConfig.schedule || { is24h: true, workingDays: [] },
        pricing: dynamicConfig.pricing || { h1: 0 },
        vesRate: dynamicConfig.vesRate || 0,
        taxiIncluded: dynamicConfig.taxiIncluded ?? false,
        paymentMethods: dynamicConfig.paymentMethods || [],
        services: dynamicConfig.services || [],
        targetAudience: dynamicConfig.targetAudience || ["Hombres"],
        activePromo: dynamicConfig.activePromo || { label: "", description: "", isActive: false },
        personalMessage: dynamicConfig.personalMessage || "",
        tenantId: dynamicConfig.tenantId,
        isLoading: false,
    };
}
