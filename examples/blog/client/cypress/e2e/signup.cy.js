import { v4 as uuidv4 } from 'uuid';
import api from '../../src/models/static';

describe('signup', () => {
  it('signup screen works', function () {
    const allowSignup = api.info['x-rhino'].modules.rhino.allow_signup;

    cy.visit('/');

    if (!allowSignup) {
      cy.get('a[href="/auth/signup"]').should('not.exist');
      return;
    }

    cy.get('a[href="/auth/signup"]').click();

    cy.get('input[name=email]').type(`${uuidv4()}@example.com`);
    cy.get('#password').clear();
    cy.get('#password').type('password');
    cy.get('#password_confirmation').clear();
    cy.get('#password_confirmation').type('password');
    cy.get('.btn-secondary').click();

    cy.get('.btn').should('be.visible');
  });
});
