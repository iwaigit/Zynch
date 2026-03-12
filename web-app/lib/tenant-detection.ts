import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

// Cliente Convex para verificación de tenants
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Verificar si un tenant existe y está activo
 */
export async function verifyTenant(slug: string) {
  try {
    const tenant = await convex.query(api.siteConfig.get, { slug }) as any;
    return tenant;
  } catch (error) {
    console.error('Error verifying tenant:', error);
    return null;
  }
}

/**
 * Validar formato de slug de tenant
 */
export function isValidTenantSlug(slug: string): boolean {
  // Solo letras minúsculas, números y guiones
  // Mínimo 3 caracteres, máximo 30
  const slugRegex = /^[a-z0-9-]{3,30}$/;
  return slugRegex.test(slug);
}

/**
 * Obtener información del tenant para el middleware
 */
export async function getTenantInfo(slug: string) {
  if (!isValidTenantSlug(slug)) {
    return null;
  }
  
  const tenant = await verifyTenant(slug);
  
  if (!tenant || tenant.status !== 'active') {
    return null;
  }
  
  return tenant;
}
