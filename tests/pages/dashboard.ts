import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateSuccessfulLogin() {
    return this.page.locator('#account-balance')
  }

  
}
