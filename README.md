# National Digital Auto Testing

מדריך ופרויקט תרגול לבדיקות API ולבדיקות אוטומטיות עם Cypress.

## נושאים

- API Testing מול `gov.il` באמצעות Postman
- Cypress E2E Testing
- Page Object Model עם TypeScript
- Fixtures ונתוני בדיקה
- Custom Commands ב-Cypress
- Java GCD algorithm

## עדכון חשוב: חסימת gov.il

במהלך הרצת בדיקות ה-Cypress מול האתר האמיתי `https://www.gov.il/he`, האתר החזיר:

```text
403 Forbidden
Sorry, you have been blocked
```

זו חסימת אבטחה של האתר הממשלתי, ככל הנראה דרך מנגנון שמזהה תעבורת אוטומציה. לכן לא ממשיכים לנסות לעקוף את החסימה.

במקום זאת נוצר אתר דמו מקומי:

```text
cypress/fixtures/gov-demo/search.html
```

הדמו כולל Header, כפתור חיפוש, שדה חיפוש, תוצאות חיפוש ובאנר Cookies. כך אפשר להמשיך לתרגל Cypress בצורה יציבה ובטוחה, בלי להיתקל בחסימות של האתר הממשלתי.

## שינויים שבוצעו

- `cypress.config.js` כבר לא מצביע על `https://www.gov.il`.
- `SearchPage.ts` פותח את אתר הדמו המקומי במקום `/he`.
- `BasePage.ts` חזר ל-`cy.visit(path)` רגיל.
- נוסף קובץ דמו: `cypress/fixtures/gov-demo/search.html`.
- `searchData.json` עודכן לנתונים באנגלית שמתאימים לדמו.
- נוספה הפקודה `cy.dismissCookieBanner()` גם ב-`commands.js`, כדי לוודא ש-Cypress טוען אותה.
- נוסף `ignoreDeprecations: "6.0"` ל-`tsconfig.json`, כדי לפתור שגיאת TypeScript 6.

## מבנה הפרויקט

```text
index.html
README.md
cypress.config.js
tsconfig.json

cypress/
├── e2e/
│   └── search.cy.ts
├── fixtures/
│   ├── gov-demo/
│   │   └── search.html
│   └── search/
│       └── searchData.json
├── pages/
│   ├── BasePage.ts
│   └── SearchPage.ts
└── support/
    ├── commands.js
    ├── commands.ts
    ├── e2e.ts
    └── index.d.ts
```

## הרצה

אם Cypress מותקן תקין:

```bash
npm run cy:open
```

אם מתקבלת שגיאת cache או binary חסר:

```bash
npx cypress install
npm run cy:open
```

חשוב לסגור חלונות Cypress/Chrome פתוחים לפני `npx cypress install`, כדי למנוע שגיאת `EBUSY`.

## תוצאות בדיקה

- `results/postman/` - תוצאות Postman Collection Run
- `results/cypress/` - screenshots ודוחות Cypress
