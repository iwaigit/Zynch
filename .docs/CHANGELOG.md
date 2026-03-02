# Historial de Cambios - Zynch by iwai 🦎

Todos los cambios notables en este proyecto serán documentados en este archivo. El formato se basa en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc.1] - 2026-03-02 [LATEST]

### Añadido
- **AI Orchestrator**: Integración de sistema de agentes de IA para auditoría de seguridad y cumplimiento.
- **Estructura de Documentación**: Creación de carpetas organizadas para inquilinos (`.docs/tenants/`) y referencias técnicas.
- **Sistema de Versiones**: Implementación formal de versionado y changelog.

### Cambiado
- **Identidad Visual**: Transición a marca blanca (White-Label) neutralizando referencias directas a "Karla Spice" en el núcleo del sistema.
- **Next.js 16 & React 19**: Actualización de dependencias clave para mayor rendimiento y uso de Server Components modernos.
- **Infraestructura Convex**: El proyecto ha sido renombrado y re-vinculado como `iwai-zynch` para alinearse con la identidad corporativa.

### Corregido
- **Organización del Repositorio**: Movidos archivos de imagen y benchmark del directorio raíz a carpetas de documentación específicas.
- **Traducción**: El `README.md` principal ha sido traducido y expandido en español.

### Seguridad
- **Aislamiento Multi-tenant**: Parches críticos en `users.ts`, `appointments.ts`, `products.ts` y `orders.ts` para asegurar que los datos estén estrictamente aislados por `tenantId`.
- **Login Protegido**: Implementación de búsqueda de usuario por `tenantId` + `email`, permitiendo el mismo correo en diferentes inquilinos de forma segura.
- **Validación de Propiedad**: Todas las mutaciones de pedidos y citas ahora validan la propiedad del inquilino antes de ejecutar cambios.

---
[Arriba](#historial-de-cambios---zynch-by-iwai-)
