import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';
import * as user from './data/user.json';

import { get2FACode } from './support/db';
import { clearJobs, getJob } from './support/redis';

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

  test('Should login successfully with valid credentials via 2FA in DB', async ({ page }) => {

    await clearJobs();
    
    await loginPage.goto();
    await loginPage.fillCpf(user.document);
    await loginPage.fillPassword(user.password);

    await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({timeout: 3000}); // Espera a página de 2FA carregar
    
    
    const FACode = await get2FACode(user.document);

    await loginPage.fillAuthCode(FACode); //Código válido
  
    await expect(await dashboardPage.validateSuccessfulLogin()).toHaveText('R$ 5.000,00');


  });

  test('Should login successfully with valid credentials via 2FA in redis queue', async ({ page }) => {

    await clearJobs();
    
    await loginPage.goto();
    await loginPage.fillCpf(user.document);
    await loginPage.fillPassword(user.password);

    await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({timeout: 3000}); // Espera a página de 2FA carregar
    
    const code = await getJob();

    

    await loginPage.fillAuthCode(code); //Código válido
  
    await expect(await dashboardPage.validateSuccessfulLogin()).toHaveText('R$ 5.000,00');


  });
  

});
