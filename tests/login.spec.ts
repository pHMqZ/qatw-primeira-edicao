import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';
import * as user from './data/user.json';
import { get2FACode } from './support/db';

let loginPage
let dashboardPage


test.describe('Login Page @login', () => {

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Should not login with invalid CPF', async (  ) => {
    
    await loginPage.goto();
    await loginPage.fillCpf('12345678901'); // CPF inválido

    await expect(loginPage.getErrorMessage()).toHaveText('CPF inválido. Por favor, verifique.');
  });

  test('Should not login with invalid password', async (  ) => {
    
    await loginPage.goto();
    await loginPage.fillCpf(user.document);
    await loginPage.fillPassword('000000'); // Senha inválida

    await expect(loginPage.getErrorMessage()).toHaveText('Acesso negado. Por favor, tente novamente.');
  
  });

  test('Should not login when the authentication code is invalid', async (  ) => {
    
    await loginPage.goto();
    await loginPage.fillCpf(user.document);
    await loginPage.fillPassword(user.password);
    await loginPage.fillAuthCode('123456'); // Código inválido

    await expect(loginPage.getErrorMessage()).toHaveText('Código inválido. Por favor, tente novamente.');
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    
    await loginPage.goto();
    await loginPage.fillCpf(user.document);
    await loginPage.fillPassword(user.password);

    await page.waitForTimeout(3000);  //Temporario para aguardar o código 2FA ser gerado

    const FACode = await get2FACode();

    await loginPage.fillAuthCode(FACode); //Código válido
   
    await page.waitForTimeout(2000);  //Temporario para aguardar o redirecionamento para a página inicial
  
    await expect(await dashboardPage.validateSuccessfulLogin()).toBeTruthy(); // Corrigido: valida se a função retorna verdadeiro/sucesso

  });

  

});
