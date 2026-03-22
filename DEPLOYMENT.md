# 🚀 Guía de Deployment

Este proyecto usa un **monorepo** con frontend y backend en el mismo repositorio:
- **Frontend**: React + Vite → Desplegado en **Vercel**
- **Backend**: FastAPI + Python → Desplegado en **Render** (gratis)

---

## 📦 Estructura del Proyecto

```
armentum/
├── src/                 # Frontend (React + Vite)
├── backend/            # Backend (FastAPI)
├── render.yaml         # Config para Render (backend)
├── vercel.json         # Config para Vercel (frontend)
└── DEPLOYMENT.md       # Este archivo
```

---

## 🔧 Backend - Deploy en Render (GRATIS)

### Paso 1: Crea cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub (no necesita tarjeta)

### Paso 2: Crea Web Service
1. Click en **"New +"** → **"Web Service"**
2. Conecta este repositorio: `manuelsanc/armentum`
3. Render detectará automáticamente el `render.yaml`
4. Configuración detectada:
   - **Root Directory**: `backend`
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `bash start.sh`
5. Selecciona plan **"Free"**

### Paso 3: Configura Variables de Entorno

En el dashboard de Render → **Environment**, añade estas variables (cópialas de `backend/.env`):

```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui

# Database
DATABASE_URL=postgresql://usuario:password@host:5432/database

# JWT Authentication
JWT_SECRET_KEY=tu-clave-secreta-super-segura
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (Opcional)
SENDGRID_API_KEY=tu_sendgrid_key
RESEND_API_KEY=tu_resend_key

# Environment
ENVIRONMENT=production
DEBUG=False
```

### Paso 4: Deploy
1. Click en **"Create Web Service"**
2. Render construirá y desplegará automáticamente (~5-10 min)
3. Tu API estará en: `https://armentum-backend.onrender.com`

### Paso 5: Actualiza el Frontend
En el archivo `.env` del frontend (root del proyecto):

```bash
VITE_API_URL=https://armentum-backend.onrender.com
```

Luego redeploy en Vercel (automático con git push).

---

## 🌐 Frontend - Deploy en Vercel

El frontend ya está configurado para Vercel (ver `vercel.json`).

### Deploy Manual
```bash
npm install -g vercel
vercel --prod
```

### Deploy Automático
- Cada push a `main` despliega automáticamente
- Pull requests crean preview deployments

### Variables de Entorno en Vercel
Configura en el dashboard de Vercel:

```bash
VITE_API_URL=https://armentum-backend.onrender.com
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## ⚠️ Limitaciones del Plan Gratuito de Render

- **Auto-sleep**: El backend se "duerme" después de 15 min sin actividad
- **Cold start**: La primera petición tarda ~30 segundos en responder
- **Uptime**: 750 horas/mes (suficiente para 24/7)

### Mantener el Backend Despierto (Opcional)

Configura un ping cada 10 minutos con [cron-job.org](https://cron-job.org):

1. Crea cuenta gratis en cron-job.org
2. Añade un job:
   - **URL**: `https://armentum-backend.onrender.com/health`
   - **Intervalo**: Cada 10 minutos
   - **Método**: GET

Esto evita que el backend se duerma.

---

## 🔄 Actualizar Deployments

### Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render redesplegará automáticamente.

### Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel redesplegará automáticamente.

---

## 📚 Documentación API

Una vez desplegado, accede a:
- **Swagger UI**: `https://armentum-backend.onrender.com/docs`
- **ReDoc**: `https://armentum-backend.onrender.com/redoc`

---

## 🐛 Troubleshooting

### Backend no responde
- Espera ~30 segundos (cold start)
- Verifica variables de entorno en Render
- Revisa logs en Render dashboard

### Error de CORS
- Verifica que `VITE_API_URL` en el frontend apunte a la URL correcta de Render
- Chequea configuración de CORS en `backend/app/main.py`

### Migraciones no se ejecutan
- Render ejecuta `bash start.sh` que corre `alembic upgrade head`
- Revisa logs en Render dashboard
- Verifica que `DATABASE_URL` esté configurada correctamente

---

## 💰 Costos

| Servicio | Plan | Costo |
|----------|------|-------|
| Render (Backend) | Free | $0 |
| Vercel (Frontend) | Hobby | $0 |
| Supabase (Database) | Free | $0 |
| **Total** | | **$0/mes** |

---

## 🔐 Seguridad

### Producción Checklist:
- [ ] `DEBUG=False` en variables de entorno
- [ ] `JWT_SECRET_KEY` fuerte y único
- [ ] Variables de entorno configuradas (no hardcoded)
- [ ] HTTPS habilitado (automático en Render/Vercel)
- [ ] CORS configurado correctamente
- [ ] Rate limiting habilitado (si es necesario)

---

## 📞 Soporte

- **Render**: [render.com/docs](https://render.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **FastAPI**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
