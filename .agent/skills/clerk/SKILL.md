---
name: clerk-auth-security
description: Integración de seguridad bancaria, multi-factor y gestión de sesiones con Clerk en Zynch.
---

# Zynch Skill: Clerk Auth & Security

Guía para implementar la autenticación y el control de acceso de nivel "Elite" en la plataforma Zynch.

## 🔐 Autenticación Multi-Tenant

Zynch usa Clerk para gestionar la identidad. Cada sesión debe estar vinculada al `tenantId` correcto.

1. **Propagación a Convex**: Usa el JWT de Clerk para autenticar las peticiones a Convex. No pases el `userId` en los argumentos de la query; léelo siempre de `ctx.auth.getUserIdentity()`.
2. **Social Login**: Habilita Google, Apple y WhatsApp para una fricción mínima.

## 🛡️ Niveles de Acceso (RBAC)

El campo `role` en la tabla `users` define el poder del usuario:
- **`admin`**: Acceso total al dashboard de iwai.
- **`promoter`**: Gestión de su propio tenant (config, citas, galería).
- **`client`**: Acceso a agendar y perfil personal.

## 🛸 Seguridad de la Sesión

- **MFA (Multi-Factor Authentication)**: OBLIGATORIO para roles `admin` y `promoter`.
- **Inactividad**: Configura expiración de sesiones cortas para dispositivos no reconocidos.

## 🛠️ Integración Frontend

Usa los componentes de Clerk (`<SignIn />`, `<UserProfile />`) para mantener la consistencia, pero personaliza el tema visual para que coincida con el **Chameleon Design System** (usando las variables primary/secondary).

---
*Cerebro Zynch v1.0*
