# Zynch SaaS Core Architecture 🦎

**Zynch** is a multi-tenant, white-label platform designed for personal service providers. It uses a "Camaleonic" approach where a single codebase handles multiple identities seamlessly.

## 🏗️ Technical Pillars

1.  **Multi-Tenancy (Data Isolation)**:
    - Every database entry in Convex should ideally be linked to a `tenantId` (under development).
    - Currently, the system uses a global `siteConfig` that acts as the "Active Tenant" configuration.

2.  **Camaleonic UI**:
    - The frontend (`web-app`) is completely decoupled from any specific client name or brand.
    - Components like `AboutPerformer.tsx` use props and hooks (`useSiteConfig`) to render data dynamically.

3.  **Automatic Processing (IWAI Core)**:
    - Built-in image compression, watermarking, and sequentially renamed files (`ZNF_XX`).
    - Automated appointment scheduling and order tracking.

## 👥 Tenant Management
To add a new tenant (client) to the Zynch ecosystem:
1.  Initialize a new `siteConfig` entry in Convex.
2.  Assign a unique `initials` prefix (e.g., `ZN`, `KS`, `MB`).
3.  The system will automatically generate the frontend environment based on those parameters.

---
*Powered by IWAI - Automated Processes*
