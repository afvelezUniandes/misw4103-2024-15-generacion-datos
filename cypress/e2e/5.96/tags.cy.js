describe("Pruebas de tags", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it("P011 - Crear nueva etiqueta", () => {
    // Given Abro Etiquetas
    cy.visit("/ghost/#/tags");
    cy.screenshot("P011-Paso1-PaginaDeEtiquetas");

    // When Doy click en el botón de nueva etiqueta
    cy.get('a[href="#/tags/new/"]').click();
    cy.screenshot("P011-Paso2-ClickEnNuevaEtiqueta");

    // And Lleno los campos de la nueva etiqueta
    cy.get('input[name="name"]').type("Nueva Etiqueta");
    cy.screenshot("P011-Paso3-LlenarCampos");

    // And Doy click en el botón de guardar
    cy.get('input[name="slug"]').type("nueva-etiqueta");
    cy.screenshot("P011-Paso4-LlenarSlug");

    // And Doy click en el botón de guardar
    cy.get('textarea[name="description"]').type(
      "Descripción de la nueva etiqueta"
    );
    cy.screenshot("P011-Paso5-LlenarDescripcion");

    // And Doy click en el botón de guardar
    cy.get('button[data-test-button="save"]').click();
    cy.screenshot("P011-Paso6-ClickEnGuardar");

    // Then Debo ver mensaje "Saved"
    cy.contains("Saved");
    cy.screenshot("P011-Paso7-MensajeDeGuardado");
  });

  it("P012 - Editar etiqueta existente", () => {
    cy.visit("/ghost/#/tags");
    cy.contains("Nueva Etiqueta").click();
    cy.get('input[name="name"]').clear().type("Etiqueta Editada");
    cy.get('button[data-test-button="save"]').click();
    cy.contains("Saved");
  });

  it("P013 - Eliminar etiqueta", () => {
    // Manejar excepciones no controladas
    cy.on("uncaught:exception", (err, runnable) => {
      // Devuelve false para evitar que Cypress falle la prueba
      return false;
    });

    // Given Abro Etiquetas
    cy.visit("/ghost/#/tags");
    cy.screenshot("P013-Paso1-PaginaDeEtiquetas");

    // When Hago click en la etiqueta a editar
    cy.contains("Etiqueta Editada").click();
    cy.screenshot("P013-Paso2-ClickEnEtiqueta");

    // And Hago click en el botón de opciones
    cy.get('button[data-test-button="delete-tag"]').click();
    cy.screenshot("P013-Paso3-ClickEnOpciones");

    // And Hago click en el botón de eliminar
    cy.get('button[data-test-button="confirm"]').click();
    cy.screenshot("P013-Paso4-ClickEnEliminar");

    // Then No debe existir la etiqueta
    cy.contains("Etiqueta Editada").should("not.exist");
    cy.screenshot("P013-Paso5-EtiquetaEliminada");
  });
});
