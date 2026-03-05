import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Zynch SaaS Proxy & Middleware
 * 
 * Este archivo centraliza:
 * 1. Detección de Tenant (Subdominio o Path)
 * 2. Protección de Rutas Administrativas
 * 3. Reescritura de URLs para Multi-Tenancy
 */

// Dominios públicos
const PUBLIC_DOMAINS = ['localhost', 'zynch.vercel.app'];

// Rutas de sistema que no son tenants
const SYSTEM_PATHS = ['/admin', '/login', '/register', '/onboarding', '/api', '/_next', '/favicon.ico'];

function extractSubdomain(hostname: string): string | null {
    const cleanHostname = hostname.split(':')[0];
    if (cleanHostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(cleanHostname)) return null;

    const parts = cleanHostname.split('.');
    if (parts.length >= 3) {
        const subdomain = parts[0];
        const RESERVED = ['www', 'admin', 'api', 'app'];
        if (!RESERVED.includes(subdomain)) return subdomain.toLowerCase();
    }
    return null;
}

function extractTenantFromPath(pathname: string): string | null {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
        const first = segments[0].toLowerCase();
        if (!SYSTEM_PATHS.some(sys => sys === `/${first}`)) {
            if (/^[a-z0-9-]+$/.test(first) && first.length >= 2) return first;
        }
    }
    return null;
}

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // 1. Detección de Tenant
    let tenantSlug = extractSubdomain(hostname);
    let detectionMethod = 'subdomain';

    if (!tenantSlug && !SYSTEM_PATHS.some(sys => pathname.startsWith(sys))) {
        tenantSlug = extractTenantFromPath(pathname);
        detectionMethod = 'path';
    }

    // 2. Seguridad Administrativa (anterior proxy.ts)
    const auth = request.cookies.get('ks-auth');
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute && !auth && pathname !== '/admin/login') {
        // Permitir login sin auth
        return NextResponse.next();
    }

    // 3. Preparar Respuesta
    const response = NextResponse.next();

    // Inyectar headers para Server Components
    if (tenantSlug) {
        response.headers.set('x-tenant-slug', tenantSlug);
        response.headers.set('x-tenant-detection', detectionMethod);
    } else {
        response.headers.set('x-tenant-slug', 'default');
        response.headers.set('x-tenant-detection', 'fallback');
    }

    // 4. Reescritura de Path si es necesario
    if (detectionMethod === 'path' && tenantSlug) {
        const newPathname = pathname.replace(`/${tenantSlug}`, '') || '/';
        const newUrl = request.nextUrl.clone();
        newUrl.pathname = newPathname;
        return NextResponse.rewrite(newUrl, { headers: response.headers });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};