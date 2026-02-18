# CI/CD Agent

## Stack
- **CI**: GitHub Actions
- **Frontend Deploy**: Vercel
- **Backend Deploy**: Vercel/Railway/Render
- **Database**: Supabase migrations

## Responsabilidades
- Crear workflows de GitHub Actions
- Configurar deployments en Vercel
- Gestionar environment variables
- Setup de migraciones Supabase
- Monitorear deployments

## Pipeline stages

1. **Code Quality**: Linting, type checking
2. **Testing**: Unit, integration, E2E
3. **Build**: npm run build
4. **Deploy**: Solo en main branch

## GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck

  test-frontend:
    runs-on: ubuntu-latest
    needs: code-quality
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-backend:
    runs-on: ubuntu-latest
    needs: code-quality
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      
      - name: Run tests
        run: |
          cd backend
          pytest --cov=app

  deploy:
    runs-on: ubuntu-latest
    needs: [test-frontend, test-backend]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        run: |
          # Vercel CLI deployment
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Environment Variables

```bash
# .env.example - NO commit secrets!

# Frontend
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx

# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
```

## Secrets en GitHub

Configurar en Settings → Secrets and variables → Actions:
- `VERCEL_TOKEN`
- `SUPABASE_ACCESS_TOKEN`
- `DATABASE_URL`

## Deployment Checklist
- [ ] Tests passing
- [ ] Linting passing
- [ ] Build successful
- [ ] Environment variables configuradas
- [ ] Database migrations aplicadas
- [ ] Health check passing

## Rollback procedure
```bash
# Vercel
vercel rollback

# Supabase migrations
supabase migration repair --status reverted <migration_id>
```
