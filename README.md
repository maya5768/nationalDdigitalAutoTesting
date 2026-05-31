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

## Part IV — Manual Tests | בדיקות ידניות

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

### שאלה 5 — my.gov Test Cases (ידני + אוטומטי)
- נוסף `docs/Azure_DevOps_TestPlan_myGov_Q5.xlsx` — Test Plan ל-my.gov.il עם 53 Test Cases ב-13 Suites (לשונית = Suite)
- נוסף `cypress/fixtures/gov-demo/mygov-portal.html` — דמו מקומי של הפורטל עם כל 12 לשוניות התפריט (RTL, ARIA)
- נוסף `cypress/fixtures/mygov/myGovData.json` — נתוני fixture לבדיקות
- נוסף `cypress/pages/MyGovPage.ts` — Page Object לפורטל my.gov
- נוסף `cypress/e2e/mygov-tabs.cy.ts` — 6 בדיקות Cypress לניווט בין לשוניות ה-Menu Tabs
- עודכן `index.html` — נוסף סקשן הסבר לשאלה 5

### שאלה 4 (cy.intercept — שינוי title)
- נוסף `cypress/e2e/intercept.cy.ts` — בדיקת `req.reply()` לשינוי `title` מ-"משרד ראש הממשלה" ל-"office"
- נוסף `cypress/fixtures/gov-demo/prime-ministers.html` — דמו לעמוד משרד ראש הממשלה
- נוסף `cypress/fixtures/primeMinistersOffice.json` — fixture לתגובת ה-API
- עודכן `index.html` — נוסף סקשן הסבר מלא לשאלה 4 כולל דיאגרמה וקוד

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
│   └── mygov-tabs.cy.ts                   ← שאלה 5 — 6 בדיקות ניווט בין לשוניות
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
