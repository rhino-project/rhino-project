import { faker } from '@faker-js/faker';
import api from '../../app/frontend/models/static';

describe('signup', () => {
  it('signup screen works', function () {
    const allowSignup = api.info['x-rhino'].modules.rhino.allow_signup;

    cy.visit('/');

    if (!allowSignup) {
      cy.get('a[href="/auth/signup"]').should('not.exist');
      return;
    }

    cy.get('a[href="/auth/signup"]').click();

    cy.get('input[name=email]').type(faker.internet.email());
    cy.get('#password').clear();
    cy.get('#password').type('password');
    cy.get('#password_confirmation').clear();
    cy.get('#password_confirmation').type(faker.internet.password());
    cy.get('.btn-primary').click();

    cy.get('.btn').should('be.visible');
  });
});
