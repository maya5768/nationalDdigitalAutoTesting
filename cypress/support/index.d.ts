declare namespace Cypress {
  interface Chainable {
    /**
     * Dismisses the cookie consent banner if it appears on the page.
     * Safe to call even when no banner is present.
     */
    dismissCookieBanner(): Chainable<void>;
  }
}
