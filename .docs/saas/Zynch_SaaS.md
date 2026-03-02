# Arquitectura del Núcleo Zynch SaaS 🦎

**Zynch** es una plataforma SAAS multi-inquilino de marca blanca diseñada para proveedores de servicios personales. Utiliza un enfoque "Camaleónico" donde una única base de código maneja múltiples identidades de forma transparente.

## 🏗️ Pilares Técnicos

1.  **Multi-Tenancy (Aislamiento de Datos)**:
    - Cada entrada en la base de datos en Convex está vinculada a un `tenantId`.
    - El sistema utiliza una configuración dinámica `siteConfig` que actúa como el cerebro de cada inquilino.

2.  **Interfaz Camaleónica**:
    - El frontend (`web-app`) está completamente desacoplado de cualquier nombre o marca específica de cliente.
    - Los componentes utilizan propiedades y hooks (`useSiteConfig`) para renderizar los datos de forma dinámica.

3.  **Procesamiento Automático (IWAI Core)**:
    - Compresión de imágenes integrada, marcas de agua y renombrado secuencial de archivos (`ZNF_XX`).
    - Gestión automatizada de citas y seguimiento de pedidos.

## 👥 Gestión de Inquilinos
Para añadir un nuevo inquilino (cliente) al ecosistema Zynch:
1.  Inicializar una nueva entrada de `siteConfig` en Convex.
2.  Asignar un prefijo de `initials` único (ej: `ZN`, `KS`, `MB`).
3.  El sistema generará automáticamente el entorno de frontend basado en estos parámetros.

---
*Potenciado por IWAI - Automated Processes*
