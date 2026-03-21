import { test, expect } from '@playwright/test';

test.describe('Gallery Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('should display gallery management page', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Galería');

    await expect(page.locator('h2:has-text("Gestión de Galería")')).toBeVisible();
    await expect(page.locator('button:has-text("Subir Imagen")')).toBeVisible();
  });

  test('should upload a new gallery image', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Galería');

    // Click upload button
    await page.click('button:has-text("Subir Imagen")');

    // Fill form
    await page.fill('input#upload-titulo', 'Concierto de Prueba E2E');
    await page.fill('input#upload-fecha', '2024-12-31');
    await page.fill('textarea#upload-descripcion', 'Descripción de prueba');

    // Upload file (you'd need a test image in your fixtures)
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('e2e/fixtures/test-image.jpg');

    // Add tags
    const tagInput = await page.locator('input[placeholder*="etiquetas"]');
    await tagInput.fill('prueba');
    await tagInput.press('Enter');
    await tagInput.fill('e2e');
    await tagInput.press('Enter');

    // Submit form
    await page.click('button[type="submit"]:has-text("Subir Imagen")');

    // Verify success
    await expect(page.locator('text=Imagen subida exitosamente')).toBeVisible();
    await expect(page.locator('td:has-text("Concierto de Prueba E2E")')).toBeVisible();
  });

  test('should search gallery images', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Galería');

    // Search for images
    const searchInput = await page.locator('input[placeholder*="Buscar"]');
    await searchInput.fill('Concierto');
    await searchInput.press('Enter');

    // Wait for results
    await page.waitForTimeout(500);

    // Verify filtered results
    const rows = await page.locator('table tbody tr').all();
    for (const row of rows) {
      const text = await row.textContent();
      expect(text?.toLowerCase()).toContain('concierto');
    }
  });

  test('should edit gallery image metadata', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Galería');

    // Click first edit button
    await page.locator('button[title="Editar metadatos"]').first().click();

    // Edit form
    await page.fill('input#edit-titulo', 'Título Actualizado E2E');
    await page.fill('textarea#edit-descripcion', 'Descripción actualizada');

    // Save changes
    await page.click('button:has-text("Guardar Cambios")');

    // Verify update
    await expect(page.locator('text=Imagen actualizada exitosamente')).toBeVisible();
    await expect(page.locator('td:has-text("Título Actualizado E2E")')).toBeVisible();
  });

  test('should delete gallery image', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Galería');

    // Get initial count
    const initialRows = await page.locator('table tbody tr').count();

    // Click delete button
    await page.locator('button[title="Eliminar"]').first().click();

    // Confirm deletion
    await page.click('button:has-text("Eliminar")');

    // Verify deletion
    await expect(page.locator('text=Imagen eliminada exitosamente')).toBeVisible();

    // Verify row count decreased
    const finalRows = await page.locator('table tbody tr').count();
    expect(finalRows).toBe(initialRows - 1);
  });
});

test.describe('Public Gallery', () => {
  test('should display public gallery', async ({ page }) => {
    await page.goto('/galeria');

    await expect(page.locator('h1:has-text("Galería")')).toBeVisible();
    await expect(page.locator('p:has-text("Momentos que capturan")')).toBeVisible();
  });

  test('should filter gallery by tags', async ({ page }) => {
    await page.goto('/galeria');

    // Wait for images to load
    await page.waitForSelector('img[alt]', { timeout: 5000 });

    // Click on a tag filter
    const conciertosButton = page.locator('button:has-text("conciertos")').first();
    if (await conciertosButton.isVisible()) {
      await conciertosButton.click();

      // Wait for filter to apply
      await page.waitForTimeout(500);

      // Verify filtered images (implementation depends on your UI)
      await expect(conciertosButton).toHaveClass(/bg-red-600/);
    }
  });

  test('should open lightbox on image click', async ({ page }) => {
    await page.goto('/galeria');

    // Wait for images
    await page.waitForSelector('img[alt]', { timeout: 5000 });

    // Click first image
    await page.locator('img[alt]').first().click();

    // Verify lightbox opened
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();

    // Close lightbox
    await page.locator('button:has(svg)').first().click();

    // Verify lightbox closed
    await expect(page.locator('.fixed.inset-0.z-50')).not.toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    // Intercept API call to delay response
    await page.route('**/api/public/gallery*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.goto('/galeria');

    // Check for loading state
    await expect(page.locator('text=Cargando galería')).toBeVisible();
  });

  test('should handle empty gallery', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/public/gallery*', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          total: 0,
          limit: 100,
          offset: 0,
          images: [],
        }),
      });
    });

    await page.goto('/galeria');

    // Verify empty state
    await expect(page.locator('text=No hay imágenes en la galería')).toBeVisible();
  });
});
