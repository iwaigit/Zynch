import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name + " | " + siteConfig.tagline,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: 'Zynch by iwai',
    description: 'Eleva tu carrera profesional con nuestra infraestructura modular segura.',
    url: 'https://zynch.app',
    siteName: 'Zynch',
    images: [
      {
        url: 'https://zynch.app/.assets/zynch.png', 
        width: 800,
        height: 600,
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico', // O apple-touch-icon.png si prefieres
  },
  robots: "index, follow", // Cambiado de noindex para empezar a posicionar
};

import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import UniversalCart from "@/components/UniversalCart";
import SubscriptionBanner from "@/components/SaaS/SubscriptionBanner";
import PoweredByFooter from "@/components/SaaS/PoweredByFooter";
import FloatingHeader from "@/components/SaaS/FloatingHeader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener headers del middleware (tenant detection)
  const headersList = await headers();
  const tenantSlug = headersList.get('x-tenant-slug') || 'default';
  const tenantDetection = headersList.get('x-tenant-detection') || 'fallback';

  return (
    <html lang="es">
      <head>
        {/* Inyectar tenant info para que useTenant() lo lea en cliente */}
        <meta name="x-tenant-slug" content={tenantSlug} />
        <meta name="x-tenant-detection" content={tenantDetection} />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
        <ConvexClientProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <FloatingHeader />
                <SubscriptionBanner />
                {children}
                <UniversalCart />
                <PoweredByFooter />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}