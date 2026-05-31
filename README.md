# National Digital Auto Testing

מדריך ופרויקט תרגול לבדיקות API ולבדיקות אוטומטיות עם Cypress — מבחן בדיקות gov.il.

## נושאים

- API Testing מול `gov.il` באמצעות Postman
- Cypress E2E Testing
- Page Object Model עם TypeScript
- Fixtures ונתוני בדיקה
- `cy.intercept()` ו-Network Stubbing
- שינוי שדות בתגובות API
- Custom Commands ב-Cypress
- Java GCD algorithm

---

## שאלה 1 — Postman API Tests

קובץ ה-collection: `Gov.il API Tests.postman_collection.json`

### verifyEnglishLang&title

**GET** `https://www.gov.il/en`

תוצאות: **3/3 PASSED** · 200 OK · 34ms · 3.32 KB

| # | Test | תוצאה |
|---|------|--------|
| 1 | Status code is 200 | ✅ PASSED |
| 2 | Page title is in English | ✅ PASSED |
| 3 | Page language is English | ✅ PASSED |

---

### Search - Validate Results

**GET** `https://www.gov.il/en/search?searchTerm=passport`

תוצאות: **10/10 PASSED** · 200 OK · 212ms · 21.65 KB

| # | Test | תוצאה |
|---|------|--------|
| 1 | Status code is 200 - Search page loaded successfully | ✅ PASSED |
| 2 | Response time is under 5000ms | ✅ PASSED |
| 3 | Response Content-Type is text/html | ✅ PASSED |
| 4 | Response body is not empty | ✅ PASSED |
| 5 | Response body contains the search term 'passport' | ✅ PASSED |
| 6 | Response HTML contains a search results section | ✅ PASSED |
| 7 | Page language attribute is English (lang='en') | ✅ PASSED |
| 8 | Page has a non-empty English title | ✅ PASSED |
| 9 | Response does not contain server error messages | ✅ PASSED |
| 10 | Response URL contains the searchTerm parameter | ✅ PASSED |

---

### Search - Validate Results ver2

**GET** `https://www.gov.il/en/search?query=passport`

תוצאות: **10/10 PASSED** · 200 OK · 189ms · 21.85 KB

אותן 10 assertions כמו גרסה 1 — ההבדל: param `query` במקום `searchTerm`.

---

## עדכון חשוב: חסימת gov.il

במהלך הרצת בדיקות ה-Cypress מול האתר האמיתי `https://www.gov.il/he`, האתר החזיר:

```text
403 Forbidden
Sorry, you have been blocked
```

זו חסימת אבטחה (Cloudflare) שמזהה תעבורת אוטומציה. לכן נוצרו דפי דמו מקומיים לכל שאלה.

---

## שינויים שבוצעו

### שאלה 2 (Cypress — חיפוש)
- `cypress.config.js` כבר לא מצביע על `https://www.gov.il`
- `SearchPage.ts` פותח את אתר הדמו המקומי במקום `/he`
- `BasePage.ts` עודכן עם הערות בעברית
- נוסף `cypress/fixtures/gov-demo/search.html` — דמו חיפוש מקומי
- `searchData.json` עודכן לנתונים שמתאימים לדמו
- נוספה `cy.dismissCookieBanner()` ב-`commands.js`
- נוסף `ignoreDeprecations: "6.0"` ל-`tsconfig.json`

### שאלה 3 (cy.intercept — פילטרים)
- נוסף `cypress/e2e/filter.cy.ts` — 4 בדיקות cy.intercept לפילטרים (cities, categories, accessibilitytype)
- נוסף `cypress/pages/FilterPage.ts` — Page Object לרכיב הפילטרים
- נוסף `cypress/fixtures/filters/filterData.json` — נתוני stub לשלושת ה-endpoints
- נוסף `cypress/fixtures/gov-demo/filters.html` — דמו מקומי לעמוד הפילטרים

### שאלה 4 (cy.intercept — שינוי title)
- נוסף `cypress/e2e/intercept.cy.ts` — בדיקת `req.reply()` לשינוי `title` מ-"משרד ראש הממשלה" ל-"office"
- נוסף `cypress/fixtures/gov-demo/prime-ministers.html` — דמו לעמוד משרד ראש הממשלה
- נוסף `cypress/fixtures/primeMinistersOffice.json` — fixture לתגובת ה-API
- עודכן `index.html` — נוסף סקשן הסבר מלא לשאלה 4 כולל דיאגרמה וקוד

---

## מבנה הפרויקט

```text
Gov.il API Tests.postman_collection.json   ← שאלה 1
index.html
README.md
cypress.config.js
tsconfig.json

cypress/
├── e2e/
│   ├── search.cy.ts                       ← שאלה 2
│   ├── filter.cy.ts                       ← שאלה 3
│   └── intercept.cy.ts                    ← שאלה 4
├── fixtures/
│   ├── gov-demo/
│   │   ├── search.html                    ← דמו חיפוש (שאלה 2)
│   │   ├── filters.html                   ← דמו פילטרים (שאלה 3)
│   │   └── prime-ministers.html           ← דמו ראש הממשלה (שאלה 4)
│   ├── search/
│   │   └── searchData.json
│   ├── filters/
│   │   └── filterData.json                ← שאלה 3
│   └── primeMinistersOffice.json          ← שאלה 4
├── pages/
│   ├── BasePage.ts
│   ├── SearchPage.ts
│   └── FilterPage.ts                      ← שאלה 3
└── support/
    ├── commands.js
    ├── commands.ts
    ├── e2e.ts
    └── index.d.ts

results/
└── postman/                               ← תוצאות Postman Collection Run
```

---

## הרצה

```bash
npm run cy:open
```

אם מתקבלת שגיאת cache או binary חסר:

```bash
npx cypress install
npm run cy:open
```

חשוב לסגור חלונות Cypress/Chrome פתוחים לפני `npx cypress install`.
