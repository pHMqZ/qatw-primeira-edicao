import { Page } from '@playwright/test';
import * as user from '../data/user.json';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navega para a URL de login
  async goto() {
    await this.page.goto('http://paybank-mf-auth:3000/');
  }

  // Preenche o campo CPF com o CPF do usuário do arquivo user.json
  async fillCpf() {
    await this.page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(user.document);
  }

  // Clica no botão "Continuar" após preencher o CPF
  async clickContinueCpf() {
    await this.page.getByRole('button', { name: 'Continuar' }).click();
  }

  // Insere a senha numérica clicando nos botões correspondentes
  async fillPassword() {
    const passwordDigits = user.password.split('');
    for (const digit of passwordDigits) {
      await this.page.getByRole('button', { name: digit }).click();
    }
  }

  // Clica no botão "Continuar" após inserir a senha
  async clickContinuePassword() {
    await this.page.getByRole('button', { name: 'Continuar' }).click();
  }

  // Preenche o campo de código de autenticação
  async fillAuthCode() {
    await this.page.getByRole('textbox', { name: '000000' }).fill(user.authCode);
  }

  // Clica no botão "Verificar" para o código de autenticação
  async clickVerifyAuthCode() {
    await this.page.getByRole('button', { name: 'Verificar' }).click();
  }

  // Retorna o texto da mensagem de erro
  getErrorMessage() {
    return this.page.locator('span');
  }
}
