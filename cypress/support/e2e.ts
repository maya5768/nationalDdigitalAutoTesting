import './commands';

Cypress.on('uncaught:exception', (err: Error) => {
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Non-Error promise rejection')
  ) {
    return false;
  }
});
