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
- Manual Testing | בדיקות ידניות לטופס ממשלתי
- Azure DevOps Test Plan — Test Cases ותסריטי בדיקה

---

## Part I | Postman API Tests

### שאלה 1 — בדיקות API לאתר gov.il

קובץ ה-collection (תוצאות לאחר ריצה):
[`results/postman/Gov.il API Tests.postman_collection.json`](results/postman/Gov.il%20API%20Tests.postman_collection.json)

#### verifyEnglishLang&title

**GET** `https://www.gov.il/en`

תוצאות: **3/3 PASSED** · 200 OK · 34ms · 3.32 KB

| # | Test | תוצאה |
|---|------|--------|
| 1 | Status code is 200 | ✅ PASSED |
| 2 | Page title is in English | ✅ PASSED |
| 3 | Page language is English | ✅ PASSED |

---

#### Search - Validate Results

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

#### Search - Validate Results ver2

**GET** `https://www.gov.il/en/search?query=passport`

תוצאות: **10/10 PASSED** · 200 OK · 189ms · 21.85 KB

אותן 10 assertions כמו גרסה 1 — ההבדל: param `query` במקום `searchTerm`.

---

## Part II | Cypress

### שאלה 1 — התקנת Cypress על VS Code

Cypress הותקן בפרויקט דרך npm:

```bash
npm install --save-dev cypress
```

גרסה מותקנת: `cypress@13.17.0`

הפעלה:

```bash
npm run cy:open   # Cypress Test Runner (UI)
npm run cy:run    # Cypress ב-CLI (headless)
```

---

### שאלה 2 — בדיקות אוטומטיות לרכיב החיפוש ב-Gov.il

קובץ הבדיקות: `cypress/e2e/search.cy.ts`

המבנה מבוסס על **Page Object Model (OOP)**:

- `BasePage.ts` — מחלקת אב עם `visit()`, `getByTestId()`, `getByAriaLabel()`
- `SearchPage.ts` — יורשת מ-`BasePage`, מכילה Selectors ו-Actions לרכיב החיפוש

5 בדיקות (≥ 3 כנדרש):

| # | בדיקה |
|---|-------|
| 1 | כפתור toggle החיפוש גלוי ב-header |
| 2 | לחיצה על הכפתור פותחת את תיבת החיפוש |
| 3 | הקלדה שומרת את הטקסט ב-input |
| 4 | שליחה מנווטת לדף תוצאות + container קיים |
| 5 | ניקוי ה-input מחזיר ערך ריק |

> **הערה:** האתר האמיתי `gov.il` חוסם גישת אוטומציה (Cloudflare 403 Forbidden).
> לכן הבדיקות רצות על דמו מקומי: `cypress/fixtures/gov-demo/search.html`

---

### שאלה 3 — יירוט בקשות רשת עם cy.intercept()

קובץ הבדיקות: `cypress/e2e/filter.cy.ts`
Page Object: `cypress/pages/FilterPage.ts`

עמוד המקור: `https://www.gov.il/he/government-service-branches`

שלוש בקשות API שנמצאו ב-DevTools:

| Filter | Method | Endpoint |
|--------|--------|----------|
| cities | GET | `BureausWebApi/bureaus/GetAggregationCities` |
| categories | GET | `BureausWebApi/bureaus/GetAggregationCategories` |
| accessibilitytype | POST | `BureausWebApi/Bureaus` (payload: `{accessibility:true}`) |

4 בדיקות:

| # | בדיקה |
|---|-------|
| 1 | יירוט cities GET → status 200 |
| 2 | יירוט categories GET → status 200 |
| 3 | יירוט accessibilitytype POST → status 200 |
| 4 | שלושת הפילטרים ביחד → כולם status 200 |

הסדר חשוב: `cy.intercept()` תמיד **לפני** הפעולה שמפעילה את הבקשה.
`cy.wait('@alias').its('response.statusCode').should('eq', 200)` — כך מאמתים את הסטטוס.

---

### שאלה 4 — שינוי שדה בתגובת API עם cy.intercept()

קובץ הבדיקה: `cypress/e2e/intercept.cy.ts`

עמוד המקור: `https://www.gov.il/he/department/prime_ministers_office`

הבדיקה מיירטת את בקשת ה-API ומשנה את הערך:

```
"title": "משרד ראש הממשלה"  →  "title": "office"
```

שימוש ב-`req.reply()` להחזרת stub מותאם:

```ts
cy.intercept('GET', '**/prime_ministers_office**', (req) => {
  req.reply({ statusCode: 200, body: { title: 'office' } });
}).as('getPMOffice');
```

שני assertions: אימות ה-response stub + אימות שה-DOM עודכן.

---

### שאלה 5 — סידור Test Cases לעמוד my.gov.il

הפורטל הנבדק: `https://my.gov.il`

לאחר התחברות לפורטל, זוהו לשוניות התפריט הבאות:

| קבוצה | לשוניות |
|-------|---------|
| ניווט כללי | דף הבית · פרטים אישיים · מסמכים · היסטוריית פעילות · פעולות ושירותים · ניהול הרשאות |
| המידע שלי | נהיגה וכלי תחבורה · בריאות · כסף וביטוח · נכסים, בנייה ודיור · תעסוקה והשכלה |
| עסקים | חשבון העסק שלי |

**גישת הסידור:**
- כל לשונית = **Test Suite** עצמאי ב-Azure DevOps
- כל Suite מכיל Test Cases לפי 5 סוגים: Functional · Validation · UI · Accessibility · Security
- Login מוגדר כ**תנאי קדם (Prerequisite)** לכל Suite
- עדיפות: **High** לפונקציה ראשית, **Medium** לצדדית, **Low** לקצה
- מזהה עקבי: TC-001 (Login) · TC-010 (דף הבית) · TC-020 (פרטים אישיים) · TC-030 (מסמכים) ...

סה"כ: **53 Test Cases** ב-13 Test Suites

קובץ הבדיקות: `docs/Azure_DevOps_TestPlan_myGov_Q5.xlsx`

**אוטומציה Cypress:**
- `cypress/pages/MyGovPage.ts` — Page Object לפורטל (12 לשוניות, selectors ו-assertions)
- `cypress/fixtures/gov-demo/mygov-portal.html` — דמו מקומי עם 12 לשוניות (RTL, ARIA)
- `cypress/fixtures/mygov/myGovData.json` — נתוני fixture: labels, expected titles
- `cypress/e2e/mygov-tabs.cy.ts` — **7 בדיקות** Cypress לניווט בין לשוניות:

| TC | בדיקה |
|----|-------|
| TC-045 | כל 12 לשוניות מוצגות בתפריט |
| TC-010 | דף הבית פעיל כברירת מחדל + ARIA תקין |
| TC-031 | לחיצה על "מסמכים" מציגה תוכן ומסתירה דף הבית |
| TC-070 | ניווט לקבוצת "המידע שלי" — לשונית נהיגה |
| TC-082 | נגישות: aria-selected="true" רק על הלשונית הפעילה |
| TC-048 | רק לשונית אחת active בכל עת |
| TC-051 | מעבר בין כל 12 הלשוניות — כותרת ייחודית לכל אחת |

---

## Part III | General Questions

### שאלה 1 — מדוע הקוד נכשל?

```js
const SearchInputBox = cy.get('.gLFyf');
cy.visit('https://www.google.com/');
SearchInputBox.first().type('Gov.il');
```

**תשובה:** תקלה בסדר הפעולות — `cy.get()` נקרא לפני `cy.visit()`.
Cypress מוסיף פקודות לתור ומריץ אותן ברצף — ה-get מתבצע לפני שהדף בכלל נטען.
**תיקון:** להעביר את `cy.visit()` לשורה הראשונה.

→ [הסבר מפורט עם דיאגרמת תור הפקודות](index.html#part3-q1)

---

### שאלה 2 — מה יודפס בסוף ריצת הקוד? (Java)

```java
int n1 = 55, n2 = 66, hint = 1;
for(int i = 1; i <= n1; ++i)
    if(n1 % i == 0 && n2 % i == 0) hint = i;
System.out.println("hint is: " + hint);
```

**תשובה:** `hint is: 11`
הקוד מוצא את ה-GCD (מחלק משותף גדול) של 55 ו-66 — ערכו **11**.

→ [הסבר מפורט עם טבלת מעקב והדגמה](index.html#part3-q2)

---

## Part IV | Manual Tests — בדיקות ידניות

### שאלה 1 — תסריטי בדיקה לטופס פניה לרשות האוכלוסין

הטופס הנבדק: `https://govforms.gov.il/mw/forms/PniyaToMeyda@piba.gov.il`

תסריטי הבדיקה חולקו ל-5 סוגים:

| סוג בדיקה | מה נבדק | דוגמה לתסריט |
|-----------|---------|--------------|
| **Functional** | שליחת טופס תקין, מעבר בין שלבים, כפתורים | מילוי כל שדות חובה ושליחת טופס → צפי: הגשה מוצלחת |
| **Validation** | שדות חובה, פורמט ת"ז / טלפון / מייל, הודעות שגיאה | הזנת ת"ז בת 8 ספרות → צפי: הודעת שגיאה |
| **UI** | עיצוב, RTL, תצוגה במובייל ובדסקטופ | פתיחה במסך 375px → צפי: תצוגה רספונסיבית תקינה |
| **Accessibility** | ניווט במקלדת, Screen Reader, תאימות WCAG | ניווט בין שדות עם Tab בלבד → צפי: כל שדה נגיש |
| **Security** | XSS, הזרקת קוד, גישה ללא הרשאה | הזנת `<script>alert(1)</script>` בשדה טקסט → צפי: סניטיזציה |

קבצי הבדיקות:
- `docs/TestPlan_ImmigrationForm_AzureDevOps.xlsx`
- `docs/Azure_DevOps_TestCases_myGovILManual.xlsx`

---

### שאלה 2 — כיצד לבדוק שנתוני הטופס נשמרו?

תוארו ארבע שיטות לאימות שמירת הנתונים:

1. **הודעת אישור על המסך** — בדיקה שמופיע banner / מודאל עם מספר אסמכתא לאחר שליחה
2. **מייל אישור** — בדיקה שמגיע מייל עם כל פרטי הפניה שהוזנו
3. **שמירת טיוטה / ניווט וחזרה** — מילוי חלקי, ניווט אחורה, ווידוא שהנתונים נשמרו בין השלבים
4. **אימות API / DB** — שליחת בקשה לנקודת הקצה של הגשה ובדיקה שהנתונים הוחזרו כצפוי

קובץ ההסבר: `docs/Part4_Q2_שמירת_נתוני_טופס.docx`

---

## עדכון חשוב: חסימת gov.il

במהלך הרצת בדיקות ה-Cypress מול האתר האמיתי `https://www.gov.il/he`, האתר החזיר:

```text
403 Forbidden
Sorry, you have been blocked
```

זו חסימת אבטחה (Cloudflare) שמזהה תעבורת אוטומציה. לכן נוצרו דפי דמו מקומיים לכל שאלה.

---

## מבנה הפרויקט

```text
index.html
README.md
cypress.config.js
tsconfig.json

docs/
├── exam.pdf                                        ← מסמך הבחינה
├── TestPlan_ImmigrationForm_AzureDevOps.xlsx       ← Part IV שאלה 1 — תסריטי בדיקה
├── Azure_DevOps_TestCases_myGovILManual.xlsx       ← Part IV שאלה 1 — Test Cases ידניים
├── Azure_DevOps_AutoTestPlan_myGovIL.xlsx          ← תכנית בדיקות אוטומטיות
├── Azure_DevOps_TestPlan_myGov_Q5.xlsx             ← שאלה 5 — Test Plan מלא ל-my.gov.il
└── Part4_Q2_שמירת_נתוני_טופס.docx                ← Part IV שאלה 2 — שמירת נתונים

cypress/
├── e2e/
│   ├── search.cy.ts                       ← שאלה 2
│   ├── filter.cy.ts                       ← שאלה 3
│   ├── intercept.cy.ts                    ← שאלה 4
│   └── mygov-tabs.cy.ts                   ← שאלה 5 — 7 בדיקות ניווט בין לשוניות
├── fixtures/
│   ├── gov-demo/
│   │   ├── search.html                    ← דמו חיפוש (שאלה 2)
│   │   ├── filters.html                   ← דמו פילטרים (שאלה 3)
│   │   ├── prime-ministers.html           ← דמו ראש הממשלה (שאלה 4)
│   │   └── mygov-portal.html              ← דמו my.gov.il עם 12 לשוניות (שאלה 5)
│   ├── mygov/
│   │   └── myGovData.json                 ← fixture לבדיקות לשוניות (שאלה 5)
│   ├── search/
│   │   └── searchData.json
│   ├── filters/
│   │   └── filterData.json                ← שאלה 3
│   └── primeMinistersOffice.json          ← שאלה 4
├── pages/
│   ├── BasePage.ts
│   ├── SearchPage.ts
│   ├── FilterPage.ts                      ← שאלה 3
│   └── MyGovPage.ts                       ← שאלה 5 — לשוניות my.gov
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
