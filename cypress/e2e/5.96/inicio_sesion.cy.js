describe("Pruebas de inicio de sesión", () => {
  it("P001 - Inicio de sesión inválido", () => {
    // Given Abro Ghost
    cy.visit("/ghost/#/signin");
    cy.screenshot("P001-Paso1-PaginaDeInicioSesion");

    // When Inicio sesión con usuario incorrecto
    cy.get('input[name="identification"]').type("wrong@example.com");
    cy.screenshot("P001-Paso2-UsuarioIncorrecto");

    // And Inicio sesión con contraseña incorrecta
    cy.get('input[name="password"]').type("wrongpassword");
    cy.screenshot("P001-Paso3-ContrasenaIncorrecta");

    // And Hago click en el botón de inicio de sesión
    cy.get('button[type="submit"]').click();
    cy.screenshot("P001-Paso4-ClickEnIniciarSesion");

    // Then Debo ver mensaje "There is no user with that email address."
    cy.contains("There is no user with that email address.");
    cy.screenshot("P001-Paso5-MensajeDeError");
  });

  it("P002 - Inicio de sesión válido", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    // Given Abro Ghost
    cy.visit("/ghost/#/signin");
    cy.screenshot("P002-Paso1-PaginaDeInicioSesion");

    // When Inicio de sesión válido
    cy.login(username, password);
    cy.screenshot("P002-Paso2-InicioSesionExitoso");

    // Then Debo ver el dashboard
    cy.url().should("include", "/ghost/#/dashboard");
    cy.screenshot("P002-Paso3-Dashboard");
  });

  it("P003 - Logout de sesión válido", () => {
    // Given Abro Ghost
    cy.visit("/ghost/#/signin");
    cy.screenshot("P003-Paso1-PaginaDeInicioSesion");

    // When Inicio de sesión válido
    cy.login(Cypress.env("username"), Cypress.env("password"));
    cy.screenshot("P003-Paso2-InicioSesionExitoso");

    // Then Cierro sesión
    cy.logout();
    cy.screenshot("P003-Paso3-CerrarSesion");
  });
});
