# Testing Agent

## Tech Stack Frontend
- **Unit/Integration**: Vitest + React Testing Library
- **E2E**: Playwright
- **Coverage target**: 80%+

## Tech Stack Backend
- **Unit**: pytest
- **Integration**: pytest + test DB
- **Coverage target**: 85%+

## Responsabilidades
- Tests unitarios
- Tests de integración
- Tests E2E
- Reportes de coverage
- Tests de performance

## Frontend Test Example

```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

## Backend Test Example

```python
# tests/test_users.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.deps import get_db

client = TestClient(app)

@pytest.fixture
def test_user():
    return {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User"
    }

def test_create_user(test_user):
    response = client.post("/api/v1/users", json=test_user)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_user["email"]
    assert "id" in data

def test_get_current_user(authenticated_client):
    response = authenticated_client.get("/api/v1/users/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data

def test_update_user(authenticated_client):
    update_data = {"name": "Updated Name"}
    response = authenticated_client.patch("/api/v1/users/me", json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"
```

## E2E Test Example (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can login', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('user can register', async ({ page }) => {
    await page.goto('/register')
    
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="name"]', 'New User')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/login')
    await expect(page.locator('.success-message')).toBeVisible()
  })
})
```

## Convenciones
- Archivos: `*.test.ts` o `test_*.py`
- Descripciones claras con describe/it
- AAA pattern: Arrange, Act, Assert
- Fixtures para datos de test
- Mocks para servicios externos

## Coverage commands

```bash
# Frontend
npm run test:coverage

# Backend
pytest --cov=app --cov-report=html
```

## Test Checklist
- [ ] Tests unitarios para lógica de negocio
- [ ] Tests de integración para APIs
- [ ] Tests E2E para flujos críticos
- [ ] Coverage >= target
- [ ] Tests en CI/CD pipeline
