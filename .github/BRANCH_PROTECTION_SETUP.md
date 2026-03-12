# 🛡️ Configuración Branch Protection para Zynch

## Pasos en GitHub (2 minutos):

1. **Ve a tu repositorio** → Settings → Branches
2. **Add rule** para rama `main`
3. **Configura estas opciones:**

### ✅ Requeridos:
- [x] **Require pull request reviews before merging**
- [x] **Require approvals**: 1
- [x] **Dismiss stale PR approvals when new commits are pushed**
- [x] **Require review from CODE OWNERS**
- [x] **Require status checks to pass before merging**
- [x] **Require branches to be up to date before merging**

### 🔄 Status checks requeridos:
- [x] `Web App CI / build_and_check` (se auto-detecta)

### 🚀 Opcional pero recomendado:
- [x] **Do not allow bypassing the above settings**
- [x] **Restrict pushes that create files** (evita scripts maliciosos)

## Resultado:
- 🛡️ Todo cambio a `main` pasa por PR
- 🔍 CI valida automáticamente multi-tenancy  
- 👥 Requiere aprobación antes de producción
- 📝 Template guía para revisión

## Para desactivar temporalmente:
Desmarca "Require pull request reviews" si necesitas deploy rápido en desarrollo.
