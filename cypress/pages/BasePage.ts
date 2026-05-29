export default class BasePage {

  visit(path: string = 'cypress/fixtures/gov-demo/search.html'): void {
    cy.visit(path);
    this.waitForPageLoad();
  }

  protected waitForPageLoad(): void {
    cy.document().its('readyState').should('eq', 'complete');
  }

  protected getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`);
  }

  protected getByAriaLabel(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[aria-label="${label}"]`);
  }
}
