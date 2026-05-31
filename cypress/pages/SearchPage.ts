import BasePage from './BasePage';

// SearchPage — מחלקת דף החיפוש, יורשת מ-BasePage
class SearchPage extends BasePage {

  // ─── Selectors — בוחרים אלמנטים מהדף ────────────────────────

  // כפתור פתיחת תיבת החיפוש (toggle)
  get searchToggleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.search-toggle, [aria-label*="חיפוש"], button.search-btn').first();
  }

  // שדה הקלט שבו מקלידים את מילות החיפוש
  get searchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[type="search"], input[placeholder*="חיפוש"], .search-input input').first();
  }

  // כפתור שליחת החיפוש (submit)
  get searchSubmitBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('button[type="submit"], .search-submit').first();
  }

  // רשימת ההצעות האוטומטיות שמופיעות בזמן הקלדה
  get searchSuggestions(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.autocomplete-suggestions, .search-dropdown, [class*="suggestion"]');
  }

  // מיכל תוצאות החיפוש — מופיע אחרי שליחת הטופס
  get resultsContainer(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.search-results, [class*="search-result"], .results-list');
  }

  // הודעת "אין תוצאות" — מופיעה כשהחיפוש לא מוצא כלום
  get noResultsMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.no-results, [class*="no-result"]');
  }

  // ─── Actions — פעולות שניתן לבצע על הדף ─────────────────────

  // פותח את דף החיפוש הדמו מקובץ fixtures
  visitHomePage(): void {
    this.visit('cypress/fixtures/gov-demo/search.html');
  }

  // לוחץ על כפתור הפתיחה וממתין שתיבת החיפוש תהיה גלויה
  openSearchBar(): void {
    this.searchToggleBtn.click();
    this.searchInput.should('be.visible');
  }

  // מנקה את השדה ומקליד מחרוזת חיפוש חדשה
  typeSearchTerm(term: string): void {
    this.searchInput.clear().type(term);
  }

  // שולח את החיפוש על ידי לחיצה על Enter
  submitSearchByEnter(): void {
    this.searchInput.type('{enter}');
  }

  // מנקה את תיבת החיפוש
  clearSearchInput(): void {
    this.searchInput.clear();
  }

  // פעולה משולבת: פותח סרגל חיפוש, מקליד ושולח — שימוש נוח בבדיקות
  searchFor(term: string): void {
    this.openSearchBar();
    this.typeSearchTerm(term);
    this.submitSearchByEnter();
  }
}

export default new SearchPage();
