// ─── שאלה 4: cy.intercept — שינוי שדה ספציפי בתגובה ────────────
//
// עמוד מקור: https://www.gov.il/he/department/prime_ministers_office
// דמו מקומי: cypress/fixtures/gov-demo/prime-ministers.html
//
// הדף שולח fetch() ל-API שמחזיר JSON עם "title": "משרד ראש הממשלה".
// cy.intercept יורט את הבקשה ומחזיר stub עם title: "office".
// ────────────────────────────────────────────────────────────────

describe('Gov.il | Prime Ministers Office — Intercept & Modify Title', () => {

  // ─── Test 1 ───────────────────────────────────────────────────
  // מיירט את בקשת ה-API ומשנה את "title" מ-"משרד ראש הממשלה" ל-"office"
  it('should change the page title via cy.intercept from "משרד ראש הממשלה" to "office"', () => {

    // cy.intercept חייב לרוץ לפני cy.visit!
    // תופס את ה-fetch() שהדמו שולח ל-API
    cy.intercept(
      'GET',
      '**/prime_ministers_office**',
      (req) => {
        req.reply({
          statusCode: 200,
          body: {
            title:       'office',           // ← השינוי שהשאלה מבקשת
            description: '',
            urlName:     'prime_ministers_office'
          }
        });
      }
    ).as('getPMOffice');

    // פותח את הדמו המקומי — cy.visit לקובץ HTML, לא לאתר האמיתי
    cy.visit('cypress/fixtures/gov-demo/prime-ministers.html');

    // ממתין לבקשה שתויגה ומאמת שה-title בתגובה הוא "office"
    cy.wait('@getPMOffice')
      .its('response.body.title')
      .should('eq', 'office');

    // מאמת שהדום עודכן — הכותרת בדף מציגה "office"
    cy.get('[data-testid="dept-title"]')
      .should('have.text', 'office');
  });

});
