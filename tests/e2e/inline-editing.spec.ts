import { test, expect } from '@playwright/test';

test.describe('Inline Message Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should edit message text', async ({ page }) => {
    // Add a test message
    await page.fill('[data-testid="message-input"]', 'Original message');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Wait for message to appear
    await expect(page.locator('text=Original message')).toBeVisible();

    // Hover over message to reveal edit button
    const messageBubble = page.locator('[data-message-id]').first();
    await messageBubble.hover();

    // Click edit button
    await page.click('[aria-label="Editar mensagem"]');

    // Edit popover should appear
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(
      page.locator('textarea[value="Original message"]')
    ).toBeVisible();

    // Edit the message
    await page.fill('textarea', 'Edited message text');
    await page.click('button:has-text("Salvar")');

    // Verify changes
    await expect(page.locator('text=Edited message text')).toBeVisible();
    await expect(page.locator('text=Original message')).not.toBeVisible();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should change timestamp and verify reordering', async ({ page }) => {
    // Add two messages with different times
    await page.fill('[data-testid="message-input"]', 'First message');
    await page.press('[data-testid="message-input"]', 'Enter');

    await page.waitForTimeout(100); // Ensure different timestamps

    await page.fill('[data-testid="message-input"]', 'Second message');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Verify initial order
    const messages = page.locator('[data-message-id]');
    await expect(messages.nth(0)).toContainText('First message');
    await expect(messages.nth(1)).toContainText('Second message');

    // Edit first message timestamp to be later
    await messages.nth(0).hover();
    await page.click('[aria-label="Editar mensagem"]');

    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Change time to much later
    await page.fill('input[placeholder="14:30"]', '23:59');
    await page.click('button:has-text("Salvar")');

    // Verify messages were reordered
    const reorderedMessages = page.locator('[data-message-id]');
    await expect(reorderedMessages.nth(0)).toContainText('Second message');
    await expect(reorderedMessages.nth(1)).toContainText('First message');
  });

  test('should cancel editing with ESC key', async ({ page }) => {
    // Add a test message
    await page.fill('[data-testid="message-input"]', 'Test message');
    await page.press('[data-testid="message-input"]', 'Enter');

    await expect(page.locator('text=Test message')).toBeVisible();

    // Start editing
    const messageBubble = page.locator('[data-message-id]').first();
    await messageBubble.hover();
    await page.click('[aria-label="Editar mensagem"]');

    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Make some changes
    await page.fill('textarea', 'Changed text');

    // Press ESC to cancel
    await page.keyboard.press('Escape');

    // Dialog should close and message should be unchanged
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Test message')).toBeVisible();
    await expect(page.locator('text=Changed text')).not.toBeVisible();
  });

  test('should work with mobile long press', async ({ page }) => {
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Add a test message
    await page.fill('[data-testid="message-input"]', 'Mobile test message');
    await page.press('[data-testid="message-input"]', 'Enter');

    await expect(page.locator('text=Mobile test message')).toBeVisible();

    // Simulate long press (touch and hold)
    const messageBubble = page.locator('[data-message-id]').first();

    // Simulate touchstart and hold
    await messageBubble.dispatchEvent('touchstart');
    await page.waitForTimeout(600); // Wait longer than threshold
    await messageBubble.dispatchEvent('touchend');

    // Edit popover should appear
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Edit and save
    await page.fill('textarea', 'Edited via long press');
    await page.click('button:has-text("Salvar")');

    // Verify changes
    await expect(page.locator('text=Edited via long press')).toBeVisible();
  });

  test('should validate timestamp format', async ({ page }) => {
    // Add a test message
    await page.fill('[data-testid="message-input"]', 'Test message');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Start editing
    const messageBubble = page.locator('[data-message-id]').first();
    await messageBubble.hover();
    await page.click('[aria-label="Editar mensagem"]');

    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Enter invalid time
    await page.fill('input[placeholder="14:30"]', '25:99');
    await page.click('button:has-text("Salvar")');

    // Should show validation error
    await expect(
      page.locator('text=Horário deve estar no formato HH:MM')
    ).toBeVisible();

    // Dialog should remain open
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Fix the time
    await page.fill('input[placeholder="14:30"]', '15:30');
    await page.click('button:has-text("Salvar")');

    // Should save successfully
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=15:30')).toBeVisible();
  });

  test('should show status options for user messages only', async ({
    page,
  }) => {
    // Add user message
    await page.fill('[data-testid="message-input"]', 'User message');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Switch to contact and add contact message
    await page.click('[data-testid="sender-toggle"]');
    await page.fill('[data-testid="message-input"]', 'Contact message');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Edit user message - should have status field
    const userMessage = page
      .locator('text=User message')
      .locator('..')
      .locator('..');
    await userMessage.hover();
    await userMessage.locator('[aria-label="Editar mensagem"]').click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible(); // Status select should be present

    await page.keyboard.press('Escape');

    // Edit contact message - should not have status field
    const contactMessage = page
      .locator('text=Contact message')
      .locator('..')
      .locator('..');
    await contactMessage.hover();
    await contactMessage.locator('[aria-label="Editar mensagem"]').click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('select')).not.toBeVisible(); // Status select should not be present
  });

  test('should save with Ctrl+Enter keyboard shortcut', async ({ page }) => {
    // Add a test message
    await page.fill('[data-testid="message-input"]', 'Shortcut test');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Start editing
    const messageBubble = page.locator('[data-message-id]').first();
    await messageBubble.hover();
    await page.click('[aria-label="Editar mensagem"]');

    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Edit message
    await page.fill('textarea', 'Saved with shortcut');

    // Use Ctrl+Enter to save
    await page.keyboard.press('Control+Enter');

    // Should save and close
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Saved with shortcut')).toBeVisible();
  });

  test('should show loading state while saving', async ({ page }) => {
    // Add a test message
    await page.fill('[data-testid="message-input"]', 'Loading test');
    await page.press('[data-testid="message-input"]', 'Enter');

    // Start editing
    const messageBubble = page.locator('[data-message-id]').first();
    await messageBubble.hover();
    await page.click('[aria-label="Editar mensagem"]');

    // Make a change and save
    await page.fill('textarea', 'Changed text');

    // Click save and immediately check for loading state
    const savePromise = page.click('button:has-text("Salvar")');

    // Should show loading state briefly
    await expect(page.locator('button:has-text("Salvando...")')).toBeVisible();
    await expect(page.locator('button[disabled]')).toBeVisible();

    await savePromise;

    // Should complete successfully
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    await expect(page.locator('text=Changed text')).toBeVisible();
  });
});
