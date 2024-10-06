describe('logout', () => {
  it('logout menu item logs user out', function () {
    cy.login();
    cy.visit('/');

    cy.get('#sidebarMenu #account-menu .nav-icon:first').click();
    cy.get('#sidebarMenu').contains('Sign Out').click();

    cy.get('input[name=email]').should('be.visible');

    cy.getCookie('auth_cookie').should('not.exist');
  });
});
