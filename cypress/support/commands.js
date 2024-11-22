// Comando para inicio de sesión válido
Cypress.Commands.add("login", (email, password) => {
  // Given Abro Ghost
  cy.visit("/ghost/#/signin");
  // When Inicio sesión con usuario
  cy.get('input[name="identification"]').type(email);
  // And Inicio sesión con contraseña
  cy.get('input[name="password"]').type(password);
  // And Hago click en el botón de inicio de sesión
  cy.get('button[type="submit"]').click();
  // Then Verifico que estoy en la página de dashboard
  cy.url().should("include", "/ghost/#/dashboard");
});

// Comando para cerrar sesión
Cypress.Commands.add("logout", () => {
  cy.get(".gh-user-avatar").click();
  cy.get("a.user-menu-signout").click();
  cy.url().should("include", "/ghost/#/signin");
});
