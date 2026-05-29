import searchPage from '../pages/SearchPage';

interface SearchData {
  validSearch: { term: string; expectedMinResults: number; expectedUrlSegment: string };
  anotherValidSearch: { term: string; expectedMinResults: number };
  shortSearch: { term: string; description: string };
  specialCharSearch: { term: string; description: string };
}

describe('Gov.il | Header Search Component', () => {

  let searchData: SearchData;

  before(() => {
    cy.fixture<SearchData>('search/searchData').then((data) => {
      searchData = data;
    });
  });

  beforeEach(() => {
    searchPage.visitHomePage();
    cy.dismissCookieBanner();
  });

  // ─── Test 1 ───────────────────────────────────────────────────
  it('should display the search toggle button in the header', () => {
    searchPage.searchToggleBtn.should('be.visible');
  });

  // ─── Test 2 ───────────────────────────────────────────────────
  it('should open the search input when the search button is clicked', () => {
    searchPage.searchToggleBtn.click();
    searchPage.searchInput
      .should('be.visible')
      .and('be.enabled');
  });

  // ─── Test 3 ───────────────────────────────────────────────────
  it('should allow the user to type a search term', () => {
    searchPage.openSearchBar();
    searchPage.typeSearchTerm(searchData.validSearch.term);
    searchPage.searchInput
      .should('have.value', searchData.validSearch.term);
  });

  // ─── Test 4 ───────────────────────────────────────────────────
  it('should navigate to the search results page after submitting', () => {
    searchPage.searchFor(searchData.validSearch.term);
    cy.url().should('include', searchData.validSearch.expectedUrlSegment);
    searchPage.resultsContainer.should('exist');
  });

  // ─── Test 5 ───────────────────────────────────────────────────
  it('should clear the search input when cleared', () => {
    searchPage.openSearchBar();
    searchPage.typeSearchTerm(searchData.validSearch.term);
    searchPage.clearSearchInput();
    searchPage.searchInput.should('have.value', '');
  });

});
