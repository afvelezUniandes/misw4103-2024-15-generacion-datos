describe("Pruebas de miembros", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it("P017 - Crear miembro", () => {
    // Given Abro Miembros
    cy.visit("/ghost/#/members");
    cy.screenshot("P017-Paso1-PaginaDeMiembros");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();
    cy.screenshot("P017-Paso2-ClickEnNuevoMiembro");

    // And Lleno los campos de nombre
    cy.get('input[name="name"]').type("Miembro Prueba");
    cy.screenshot("P017-Paso3-LlenarNombre");

    // And Lleno los campos de email
    cy.get('input[name="email"]').type("miembro@example.com");
    cy.screenshot("P017-Paso4-LlenarEmail");

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.screenshot("P017-Paso5-ClickEnGuardar");

    // And Navego a Miembros
    cy.visit("/ghost/#/members");
    cy.screenshot("P017-Paso6-PaginaDeMiembros");

    // Then Debo ver mensaje "Saved"
    cy.contains("Miembro Prueba");
    cy.screenshot("P017-Paso7-MensajeDeGuardado");
  });

  it("P018 - Editar miembro", () => {
    // Given Abro Miembros
    cy.visit("/ghost/#/members");
    cy.screenshot("P018-Paso1-PaginaDeMiembros");

    // When Hago click en el miembro creado
    cy.contains("Miembro Prueba").click();
    cy.screenshot("P018-Paso2-ClickEnMiembro");

    // And Ingreso el nuevo nombre
    cy.get('input[name="name"]').clear().type("Miembro Editado");
    cy.screenshot("P018-Paso3-LlenarNombre");

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.screenshot("P018-Paso4-ClickEnGuardar");

    // Then Debo ver mensaje "Saved"
    cy.contains("Saved");
    cy.screenshot("P018-Paso5-MensajeDeGuardado");
  });

  it("P019 - Eliminar miembro", () => {
    // Given Abro Miembros
    cy.visit("/ghost/#/members");
    cy.screenshot("P019-Paso1-PaginaDeMiembros");

    // When Hago click en el miembro editado
    cy.contains("Miembro Editado").click();
    cy.screenshot("P019-Paso2-ClickEnMiembro");

    // And Hago click en el botón de acciones
    cy.get('button[data-test-button="member-actions"]').click();
    cy.screenshot("P019-Paso3-ClickEnAcciones");

    // And Hago click en el botón de eliminar
    cy.get('button[data-test-button="delete-member"]').click();
    cy.screenshot("P019-Paso4-ClickEnEliminar");

    // And Hago click en el botón de confirmar
    cy.get('button[data-test-button="confirm"]').click();
    cy.screenshot("P019-Paso5-ClickEnConfirmar");

    // Then Debo ver mensaje "Miembro
    cy.contains("Miembro Editado").should("not.exist");
    cy.screenshot("P019-Paso6-MiembroEliminado");
  });
});
