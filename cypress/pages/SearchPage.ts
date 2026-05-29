import BasePage from './BasePage';

class SearchPage extends BasePage {

  // ─── Selectors ────────────────────────────────────────────────
  get searchToggleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.search-toggle, [aria-label*="חיפוש"], button.search-btn').first();
  }

  get searchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[type="search"], input[placeholder*="חיפוש"], .search-input input').first();
  }

  get searchSubmitBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('button[type="submit"], .search-submit').first();
  }

  get searchSuggestions(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.autocomplete-suggestions, .search-dropdown, [class*="suggestion"]');
  }

  get resultsContainer(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.search-results, [class*="search-result"], .results-list');
  }

  get noResultsMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.no-results, [class*="no-result"]');
  }

  // ─── Actions ──────────────────────────────────────────────────
  visitHomePage(): void {
    this.visit('cypress/fixtures/gov-demo/search.html');
  }

  openSearchBar(): void {
    this.searchToggleBtn.click();
    this.searchInput.should('be.visible');
  }

  typeSearchTerm(term: string): void {
    this.searchInput.clear().type(term);
  }

  submitSearchByEnter(): void {
    this.searchInput.type('{enter}');
  }

  clearSearchInput(): void {
    this.searchInput.clear();
  }

  searchFor(term: string): void {
    this.openSearchBar();
    this.typeSearchTerm(term);
    this.submitSearchByEnter();
  }
}

export default new SearchPage();
