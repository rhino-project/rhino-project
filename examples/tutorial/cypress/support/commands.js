// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

// https://medium.com/@t79877005/speed-up-your-cypress-test-with-this-one-simple-trick-8bb45d878070
// https://github.com/cypress-io/cypress/issues/6925#issuecomment-1073376330
Cypress.Commands.overwrite(
  'type',
  (originalFn, subject, text, options = {}) => {
    options.delay = options.delay || 0;

    return originalFn(subject, text, options);
  }
);

// https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Improving-performance
Cypress.Commands.add('login', (email, password) => {
  const testEmail = email || Cypress.config('testUser').email;
  const testPassword = password || Cypress.config('testUser').password;

  cy.session(
    testEmail,
    () => {
      cy.visit('/signin');
      cy.get('input[name=email]').type(testEmail);
      cy.get('input[name=password]').type(`${testPassword}{enter}`, {
        log: false
      });
      cy.url().should('match', /\/[0-9]+/);
    },
    {
      validate: () => {
        cy.getCookie('auth_cookie').should('exist');
      }
    }
  );
});

Cypress.Commands.add('getFormField', (path) => {
  // get form field which will have unique id on the end
  cy.get(`[id^="${path}"]`);
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
