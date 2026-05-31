import BasePage from './BasePage';

// טיפוס מותאם — שמות הפילטרים שהדף תומך בהם
type FilterName = 'cities' | 'categories' | 'accessibilitytype';

// FilterPage — מחלקת עמוד הפילטרים, יורשת מ-BasePage
// מדמה את עמוד "קבלת קהל ועמדות שירותים" של gov.il:
// https://www.gov.il/he/government-service-branches?limit=10&skip=0
class FilterPage extends BasePage {

  // ─── Selectors — בוחרים אלמנטים מהדף ────────────────────────

  // כפתור פתיחת לוח הפילטרים (אייקון ≡ שליד החיפוש)
  get filterToggleBtn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.filter-toggle');
  }

  // לוח הפילטרים עצמו — נפתח לאחר לחיצה על הכפתור
  get filterPanel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.filter-panel');
  }

  // תיבת הסימון עבור פילטר הערים
  get citiesCheckbox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="cities"]');
  }

  // תיבת הסימון עבור פילטר הקטגוריות
  get categoriesCheckbox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="categories"]');
  }

  // תיבת הסימון עבור פילטר סוג הנגישות
  get accessibilityTypeCheckbox(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('input[name="accessibilitytype"]');
  }

  // אזור הסטטוס — מציג הודעות על מצב הטעינה
  get statusText(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.status-text');
  }

  // רשימת תוצאות השירותים הממשלתיים
  get resultsList(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('.results-list');
  }

  // ─── Actions — פעולות שניתן לבצע על הדף ─────────────────────

  // פותח את עמוד הדמו המקומי שמדמה את עמוד השירותים הממשלתיים
  // הערה: האתר האמיתי (gov.il) חוסם גישת אוטומציה (403 Forbidden),
  // לכן משתמשים בדמו מקומי — בדיוק כפי שנעשה בשאלה 2
  visitFilterPage(): void {
    this.visit('cypress/fixtures/gov-demo/filters.html');
  }

  // לוחץ על כפתור הפילטר כדי לפתוח את לוח הפילטרים
  openFilterPanel(): void {
    this.filterToggleBtn.click();
    // ממתין שהפאנל יהיה גלוי לפני המשך
    this.filterPanel.should('be.visible');
  }

  // מסמן (מפעיל) פילטר לפי שמו
  // שם הפילטר חייב להיות אחד מהסוגים: cities / categories / accessibilitytype
  selectFilter(name: FilterName): void {
    cy.get(`input[name="${name}"]`).check();
  }

  // מבטל סימון (מכבה) פילטר לפי שמו
  deselectFilter(name: FilterName): void {
    cy.get(`input[name="${name}"]`).uncheck();
  }
}

export default new FilterPage();
