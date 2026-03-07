# 📧 Plan de Implementación: Email Infrastructure para Zynch.app

**Versión:** 1.0  
**Estado:** 🔄 Por Implementar  
**Última actualización:** Marzo 2026  
**Responsable:** IWAI - Automated Processes

---

## 🎯 Objetivo General

Implementar una infraestructura de email robusta, auditable y escalable para Zynch.app que soporte casos críticos de comunicación multi-tenant con validación estricta y compliance.

---

## 📋 Fase 1: Infraestructura Base (Semana 1-2)

### 1.1 Adquisición de Dominio
**Estado:** ⏳ Pendiente  
**Proveedor:** Porkbun

- [ ] Acceder a https://porkbun.com sin restricciones geográficas
- [ ] Registrar dominio **zynch.app**
- [ ] Verificar disponibilidad y completar compra
- [ ] Guardar credenciales en gestor seguro

**Notas:**
- Evitar VPN durante registro (riesgo de bloqueos)
- Usar método de pago verificado
- Almacenar credentials en `.env.local` (no en git)

---

### 1.2 Configuración de Proveedor Email
**Estado:** ⏳ Pendiente  
**Proveedor:** Mailgun (Plan Gratuito)

#### Paso 1: Crear Cuenta Mailgun
- [ ] Registrarse en https://www.mailgun.com sin restricciones
- [ ] Seleccionar plan **Free** (5,000 correos/mes)
- [ ] Completar verificación de email
- [ ] Seleccionar caso de uso: **Transactional Email**

#### Paso 2: Agregar Dominio
- [ ] En dashboard Mailgun: **Sending → Domains → Add New Domain**
- [ ] Ingresa: **zynch.app**
- [ ] Selecciona región: **US** (o cercana)
- [ ] Mailgun genera **4 registros DNS**

#### Paso 3: Configurar DNS en Porkbun
- [ ] Login en Porkbun
- [ ] Dominio **zynch.app** → **Manage → DNS**
- [ ] Agregar registros DNS de Mailgun:
  - **2 MX records** (Mail exchange)
  - **2 TXT records** (SPF + DKIM)
- [ ] Esperar validación DNS (24-48h)

#### Paso 4: Obtener Credenciales
- [ ] En Mailgun: **API → Select Domain (zynch.app)**
- [ ] Copiar **API Key**
- [ ] Almacenar en `.env`:
  ```
  MAILGUN_API_KEY=xxxx_tu_api_key_xxxx
  MAILGUN_DOMAIN=zynch.app
  ```

**Validación de éxito:**
```bash
# Test envío via Mailgun API
curl -s --user 'api:MAILGUN_API_KEY' \
  https://api.mailgun.net/v3/zynch.app/messages \
  -F from='test@zynch.app' \
  -F to='tu-email@example.com' \
  -F subject='Test' \
  -F text='Working!'
```

---

## 🗄️ Fase 2: Base de Datos (Semana 2-3)

### 2.1 Schema Convex para Auditoría de Emails

**Crear archivo:** `convex/schema.ts`

```typescript
// Table: emailLogs (Auditoría completa de correos)
export const emailLogs = defineTable({
  // === Identificadores ===
  tenantId: v.id("tenants"),
  recipientEmail: v.string(),
  
  // === Contenido ===
  type: v.union(
    v.literal("verification"),      // Verificación de registro
    v.literal("welcome"),             // Bienvenida inquilino
    v.literal("receipt"),             // Recibo de cobro (CRÍTICO)
    v.literal("statement"),           // Estado de cuenta (CRÍTICO)
    v.literal("support"),             // Notificación soporte
    v.literal("alert")                // Alerta interna multi-tenant
  ),
  subject: v.string(),
  htmlContent: v.string(),
  
  // === Estado de Envío ===
  status: v.union(
    v.literal("pending"),
    v.literal("sent"),
    v.literal("failed"),
    v.literal("bounced")
  ),
  
  // === Tracking Mailgun ===
  mailgunMessageId: v.string(),
  
  // === Datos Críticos ===
  documentId: v.optional(v.string()),  // Link a recibo/estado
  amount: v.optional(v.number()),      // Monto (para recibos)
  
  // === Metadata ===
  failureReason: v.optional(v.string()),
  retryCount: v.number(),
  
  // === Timestamps ===
  sentAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
  
  // === Compliance ===
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
})
.index("by_tenant", ["tenantId"])
.index("by_email_status", ["recipientEmail", "status"])
.index("by_type", ["type"])
.index("by_date_range", ["createdAt"])
```

**Crear archivo:** `convex/mutations/email.ts`

- [ ] Implementar validaciones de email
- [ ] Crear mutation: `sendEmail()`
- [ ] Crear mutation: `logEmailStatus()`
- [ ] Crear mutation: `resendFailedEmail()`

---

## 🔐 Fase 3: Validaciones y Lógica (Semana 3-4)

### 3.1 Validaciones Estrictas

**Crear archivo:** `convex/lib/emailValidation.ts`

Implementar validaciones:

- [ ] **Email válido:** Regex RFC 5322 + DNS MX verification
- [ ] **Tenant activo:** Verificar estado y suscripción
- [ ] **No duplicados:** Evitar envíos múltiples en 24h
- [ ] **Rate limiting:** Max 10 intentos/hora por email
- [ ] **Whitelist/Blacklist:** Emails vedados

**Checklist de validación:**
```typescript
✓ Email format válido
✓ Tenant existe y está activo
✓ No hay envío reciente duplicado
✓ No excede rate limit
✓ Email no está en blacklist
✓ Documentos relacionados existen (si aplica)
```

---

### 3.2 Integración Mailgun API

**Crear archivo:** `convex/lib/mailgun.ts`

```typescript
// Interfaz limpia con Mailgun
async function sendViaMailgun(
  to: string,
  subject: string,
  html: string,
  type: EmailType
): Promise<{ id: string; status: string }>

// Manejo de errores específicos de Mailgun
// - Invalid email
// - Rate limit exceeded
// - Bounced addresses
// - Authentication failures
```

- [ ] Implementar retry logic (max 3 intentos)
- [ ] Implementar exponential backoff
- [ ] Logging detallado de errores
- [ ] Webhooks para eventos (bounced, complained, opened)

---

## 📧 Fase 4: Casos de Uso (Semana 4-5)

### 4.1 Verificación de Email (Registro)

**Flujo:**
1. Usuario se registra con email
2. Sistema genera token (6 dígitos, 10 minutos de validez)
3. Envía email de verificación vía Mailgun
4. Usuario confirma token
5. Log registrado en `emailLogs`

**Implementar:**
- [ ] Generar tokens seguros
- [ ] Template HTML de verificación
- [ ] Expiración de tokens
- [ ] Reenvío con rate limit

---

### 4.2 Bienvenida de Inquilino (Onboarding)

**Flujo:**
1. Nuevo Promotor/Performer se registra
2. Sistema envía bienvenida + credenciales temporales
3. Link a tutorial/dashboard
4. Log en auditoría

**Implementar:**
- [ ] Template HTML profesional
- [ ] Personalización por tenant (nombre, branding)
- [ ] Incluir link a onboarding
- [ ] Datos de contacto soporte

---

### 4.3 Recibos de Cobro (CRÍTICO)

**Flujo:**
1. Transacción completada (cita pagada, comisión, etc.)
2. Sistema genera recibo en PDF
3. Envía recibo vía email a inquilino
4. Log con monto y documentId
5. Disponible en historial del tenant

**Implementar:**
- [ ] Generar PDF del recibo (usar pdfkit o similar)
- [ ] Firmar digitalmente (opcional pero recomendado)
- [ ] Adjuntar a email Mailgun
- [ ] Almacenar link a recibo en `documentId`
- [ ] Template HTML + PDF adjunto

**Datos obligatorios en recibo:**
```
✓ Número de recibo único
✓ Fecha y hora
✓ Concepto (cita, comisión, etc.)
✓ Monto
✓ Método de pago
✓ Nombre inquilino
✓ Firma digital (hash)
```

---

### 4.4 Estados de Cuenta (CRÍTICO)

**Flujo:**
1. Genera reporte mensual/trimestral
2. Cálculos: ingresos, comisiones, saldos
3. Envía estado via email a inquilino
4. Log con período en `documentId`

**Implementar:**
- [ ] Generar reporte PDF completo
- [ ] Incluir gráficos de ingresos
- [ ] Desglose por concepto
- [ ] Saldo actual
- [ ] Disponible para retiro
- [ ] Template HTML + PDF

---

### 4.5 Notificaciones de Soporte

**Flujo:**
1. Usuario contacta soporte (form en app)
2. Sistema envía confirmación: "Recibimos tu ticket"
3. Notifica a equipo soporte (admin)
4. Cuando se resuelve, notifica al usuario
5. Log de toda comunicación

**Implementar:**
- [ ] Ticket automation
- [ ] Template de confirmación
- [ ] Template de resolución
- [ ] Link a seguimiento de ticket

---

### 4.6 Alertas Internas Multi-Tenant

**Flujo:**
1. Eventos críticos: Acceso denegado, cambio de credenciales, etc.
2. Notificar a admin del tenant
3. Log para auditoría de seguridad

**Implementar:**
- [ ] Trigger lista: qué genera alertas
- [ ] Template de alerta
- [ ] Posibilidad de deshabilitar

---

## 🎨 Fase 5: UI/UX (Semana 5-6)

### 5.1 Dashboard de Historial de Correos

**Ubicación:** Panel de inquilino

**Funcionalidades:**
- [ ] Tabla con historial de emails
- [ ] Filtros: Tipo, Rango de fechas, Estado
- [ ] Búsqueda por email recipient
- [ ] Columnas:
  - Fecha enviado
  - Tipo (Recibo/Estado/Verificación/etc)
  - Monto (si aplica)
  - Estado (✅ Enviado / ⚠️ Pendiente / ❌ Fallido)
  - Acciones: Ver, Descargar, Reenviar

**Implementar:**
- [ ] Component React para tabla
- [ ] Paginación
- [ ] Sorting
- [ ] Export a CSV (opcional)

---

### 5.2 Panel de Alertas de Email (Admin)

**Ubicación:** Admin dashboard

**Funcionalidades:**
- [ ] Emails fallidos por resolver
- [ ] Tasa de entrega (%)
- [ ] Correos enviados/mes vs límite gratuito
- [ ] Top errores
- [ ] Acciones: Reenviar, Blacklist, etc.

---

## 🧪 Fase 6: Testing y Validación (Semana 6-7)

### 6.1 Tests Unitarios
- [ ] Validación de emails
- [ ] Generación de tokens
- [ ] Lógica de rate limiting
- [ ] Templates rendering

### 6.2 Tests de Integración
- [ ] Mock Mailgun API
- [ ] Flujo completo: registro → verificación → email
- [ ] Manejo de errores Mailgun
- [ ] Auditoría en DB

### 6.3 Tests E2E
- [ ] Usuario se registra y recibe email
- [ ] Inquilino recibe recibo de cobro
- [ ] Admin ve alertas de emails fallidos
- [ ] Historial de correos en panel

### 6.4 Pruebas de Carga
- [ ] Simular 100 emails simultáneos
- [ ] Verificar rate limiting
- [ ] Validar logs en DB

---

## 📊 Fase 7: Monitoreo y Compliance (Semana 7+)

### 7.1 Webhooks Mailgun

Implementar handlers para eventos:
- [ ] `delivered` → Actualizar status en DB
- [ ] `failed` → Log de error y retry
- [ ] `bounced` → Añadir a blacklist
- [ ] `complained` → Investigar y review

**Endpoint:** `POST /api/webhooks/mailgun`

---

### 7.2 Métricas y Reporting

- [ ] Dashboard de KPIs:
  - Tasa de entrega (%)
  - Correos por tipo
  - Errores más comunes
  - Tendencia mensual

- [ ] Alertas automáticas:
  - Tasa de entrega < 95%
  - Rate limit cercano
  - Dominios bounceados

---

### 7.3 Compliance y Auditoría

- [ ] **GDPR:** Derecho al olvido, consentimiento
- [ ] **CAN-SPAM:** Unsubscribe link
- [ ] **SOC 2:** Auditoría completa en logs
- [ ] **Retención:** Política de borrado (6-12 meses)

**Checklist:**
- [ ] Política de privacidad incluye email
- [ ] Unsubscribe working (si aplica)
- [ ] Logs indefinidos para recibos (req. legal)
- [ ] Acceso restringido a logs

---

## 📞 Matriz de Soporte

| Caso | Email | Recipient | Prioridad | SLA |
|------|-------|-----------|-----------|-----|
| Verificación | verification@zynch.app | Usuario | Media | 5 min |
| Recibo cobro | receipts@zynch.app | Tenant | ALTA | Inmediato |
| Estado cuenta | statements@zynch.app | Tenant | ALTA | Inmediato |
| Soporte | support@zynch.app | User+Admin | Media | 2h |
| Alerta sistema | noreply@zynch.app | Admin | Baja | 24h |

---

## 🎁 Deliverables Finales

- [ ] Infraestructura email 100% operativa
- [ ] 6 casos de uso implementados
- [ ] Dashboard de historial completo
- [ ] Tests con cobertura > 90%
- [ ] Documentación técnica (con ejemplos)
- [ ] Runbook de troubleshooting
- [ ] Compliance checklist completado

---

## 📅 Timeline Estimado

| Fase | Duración | Fin Estimado |
|------|----------|--------------|
| **Fase 1:** Infraestructura | 2 semanas | Semana 2 |
| **Fase 2:** Base de datos | 1 semana | Semana 3 |
| **Fase 3:** Validaciones | 1 semana | Semana 4 |
| **Fase 4:** Casos de uso | 1 semana | Semana 5 |
| **Fase 5:** UI/Dashboard | 1 semana | Semana 6 |
| **Fase 6:** Testing | 1 semana | Semana 7 |
| **Fase 7:** Monitoreo | Ongoing | Semana 7+ |
| **TOTAL** | **7 semanas** | |

---

## 🔧 Dependencias y Recursos

### Stack Tech
- **Backend:** Convex + Next.js
- **Email:** Mailgun API
- **Dominio:** Porkbun (zynch.app)
- **PDF:** pdfkit / puppeteer
- **Testing:** Vitest / Jest
- **DB:** Convex (automático)

### Acceso Requerido
- [ ] Credenciales Mailgun
- [ ] Control DNS Porkbun
- [ ] Acceso repositorio
- [ ] Permisos Convex

### Costos Estimados
```
Dominio (zynch.app):     ~$10/año
Mailgun (gratuito):      $0/mes
Certificado SSL:         Incluido
Almacenamiento Convex:   $0 (plan gratuito)
─────────────────────────────────
TOTAL:                   ~$10/año
```

---

## ⚠️ Riesgos y Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Bloqueo geográfico (Venezuela) | Alto | Usar VPN temporal, contactar soporte Mailgun |
| Tasa de entrega baja | Alto | Calentar dominio, SPF/DKIM/DMARC correcto |
| Emails bounceados | Medio | Validar emails antes, mantener lista limpia |
| Rate limiting | Bajo | Implementar queue (Bull/Redis) |
| Compliance GDPR | Alto | Auditoría exhaustiva, logs permanentes |

---

## 📝 Checklist Antes de Producción

- [ ] DNS validado en Mailgun
- [ ] API Key segura (en .env, no en git)
- [ ] Tests E2E pasando 100%
- [ ] Webhooks Mailgun configurados
- [ ] Auditoría DB con índices
- [ ] Rate limiting activo
- [ ] Dashboard completo
- [ ] Documentación técnica final
- [ ] Runbook de emergencia
- [ ] Plan de rollback

---

## 📞 Contacto y Escalación

**Responsable Técnico:** IWAI - Automated Processes  
**Repositorio:** `/roadmap/EMAIL_INFRASTRUCTURE.md`  
**Estado:** Ver en GitHub Issues  

---

**Documento versión 1.0 | Marzo 2026 | IWAI**  
*Próxima revisión: Post-implementación Fase 1*
