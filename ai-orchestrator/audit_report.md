# Reporte de Auditoría de Seguridad Zynch

**SAAS ARCHITECTURE AUDIT REPORT: DATA ISOLATION & TENANCY COMPLIANCE**
**Project:** White-Label SaaS Platform (Convex Backend)
**Auditor:** SaaS Architecture Auditor (Senior Architect, Multi-tenant Specialization)
**Status:** COMPLIANCE REVIEW COMPLETED
**Audit Date:** May 22, 2024

---

### **EXECUTIVE SUMMARY**
The backend modules in the `convex/` directory have been audited for multi-tenant data isolation. The primary focus was the presence of `tenantId` in all query/mutation arguments, the enforcement of index-based filtering to prevent cross-tenant data leakage, and the validation of `tenantId` ownership during write operations.

---

### **1. FILE: `convex/users.ts`**
**Status: [NON-COMPLIANT]**

*   **Function: `login`**
    *   **Audit Finding:** The query performs a lookup using only the `email` field: `db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first()`.
    *   **Security Gap:** **CRITICAL.** In a white-label SaaS, the same email might exist across different tenants (e.g., a consultant using the same email for multiple clients). This allows for cross-tenant authentication bypass.
    *   **Required Fix:** Update index to a composite index `[tenantId, email]` and filter by both.

*   **Function: `register`**
    *   **Audit Finding:** Correctly accepts `tenantId`. However, it lacks a check to see if the `tenantId` provided in the arguments exists in the `tenants` table.
    *   **Security Gap:** **MEDIUM.** Risk of "Orphaned Tenants" or registration into unauthorized namespaces.

*   **Function: `createAdminUser`**
    *   **Audit Finding:** `tenantId` is assigned manually.
    *   **Security Gap:** **LOW.** Ensure this function is only callable by a "System Super Admin" or verified via an internal `auth` check that validates the requester's permission to create admins for that specific `tenantId`.

---

### **2. FILE: `convex/appointments.ts`**
**Status: [PARTIALLY COMPLIANT]**

*   **Function: `getAppointments`**
    *   **Audit Finding:** Uses `db.query("appointments").filter((q) => q.eq(q.field("tenantId"), args.tenantId)).collect()`.
    *   **Security Gap:** **SCALABILITY RISK.** This is using a full-table scan (filter) rather than an index-based lookup. As the platform grows, this will cause latency spikes and increased compute costs.
    *   **Required Fix:** Implement `withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))`.

*   **Function: `createAppointment`**
    *   **Audit Finding:** Correctly includes `tenantId` in the document.
    *   **Security Gap:** **NONE.** (Confirmed isolation at insertion).

*   **Function: `updateAppointment`**
    *   **Audit Finding:** The mutation fetches the appointment by `_id` and then modifies it. It does *not* verify that the `appointment._id` belongs to the `args.tenantId` before the update.
    *   **Security Gap:** **HIGH.** An authenticated user from Tenant A could potentially guess or scrape an ID for Tenant B and update their appointments via the API.

---

### **3. FILE: `convex/gallery.ts`**
**Status: [COMPLIANT]**

*   **Function: `listPhotos`**
    *   **Audit Finding:** Correctly uses `tenantId` with an indexed query.
*   **Function: `uploadPhoto`**
    *   **Audit Finding:** Metadata document includes `tenantId`.
*   **Isolation Check:** Assets are isolated. Ensure that the `storageId` returned by Convex is only accessible through the tenant-filtered metadata query.

---

### **4. FILES: `convex/orders.ts` & `convex/products.ts`**
**Status: [NON-COMPLIANT]**

*   **Module: `products.ts` (Catalog Isolation)**
    *   **Function: `getProductById`**
    *   **Audit Finding:** Function takes `productId` and returns the doc. It does **not** take or check `tenantId`.
    *   **Security Gap:** **HIGH.** A user from Tenant A can view Tenant B’s private pricing or product specs if they have the ID.

*   **Module: `orders.ts` (Transaction Isolation)**
    *   **Function: `placeOrder`**
    *   **Audit Finding:** The function verifies the user but does not verify that the `productIds` in the cart actually belong to the same `tenantId` as the user.
    *   **Security Gap:** **CRITICAL.** Cross-tenant transaction leakage. A user could theoretically purchase a product from a different tenant's catalog at a different price point.

---

### **5. FILE: `convex/crm.ts`**
**Status: [COMPLIANT]**

*   **Function: `getClientProfile` / `listClients`**
    *   **Audit Finding:** All functions strictly require `tenantId` and use `withIndex`. 
    *   **Function: `addNoteToClient`**
    *   **Audit Finding:** Implements a double-check: verifies the `clientId` exists and that `client.tenantId === args.tenantId`.
    *   **Architecture Note:** This is the gold standard for the rest of the backend.

---

### **FINAL AUDIT SUMMARY & REMEDIATION TICKETS**

| Function | File | Issue | Severity |
| :--- | :--- | :--- | :--- |
| `login` | `users.ts` | Global email lookup (Missing `tenantId` in index) | **CRITICAL** |
| `updateAppointment` | `appointments.ts` | Missing ID ownership validation | **HIGH** |
| `getAppointments` | `appointments.ts` | Filter instead of Index (Scalability) | **LOW** |
| `getProductById` | `products.ts` | Cross-tenant data exposure via ID guessing | **HIGH** |
| `placeOrder` | `orders.ts` | Cross-tenant product injection in cart | **CRITICAL** |

**AUDITOR RECOMMENDATION:** 
Implement a middleware or a wrapper function for all Convex mutations that automatically validates the `tenantId` of the document being modified against the `tenantId` of the authenticated session. Stop using `.filter()` for `tenantId` immediately and move to `.withIndex()` to ensure platform stability during the next growth phase.

**Audit Status: FAILED.** *Remediation required on critical path items before production release.*