import BasePage from './BasePage';

type TabId =
  | 'home' | 'personal' | 'documents' | 'history'
  | 'services' | 'permissions' | 'driving' | 'health'
  | 'money' | 'assets' | 'employment' | 'business';

class MyGovPage extends BasePage {

  visitPortal(): void {
    this.visit('cypress/fixtures/gov-demo/mygov-portal.html');
  }

  // ── Navigation ────────────────────────────────────────────────

  get navTabs(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.tab-link');
  }

  get activeTab(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.tab-link.active');
  }

  get visiblePanel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.tab-panel.active');
  }

  clickTab(tabId: TabId): void {
    cy.get(`.tab-link[data-tab="${tabId}"]`).click();
  }

  tabLink(tabId: TabId): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`.tab-link[data-tab="${tabId}"]`);
  }

  tabPanel(tabId: TabId): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`#tab-${tabId}`);
  }

  // ── Panel Content ─────────────────────────────────────────────

  get tabTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('tab-title');
  }

  get tabContent(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('tab-content');
  }

  get tabAction(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('tab-action');
  }

  // ── Assertions ────────────────────────────────────────────────

  shouldHaveActiveTab(tabId: TabId): void {
    this.tabLink(tabId).should('have.class', 'active');
    this.tabLink(tabId).should('have.attr', 'aria-selected', 'true');
  }

  shouldShowPanel(tabId: TabId): void {
    this.tabPanel(tabId).should('have.class', 'active');
  }

  shouldHidePanels(exceptTabId: TabId): void {
    cy.get('.tab-panel').not(`#tab-${exceptTabId}`)
      .should('not.have.class', 'active');
  }
}

export default new MyGovPage();
