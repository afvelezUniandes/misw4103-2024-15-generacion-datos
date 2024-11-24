const { it } = require("mocha");

describe("Pages Ghost - 10 escenarios con datos a-priori", () => {
  let dataPrueba;

  before(() => {
    cy.fixture("posts-data.json").then((data) => {
      dataPrueba = data;
    });
  });

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

  it("E021 - Crear página con título y descripción (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-titulo-descripcion"
    );

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título y una descripción
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E022 - Crear página con título HTML y validar renderizado (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-titulo-html"
    );

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título con formato HTML
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);

    // And ingreso una descripción
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E023 - Crear página y programar publicación (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-programada"
    );

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso el título y descripción
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
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
    cy.contains(postData.titulo).should("exist");
  });

  it("E024 - Crear página con contenido extenso (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-contenido-extenso"
    );

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);

    // And ingreso un contenido extenso
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E025 - Validar mensajes de error cuando título excede 255 caracteres (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-titulo-largo"
    );

    // Given que creo una página inicial
    cy.visit("/ghost/#/editor/page");

    // When creo y publico una página con título normal
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido + "{enter}"
    );
    cy.wait(2000);
    cy.get("span").contains("Publish").click();

    // Then debo ver el mensaje de error apropiado
    cy.get(".gh-alert-content")
      .should("exist")
      .and("contain", "Title cannot be longer than 255 characters.");
  });

  it("E026 - Despublicar una página publicada (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-despublicar"
    );

    // Given que creo y publico una página
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(1000);

    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();
    cy.contains("Published");

    // When accedo a la página publicada
    cy.contains(postData.titulo).click();

    // And la despublico
    cy.get('button[data-test-button="update-flow"]').first().click();
    cy.get("button").contains("Unpublish and revert to private draft").click();

    // Then la página debe estar como borrador
    cy.contains("Page reverted to a draft.");
  });

  it("E027 - Crear página como borrador y verificar su estado (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-borrador"
    );

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // Then la página debe aparecer en la lista de borradores
    cy.visit("/ghost/#/pages?type=draft");
    cy.contains(postData.titulo).should("exist");
  });

  it("E028 - Crear una página con contenido con titulo y contenido con emojis (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "page-emojis");

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // Then la página debe aparecer en la lista de borradores
    cy.visit("/ghost/#/pages?type=draft");
    cy.contains(postData.titulo).should("exist");
  });

  it("E029 - Crear página y agregar etiquetas (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "page-etiquetas"
    );

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And agrego etiquetas
    cy.get("button.settings-menu-toggle").click();
    cy.get("input.ember-power-select-trigger-multiple-input")
      .first()
      .type(postData.etiquetas[0] + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E030 - Crear página y asignar una URL (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "page-url");

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And asigno una url
    cy.get("button.settings-menu-toggle").click();
    cy.get('input[name="post-setting-slug"]').type(postData.url);
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });
});
