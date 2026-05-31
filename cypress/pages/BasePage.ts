// כל Page Object יורש ממנה — מחלקת האב
export default class BasePage {

  // visit() — פותח את הדף בדפדפן
  // path — כתובת הדף; אם לא מעבירים, נפתח הדמו המקומי
  visit(path: string = 'cypress/fixtures/gov-demo/search.html'): void {
    cy.visit(path);            // מנווט לכתובת
    this.waitForPageLoad();    // ממתין שהדף יסיים להיטען
  }

  // waitForPageLoad() — מאמת שהדף נטען במלואו לפני שנמשיך
  // פירושו: כל המשאבים (תמונות, סקריפטים) נטענו (readyState === 'complete')
  protected waitForPageLoad(): void {
    cy.document().its('readyState').should('eq', 'complete');
  }

  // getByTestId() — מוצא אלמנט לפי מאפיין data-testid
  // שמוסיפים רק לצורך בדיקות — לא נראה למשתמש ב-HTML
  protected getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`);
  }

  // getByAriaLabel() — מוצא אלמנט לפי תווית נגישות aria-label
  // aria-label מייצב Selector עוזר לקוראי מסך — ניתן להשתמש בו גם כ-Selector
  protected getByAriaLabel(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[aria-label="${label}"]`);
  }
}
