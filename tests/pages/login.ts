import { Page } from '@playwright/test';

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
  async fillCpf(document) {
    await this.page.getByRole('textbox', { name: 'Digite seu CPF' }).fill(document);
    await this.page.getByRole('button', { name: 'Continuar' }).click();
  }


  // Insere a senha numérica clicando nos botões correspondentes
  async fillPassword(password) {
    for (const digit of password) {
      await this.page.getByRole('button', { name: digit }).click();
    }

    await this.page.getByRole('button', { name: 'Continuar' }).click();
  }

  //Preenche o campo com o código de autenticação inválido
  async fillAuthCode(code) {
    await this.page.getByRole('textbox', { name: '000000' }).fill(code);

    await this.page.getByRole('button', { name: 'Verificar' }).click();
  }

  // Retorna o texto da mensagem de erro
  getErrorMessage() {
    return this.page.locator('span');
  }

  
}
