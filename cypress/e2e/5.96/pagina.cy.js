describe("Pruebas de página", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it("P014 - Crear nueva página", () => {
    // Given Abro Página
    cy.visit("/ghost/#/editor/page");
    cy.screenshot("P014-Paso1-PaginaDeEditor");

    // When Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]").type(
      "Nueva Página{enter}"
    );
    cy.wait(1000);
    cy.screenshot("P014-Paso2-LlenarTitulo");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();
    cy.screenshot("P014-Paso3-ClickEnPublicar");

    // And doy click en el botón de publicar ahora
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.screenshot("P014-Paso4-ClickEnPublicarAhora");

    // And doy click en confirmar publicación
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.screenshot("P014-Paso5-ClickEnConfirmarPublicacion");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P014-Paso6-MensajeDePublicado");
  });

  it("P015 - Editar página existente", () => {
    // Given Abro Página
    cy.visit("/ghost/#/pages");
    cy.screenshot("P015-Paso1-PaginaDeEditor");

    // When Hago click en la página a editar
    cy.contains("Nueva Página").click();
    cy.screenshot("P015-Paso2-ClickEnPagina");

    // And Ingreso el nuevo texto
    cy.get("textarea[data-test-editor-title-input]")
      .clear()
      .type("Página Editada{enter}");
    cy.wait(1000);
    cy.screenshot("P015-Paso3-LlenarTitulo");

    // And Hago click en el botón de publicar
    cy.get('button[data-test-button="publish-save"]')
      .contains("Update")
      .click();
    cy.screenshot("P015-Paso4-ClickEnPublicar");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P015-Paso5-MensajeDePublicado");
  });

  it("P016 Eliminar página", () => {
    // Given Abro Página
    cy.visit("/ghost/#/pages");
    cy.screenshot("P016-Paso1-PaginaDeEditor");

    // When Hago click en la página a editar
    cy.contains("Página Editada").click();
    cy.screenshot("P016-Paso2-ClickEnPagina");

    // And Hago click en el botón de opciones
    cy.get("button[data-test-psm-trigger]").click();
    cy.screenshot("P016-Paso3-ClickEnOpciones");

    // And Hago click en el botón de eliminar
    cy.get('button[data-test-button="delete-post"]').click();
    cy.screenshot("P016-Paso4-ClickEnEliminar");

    // And Hago click en el botón de confirmar
    cy.get('button[data-test-button="delete-post-confirm"]').click();
    cy.screenshot("P016-Paso5-ClickEnConfirmar");

    // Then Debo ver mensaje "Página Editada"
    cy.contains("Página Editada").should("not.exist");
    cy.screenshot("P016-Paso6-PaginaEliminada");
  });
});
