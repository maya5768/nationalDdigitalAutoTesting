Cypress.Commands.add('dismissCookieBanner', () => {
  cy.get('body').then(($body: JQuery<HTMLBodyElement>) => {
    const banner = $body.find(
      '.cookie-banner button, #onetrust-accept-btn-handler, [class*="cookie"] button'
    );
    if (banner.length > 0) {
      cy.wrap(banner.first()).click({ force: true });
    }
  });
});
