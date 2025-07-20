import { test, expect, Page } from '@playwright/test';

test.describe('Chatbot Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/movies/chatbot');
  });

  // Helper function to send a chatbot message and wait for response
  async function sendChatMessage(page: Page, message: string) {
    const chatInput = page.getByTestId('chat-input');
    const sendButton = page.getByTestId('send-chat-button');
    
    await chatInput.fill(message);
    await sendButton.click();
    
    // Wait for server response to complete (button becomes enabled again)
    await expect(sendButton).toBeEnabled({ timeout: 30000 });
  }

  test.describe('Page Setup', () => {
    test('should display chatbot search page correctly', async ({ page }) => {
      await expect(page).toHaveTitle('MovieTrackerApp');
      await expect(page).toHaveURL(/.*\/movies\/chatbot/);
      await expect(page.getByRole('link', { name: 'Chatbot Search' })).toBeVisible();
    });

    test('should display chatbot interface elements', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Chatbot', level: 1 })).toBeVisible();
      await expect(page.getByText('Ask me anything about movies!')).toBeVisible();
      await expect(page.getByTestId('chat-input')).toBeVisible();
      await expect(page.getByTestId('send-chat-button')).toBeVisible();
    });
  });





  test.describe('UI Interactions', () => {
    test('should handle funny fact button (if visible)', async ({ page }) => {
      const funnyFactButton = page.getByTestId('funny-fact-button');
      const buttonCount = await funnyFactButton.count();
      
      // Only test if button is conditionally shown
      if (buttonCount > 0) {
        await expect(funnyFactButton).toBeVisible();
        await expect(funnyFactButton).toBeEnabled();
      }
    });
  });
});
