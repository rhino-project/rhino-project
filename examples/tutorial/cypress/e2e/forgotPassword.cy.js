describe('forgot password', () => {
  it('forget password form works', () => {
    cy.visit('/');

    cy.contains('Forgot Password?').click();

    cy.get('input[name=email]').type(Cypress.config('testUser').email);

    cy.get('.btn').contains('Reset Password').click();

    cy.get('.alert-success > h6').should('have.text', 'Reset Password');
  });
});
