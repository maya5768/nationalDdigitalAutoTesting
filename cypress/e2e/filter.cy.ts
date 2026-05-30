import filterPage from '../pages/FilterPage';

// ─── ממשק לנתוני הבדיקה מ-filterData.json ────────────────────
interface FilterEntry {
  apiPattern: string;
  realUrl: string;
  expectedStatus: number;
  stubBody: object;
}
interface FilterData {
  pageUrl: string;
  baseApi: string;
  cities: FilterEntry;
  categories: FilterEntry;
  accessibilitytype: FilterEntry;
}

// ───────────────────────────────────────────────────────────────
// Gov.il | Filter Component — Network Intercept Tests (שאלה 3)
//
// עמוד מקור: https://www.gov.il/he/government-service-branches
//
// שלוש בקשות API שנמצאו ב-DevTools:
//   GET  BureausWebApi/bureaus/GetAggregationCities      → ערים         (200 OK)
//   GET  BureausWebApi/bureaus/GetAggregationCategories  → קטגוריות     (200 OK)
//   POST BureausWebApi/Bureaus  + body:{accessibility:true} → נגישות    (200 OK)
//
// שים לב: נגישות שונה! היא POST (לא GET) עם payload בגוף הבקשה.
//
// cy.intercept() יורט ומחזיר stubs — עובד ללא שרת אמיתי.
// ───────────────────────────────────────────────────────────────
describe('Gov.il | Filter Component — Network Intercept', () => {

  let filterData: FilterData;

  // טוען את נתוני הבדיקה (כולל URL patterns ו-stub bodies) פעם אחת
  before(() => {
    cy.fixture<FilterData>('filters/filterData').then((data) => {
      filterData = data;
    });
  });

  beforeEach(() => {
    filterPage.visitFilterPage();   // פותח את עמוד הדמו המקומי
    filterPage.openFilterPanel();   // לוחץ ≡ כדי לפתוח לוח פילטרים
  });

  // ─── Test 1 ───────────────────────────────────────────────────
  // מיירט את הבקשה ל-GetAggregationCities ובודק שהסטטוס הוא 200
  it('should intercept the cities API request and verify status 200', () => {
    // cy.intercept() חייב לרוץ לפני הפעולה שמפעילה את הבקשה!
    // apiPattern מ-fixture: "**/GetAggregationCities**"
    // תואם ל: https://www.gov.il/he/BureausWebApi/bureaus/GetAggregationCities
    cy.intercept('GET', filterData.cities.apiPattern, {
      statusCode: filterData.cities.expectedStatus,   // 200
      body: filterData.cities.stubBody                // תגובה מדומה עם רשימת ערים
    }).as('getCities');

    // לחיצה על checkbox → הדף שולח fetch() ל-GetAggregationCities
    filterPage.selectFilter('cities');

    // cy.wait() ממתין לבקשה שתויגה בשם 'getCities'
    // .its('response.statusCode') שולף את קוד הסטטוס מהתגובה
    // .should('eq', 200) מאמת שהסטטוס הוא 200
    cy.wait('@getCities')
      .its('response.statusCode')
      .should('eq', filterData.cities.expectedStatus);
  });

  // ─── Test 2 ───────────────────────────────────────────────────
  // מיירט את הבקשה ל-GetAggregationCategories ובודק שהסטטוס הוא 200
  it('should intercept the categories API request and verify status 200', () => {
    // apiPattern מ-fixture: "**/GetAggregationCategories**"
    // תואם ל: https://www.gov.il/he/BureausWebApi/bureaus/GetAggregationCategories
    cy.intercept('GET', filterData.categories.apiPattern, {
      statusCode: filterData.categories.expectedStatus,
      body: filterData.categories.stubBody
    }).as('getCategories');

    filterPage.selectFilter('categories');

    cy.wait('@getCategories')
      .its('response.statusCode')
      .should('eq', filterData.categories.expectedStatus);
  });

  // ─── Test 3 ───────────────────────────────────────────────────
  // מיירט את הבקשה לנגישות ובודק שהסטטוס הוא 200.
  //
  // שונה מבדיקות 1 ו-2 — זוהי בקשת POST (לא GET)!
  // נמצא ב-DevTools: POST BureausWebApi/Bureaus עם { accessibility: true } ב-payload.
  // cy.intercept() תומך ביירוט לפי method — 'POST' במקום 'GET'.
  it('should intercept the accessibilitytype POST request and verify status 200', () => {
    // apiPattern מ-fixture: "**/BureausWebApi/Bureaus**"
    // method: POST — חייב להתאים לבקשה האמיתית שנמצאה ב-DevTools
    cy.intercept('POST', filterData.accessibilitytype.apiPattern, {
      statusCode: filterData.accessibilitytype.expectedStatus,
      body: filterData.accessibilitytype.stubBody
    }).as('getAccessibility');

    filterPage.selectFilter('accessibilitytype');

    cy.wait('@getAccessibility')
      .its('response.statusCode')
      .should('eq', filterData.accessibilitytype.expectedStatus);
  });

  // ─── Test 4 ───────────────────────────────────────────────────
  // בוחר את שלושת הפילטרים — מאמת שכל אחד יורט בנפרד ומחזיר 200
  it('should intercept all three filter API requests and verify all return status 200', () => {
    // רישום שלושת ה-intercepts לפני ביצוע פעולות כלשהן
    cy.intercept('GET', filterData.cities.apiPattern,            { statusCode: 200, body: filterData.cities.stubBody }).as('getCities');
    cy.intercept('GET', filterData.categories.apiPattern,        { statusCode: 200, body: filterData.categories.stubBody }).as('getCategories');
    cy.intercept('POST', filterData.accessibilitytype.apiPattern, { statusCode: 200, body: filterData.accessibilitytype.stubBody }).as('getAccessibility'); // POST!

    // כל בחירה שולחת fetch() נפרד ל-endpoint שלה
    filterPage.selectFilter('cities');
    filterPage.selectFilter('categories');
    filterPage.selectFilter('accessibilitytype');

    // אימות שלוש הבקשות — כולן חייבות לחזור עם 200
    cy.wait('@getCities')       .its('response.statusCode').should('eq', 200);
    cy.wait('@getCategories')   .its('response.statusCode').should('eq', 200);
    cy.wait('@getAccessibility').its('response.statusCode').should('eq', 200);
  });

});
