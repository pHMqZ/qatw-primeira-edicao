import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login';

test.describe('Login Page', () => {

  test('Should not login when the authentication code is invalid using page object', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillCpf();
    await loginPage.clickContinueCpf();
    await loginPage.fillPassword();
    await loginPage.clickContinuePassword();
    await loginPage.fillAuthCode();
    await loginPage.clickVerifyAuthCode();

    await expect(loginPage.getErrorMessage()).toHaveText('Código inválido. Por favor, tente novamente.');
  });
});
