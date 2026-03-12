'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

/**
 * Hook para detectar y acceder al tenant actual
 * 
 * Usa el header x-tenant-slug inyectado por el middleware
 * y obtiene la configuración del tenant desde Convex.
 * 
 * @example
 * const { tenantSlug, siteConfig, isLoading, error } = useTenant();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * 
 * return <h1>{siteConfig.performerName}</h1>;
 */

interface UseTenantReturn {
  /** Slug del tenant detectado (ej: 'karla-spice') */
  tenantSlug: string | null;
  /** 
   * Método de detección usado:
   * - 'subdomain': karla-spice.zynch.app
   * - 'path': zynch.app/karla-spice
   * - 'fallback': tenant por defecto
   * - 'error': no se pudo detectar
   */
  detectionMethod: 'subdomain' | 'path' | 'fallback' | 'error';
  /** Configuración del sitio desde Convex */
  siteConfig: typeof api.siteConfig.get._returnType | null;
  /** Indica si está cargando la configuración */
  isLoading: boolean;
  /** Error si no se encontró el tenant */
  error: Error | null;
}

/**
 * Extrae el tenant slug de las headers inyectadas por el middleware
 * Esto funciona tanto en server como client side
 */
function getTenantFromMeta(): { slug: string | null; method: UseTenantReturn['detectionMethod'] } {
  // Intentar obtener de meta tags (seteado por el server)
  if (typeof document !== 'undefined') {
    const metaSlug = document.querySelector('meta[name="x-tenant-slug"]')?.getAttribute('content');
    const metaMethod = document.querySelector('meta[name="x-tenant-detection"]')?.getAttribute('content') as UseTenantReturn['detectionMethod'];
    
    if (metaSlug) {
      return { slug: metaSlug, method: metaMethod || 'fallback' };
    }
  }
  
  // Fallback: extraer del hostname actual
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Si hay subdominio y no es localhost
    if (parts.length >= 3 && parts[0] !== 'www') {
      return { slug: parts[0], method: 'subdomain' };
    }
    
    // Extraer del path
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      return { slug: pathSegments[0], method: 'path' };
    }
  }
  
  return { slug: null, method: 'error' };
}

export function useTenant(): UseTenantReturn {
  const [tenantInfo, setTenantInfo] = useState<{ slug: string | null; method: UseTenantReturn['detectionMethod'] }>({
    slug: null,
    method: 'fallback',
  });
  
  // Detectar tenant en mount
  useEffect(() => {
    let isMounted = true;
    let info = null;
    info = getTenantFromMeta();
    if (isMounted && info) {
      setTenantInfo(info);
    }
    return () => { isMounted = false; };
  }, []);
  
  // Query a Convex para obtener la config del tenant
  const siteConfig = useQuery(
    api.siteConfig.get,
    tenantInfo.slug ? { slug: tenantInfo.slug } : 'skip'
  );
  
  // Determinar estado de carga
  const isLoading = tenantInfo.slug !== null && siteConfig === undefined;
  
  // Manejar error si el tenant no existe
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    let errorToSet = null;
    
    if (siteConfig === null && tenantInfo.slug) {
      errorToSet = new Error(`Tenant "${tenantInfo.slug}" no encontrado`);
    } else {
      errorToSet = null;
    }
    
    if (isMounted) {
      setError(errorToSet);
    }
    return () => { isMounted = false; };
  }, [siteConfig, tenantInfo.slug]);
  
  return {
    tenantSlug: tenantInfo.slug,
    detectionMethod: tenantInfo.method,
    siteConfig: siteConfig || null,
    isLoading,
    error,
  };
}

/**
 * Hook más simple que solo devuelve el slug del tenant
 * Útil cuando solo necesitas el ID sin la config completa
 */
export function useTenantSlug(): string | null {
  const [slug, setSlug] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    let info = null;
    info = getTenantFromMeta();
    if (isMounted && info) {
      setSlug(info.slug);
    }
    return () => { isMounted = false; };
  }, []);
  
  return slug;
}

/**
 * Verifica si estamos en modo "fallback" (sin tenant específico)
 */
export function useIsDefaultTenant(): boolean {
  const { detectionMethod } = useTenant();
  return detectionMethod === 'fallback';
}
