import myGovPage from '../pages/MyGovPage';

interface TabData {
  id: string;
  label: string;
  expectedTitle: string;
}

interface MyGovData {
  tabs: TabData[];
  totalTabs: number;
  defaultTab: string;
  myInfoTabs: string[];
}

describe('my.gov.il | Menu Tabs Navigation', () => {

  let data: MyGovData;

  before(() => {
    cy.fixture<MyGovData>('mygov/myGovData').then((fixture) => {
      data = fixture;
    });
  });

  beforeEach(() => {
    myGovPage.visitPortal();
  });

  // ── TC-045: כל 12 לשוניות ה-Menu Tabs מוצגות בתפריט ────────────
  it('TC-045 — כל 12 לשוניות ה-Menu Tabs מוצגות בתפריט הצדדי', () => {
    myGovPage.navTabs.should('have.length', data.totalTabs);

    data.tabs.forEach(tab => {
      cy.get(`.tab-link[data-tab="${tab.id}"]`)
        .should('exist')
        .and('contain.text', tab.label);
    });
  });

  // ── TC-010: דף הבית פעיל כברירת מחדל ───────────────────────────
  it('TC-010 — לשונית "דף הבית" פעילה כברירת מחדל עם תוכן גלוי', () => {
    myGovPage.tabLink('home').should('have.class', 'active');
    myGovPage.tabLink('home').should('have.attr', 'aria-selected', 'true');
    myGovPage.tabPanel('home').should('have.class', 'active');
    myGovPage.tabTitle.should('contain.text', 'ברוכה הבאה');
  });

  // ── TC-031: ניווט ללשונית "מסמכים" ─────────────────────────────
  it('TC-031 — לחיצה על "מסמכים" מציגה את תוכן המסמכים ומסתירה את דף הבית', () => {
    myGovPage.clickTab('documents');

    myGovPage.shouldHaveActiveTab('documents');
    myGovPage.shouldShowPanel('documents');
    myGovPage.tabTitle.should('contain.text', 'המסמכים שלך');

    myGovPage.tabPanel('home').should('not.have.class', 'active');
    myGovPage.tabLink('home').should('not.have.class', 'active');
  });

  // ── TC-070: ניווט ללשונית "נהיגה וכלי תחבורה" (קבוצת "המידע שלי")
  it('TC-070 — לשוניות קבוצת "המידע שלי": ניווט לנהיגה וכלי תחבורה', () => {
    myGovPage.clickTab('driving');

    myGovPage.shouldHaveActiveTab('driving');
    myGovPage.shouldShowPanel('driving');
    myGovPage.tabTitle.should('contain.text', 'הרכב והנהיגה שלך');
    myGovPage.shouldHidePanels('driving');
  });

  // ── TC-082: נגישות — aria-selected על לשוניות ───────────────────
  it('TC-082 — נגישות: רק הלשונית הפעילה מסומנת aria-selected="true"', () => {
    myGovPage.clickTab('health');

    myGovPage.tabLink('health').should('have.attr', 'aria-selected', 'true');

    cy.get('.tab-link:not([data-tab="health"])')
      .each($tab => {
        cy.wrap($tab).should('have.attr', 'aria-selected', 'false');
      });
  });

  // ── TC-048: רק לשונית אחת פעילה בכל עת ─────────────────────────
  it('TC-048 — מעבר בין לשוניות: רק לשונית אחת active בכל עת', () => {
    myGovPage.clickTab('documents');
    cy.get('.tab-link.active').should('have.length', 1);

    myGovPage.clickTab('health');
    cy.get('.tab-link.active').should('have.length', 1);
    myGovPage.tabLink('documents').should('not.have.class', 'active');

    myGovPage.clickTab('money');
    cy.get('.tab-link.active').should('have.length', 1);
    cy.get('.tab-panel.active').should('have.length', 1);
  });

  // ── TC-051: מעבר בין כל 12 הלשוניות — כותרת ייחודית לכל אחת ──
  it('TC-051 — מעבר בכל 12 לשוניות ה-Menu Tabs מציג כותרת ייחודית', () => {
    data.tabs.forEach(tab => {
      myGovPage.clickTab(tab.id as Parameters<typeof myGovPage.clickTab>[0]);
      myGovPage.tabTitle.should('contain.text', tab.expectedTitle);
      cy.get('.tab-panel.active').should('have.length', 1);
    });
  });

});
