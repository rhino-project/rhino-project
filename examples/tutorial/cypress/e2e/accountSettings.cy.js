import { faker } from '@faker-js/faker';

describe('account settings', () => {
  beforeEach(() => {
    cy.login();
  });

  it('change name', () => {
    cy.visit('/');

    cy.get('#sidebarMenu #account-menu .nav-icon:first').click();
    cy.get('#sidebarMenu').contains('Account Settings').click();
    cy.get('#name').clear();
    cy.get('#name').type(faker.person.fullName());
    cy.get('.active > form > .btn').click();

    cy.get('.alert-success > h6').should(
      'have.text',
      'Your profile has been updated successfully'
    );
  });

  it('change nickname', function () {
    cy.visit('/');

    cy.get('#sidebarMenu #account-menu .nav-icon:first').click();
    cy.get('#sidebarMenu').contains('Account Settings').click();
    cy.get('#nickname').clear();
    cy.get('#nickname').type(faker.person.fullName());
    cy.get('.active > form > .btn').click();

    cy.get('.alert-success > h6').should(
      'have.text',
      'Your profile has been updated successfully'
    );
  });
});
