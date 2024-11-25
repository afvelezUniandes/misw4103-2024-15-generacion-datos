import { faker } from "@faker-js/faker";

describe("Pages Ghost - 10 escenarios aleatorios", () => {
  beforeEach(() => {
    cy.visit("/ghost/#/signin");
    Cypress.on("uncaught:exception", (err, runnable) => {
      console.error("Uncaught exception", err);
      return false;
    });

    // Login antes de cada prueba
    cy.get('input[name="identification"]').type(Cypress.env("username"));
    cy.get('input[name="password"]').type(Cypress.env("password"));
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/ghost/#/dashboard");
  });

  it("E021 - Crear página con título y descripción aleatoria", () => {
    const paginaTitulo = faker.lorem.sentence();
    const paginaDescripcion = faker.lorem.paragraph();

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título aleatorio
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);

    // And ingreso una descripción aleatoria
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E022 - Crear página con título HTML y validar renderizado", () => {
    const htmlTitulo = `<h1>${faker.lorem.words(3)}</h1>`;
    const paginaDescription = faker.lorem.paragraph();

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título con formato HTML
    cy.get("textarea[data-test-editor-title-input]").type(htmlTitulo);

    // And ingreso una descripción
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescription
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E023 - Crear página y programar publicación", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.paragraph();

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso el título y descripción
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );

    // And configuro la publicación programada
    cy.get("span").contains("Publish").click();
    cy.contains("Right now").click();
    cy.contains("Schedule for later").click();

    // And confirmo la programación
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe aparecer en la lista de programadas
    cy.visit("/ghost/#/pages?type=scheduled");
    cy.contains(paginaTitulo).should("exist");
  });

  it("E024 - Crear página con contenido extenso", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.paragraph(5);

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);

    // And ingreso un contenido extenso
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E025 - Validar mensajes de error cuando título excede 255 caracteres", () => {
    const paginaTitulo = faker.lorem.words(2);
    const paginaDescripcion = faker.lorem.paragraph();

    // Given que creo una página inicial
    cy.visit("/ghost/#/editor/page");

    // When creo y publico una página con título normal
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");

    // And cierro el flujo de publicación
    cy.get("button[data-test-button='close-publish-flow']").click();

    // And edito la página con un título demasiado largo
    cy.contains(paginaTitulo).click();
    cy.wait(1000);
    const tituloLargo = faker.lorem.words(150);
    cy.get("textarea[data-test-editor-title-input]").clear().type(tituloLargo);
    cy.get("span").contains("Update").click();

    // Then debo ver el mensaje de error apropiado
    cy.get("body").then(($body) => {
      if ($body.find(".gh-alert-red").length > 0) {
        cy.get(".gh-alert-red")
          .should("exist")
          .should(
            "contain",
            "Update failed: Title cannot be longer than 255 characters."
          );
      } else {
        cy.contains("Ready, set, publish.").should("exist");
        cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
        cy.get('button[data-test-button="confirm-publish"]').click();
        cy.contains(
          "Update failed: Title cannot be longer than 255 characters."
        ).should("exist");
        cy.contains("Retry").should("exist");
        cy.contains("Back to settings").should("exist");
      }
    });
  });

  it("E026 - Despublicar una página publicada", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.paragraph();

    // Given que creo y publico una página
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(1000);

    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();
    cy.contains("Published");

    // When accedo a la página publicada
    cy.contains(paginaTitulo).click();

    // And la despublico
    cy.get('button[data-test-button="update-flow"]').first().click();
    cy.get("button").contains("Unpublish and revert to private draft").click();

    // Then la página debe estar como borrador
    cy.contains("Page reverted to a draft.");
  });

  it("E027 - Crear página como borrador y verificar su estado", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.paragraph();

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);

    // Then la página debe aparecer en la lista de borradores
    cy.visit("/ghost/#/pages?type=draft");
    cy.contains(paginaTitulo).should("exist");
  });

  it("E028 - Crear una página con contenido con titulo y contenido con emojies", () => {
    const paginaTitulo = `${faker.lorem.words(3)} 🚀🚀🚀 ${faker.lorem.word()}`;
    const paginaDescripcion = `${faker.lorem.sentence()} 🚀🚀🚀 ${faker.lorem.sentence()}`;

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);

    // Then la página debe aparecer en la lista de borradores
    cy.visit("/ghost/#/pages?type=draft");
    cy.contains(paginaTitulo).should("exist");
  });

  it("E029 - Crear página y agregar etiquetas", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.sentence();
    const paginaEtiqueta = faker.lorem.word();

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);

    // And agrego etiquetas
    cy.get("button.settings-menu-toggle").click();
    cy.get("input.ember-power-select-trigger-multiple-input")
      .first()
      .type(paginaEtiqueta + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E030 - Crear página y asignar una URL", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.sentence();
    const paginaUrl = faker.lorem.word();

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      paginaDescripcion
    );
    cy.wait(2000);

    // And asigno una url
    cy.get("button.settings-menu-toggle").click();
    cy.get('input[name="post-setting-slug"]').type(paginaUrl);
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico la pagina
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la pagina debe estar publicada
    cy.contains("Published");
  });
});
