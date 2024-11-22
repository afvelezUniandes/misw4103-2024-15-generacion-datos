describe("Pruebas de sitio", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it("P020 - Ver página del sitio", () => {
    // Navega a la página principal de Ghost
    cy.visit("/ghost/#/dashboard");

    // Haz clic en el enlace para ver el sitio
    cy.get('a[data-test-nav="site"]').click();
  });
});
