---
name: github-actions-automation
description: Automatización de despliegues (CI/CD) para landing y apps en Zynch.
---

# Zynch Skill: GitHub Actions Automation

Este skill define cómo mantener y evolucionar los flujos de automatización de Zynch para asegurar que cada push llegue a producción de forma segura.

## 🚀 Flujos de Despliegue (Workflows)

1. **Triggers Inteligentes**: Configura `on: push: paths:` para que los cambios en la landing no disparen builds innecesarios de la web-app y viceversa.
2. **Permissions**: Los tokens usados en los workflows deben tener el scope `workflow` para poder actualizar archivos en `.github/workflows/`.
3. **Secrets**: Usa siempre `secrets.CONVEX_DEPLOY_KEY` y otros tokens sensibles almacenados en la configuración del repositorio. No los hardcodees en el YAML.

## 🧪 Calidad del Código

1. **Linting & Type-check**: Antes de cada despliegue, ejecuta `npm run lint` y `tsc --noEmit` para evitar errores en producción.
2. **Preview Deployments**: Aprovecha las capacidades de Vercel/GitHub para generar URLs de previsualización para cada Pull Request.

## 📁 Estructura Recomendada

- `landing-deploy.yml`: Despliegue de `zynch-landing/` a GitHub Pages.
- `web-app-deploy.yml`: Despliegue de la aplicación Next.js a Vercel.

---
*Cerebro Zynch v1.0*
