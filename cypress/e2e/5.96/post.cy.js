describe("Pruebas de post", () => {
  beforeEach(() => {
    cy.login(Cypress.env("username"), Cypress.env("password"));
  });

  it("P004 - Crear nuevo post", () => {
    // Given Abro Post
    cy.visit("/ghost/#/editor/post");
    cy.screenshot("P004-Paso1-PaginaDeEditor");

    // When Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]").type("Nuevo Post{enter}");
    cy.wait(1000);
    cy.screenshot("P004-Paso2-LlenarTitulo");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();
    cy.screenshot("P004-Paso3-ClickEnPublicar");

    // And doy click en el botón de publicar ahora
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.screenshot("P004-Paso4-ClickEnPublicarAhora");

    // And doy click en el botón de confirmar
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.screenshot("P004-Paso5-ClickEnConfirmar");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P004-Paso6-MensajeDePublicado");
  });

  it("P005 - Editar post existente", () => {
    // Given Abro Post
    cy.visit("/ghost/#/posts");
    cy.screenshot("P005-Paso1-PaginaDePosts");

    // When Hago click en el post a editar
    cy.contains("Nuevo Post").click();
    cy.screenshot("P005-Paso2-ClickEnPost");

    // And Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]")
      .clear()
      .type("Post Editado{enter}");
    cy.wait(1000);
    cy.screenshot("P005-Paso3-LlenarTitulo");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-save"]')
      .contains("Update")
      .click();
    cy.screenshot("P005-Paso4-ClickEnPublicar");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P005-Paso5-MensajeDePublicado");
  });

  it("P006 - Eliminar post", () => {
    // Given Abro Post
    cy.visit("/ghost/#/posts");
    cy.screenshot("P006-Paso1-PaginaDePosts");

    // When Hago click en el post a editar
    cy.contains("Post Editado").click();
    cy.screenshot("P006-Paso2-ClickEnPost");

    // And Hago click en el botón de opciones
    cy.get("button[data-test-psm-trigger]").click();
    cy.screenshot("P006-Paso3-ClickEnOpciones");

    // And Hago click en el botón de eliminar
    cy.get('button[data-test-button="delete-post"]').click();
    cy.screenshot("P006-Paso4-ClickEnEliminar");

    // And Hago click en el botón de confirmar
    cy.get('button[data-test-button="delete-post-confirm"]').click();
    cy.screenshot("P006-Paso5-ClickEnConfirmar");

    // Then No debe existir el post
    cy.contains("Post Editado").should("not.exist");
    cy.screenshot("P006-Paso6-PostEliminado");
  });

  it("P010 - Programar post", () => {
    // Given Abro Post
    cy.visit("/ghost/#/editor/post");
    cy.screenshot("P010-Paso1-PaginaDeEditor");

    // When Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]").type("Nuevo Post{enter}");
    cy.wait(1000);
    cy.screenshot("P010-Paso2-LlenarTitulo");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();
    cy.screenshot("P010-Paso3-ClickEnPublicar");

    // And doy click en el botón de ahora
    cy.get('button[data-test-setting-title=""]').contains("Right now").click();
    cy.screenshot("P010-Paso4-ClickEnAhora");

    // And doy click en el botón de programar
    cy.get("div.gh-radio").contains("Schedule").click();
    cy.screenshot("P010-Paso5-ClickEnProgramar");

    // And doy click en el botón de programar
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.screenshot("P010-Paso6-ClickEnProgramar");

    // Then doy click en el botón de confirmar
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.screenshot("P010-Paso7-ClickEnConfirmar");
  });

  it("P007 - Guardar post como borrador", () => {
    // Given Abro post
    cy.visit("/ghost/#/editor/post");
    cy.screenshot("P007-Paso1-PaginaDeEditor");

    //When Lleno los campos de título
    cy.get("textarea[data-test-editor-title-input]").type(
      "Post en Borrador{enter}"
    );
    cy.wait(1000);
    cy.screenshot("P007-Paso2-LlenarTitulo");

    // And redirecciono a posts
    cy.visit("/ghost/#/posts");
    cy.screenshot("P007-Paso3-PaginaDePosts");

    // Then Debo ver mensaje "Draft"
    cy.contains("Draft");
    cy.screenshot("P007-Paso4-MensajeDeBorrador");
  });

  it("P009 - Ver post publicado en frontend", () => {
    // Given Abro post
    cy.visit("/ghost/#/posts");
    cy.screenshot("P009-Paso1-PaginaDePosts");

    // When Hago click en el post a editar
    cy.contains("Post en Borrador").click();
    cy.wait(1000);
    cy.screenshot("P009-Paso2-ClickEnPost");

    // And doy click en el botón de preview publicar
    cy.get('button[data-test-button="publish-preview"]')
      .contains("Preview")
      .click();
    cy.wait(2000);
    cy.screenshot("P009-Paso3-ClickEnPreview");

    // Then Debo ver el post en el frontend
    cy.get("iframe").then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body).contains("Post en Borrador");
    });
    cy.screenshot("P009-Paso4-PostEnFrontend");
  });

  it("P008 - Cambiar estado de borrador a publicado", () => {
    // Given Abro post
    cy.visit("/ghost/#/posts");
    cy.screenshot("P008-Paso1-PaginaDePosts");

    // When Hago click en el post a editar
    cy.contains("Post en Borrador").click();
    cy.screenshot("P008-Paso2-ClickEnPost");

    // And doy click en el botón de publicar
    cy.get('button[data-test-button="publish-flow"]')
      .contains("Publish")
      .click();
    cy.screenshot("P008-Paso3-ClickEnPublicar");

    // And doy click en el botón de publicar ahora
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.screenshot("P008-Paso4-ClickEnPublicarAhora");

    // And doy click en el botón de confirmar
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.screenshot("P008-Paso5-ClickEnConfirmar");

    // Then Debo ver mensaje "Published"
    cy.contains("Published");
    cy.screenshot("P008-Paso6-MensajeDePublicado");
  });
});
