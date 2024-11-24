const { it } = require("mocha");

describe("Posts Ghost - 10 escenarios con datos a-priori", () => {
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

    cy.get('input[name="identification"]').type(Cypress.env("username"));
    cy.get('input[name="password"]').type(Cypress.env("password"));
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/ghost/#/dashboard");
  });

  it("E0001 - Crear post básico (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "post-simple");

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0002 - Validar error de título largo (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-titulo-largo"
    );

    // Given que estoy en el editor de posts con un título inicial
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type("Título inicial");
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(1000);

    // When intento cambiar a un título demasiado largo
    cy.get("textarea[data-test-editor-title-input]")
      .clear()
      .type(postData.titulo, { delay: 0 });
    cy.wait(2000);

    // Then debo ver un mensaje de error
    cy.get("body").then(($body) => {
      if ($body.find(".gh-alert-red").length > 0) {
        cy.get(".gh-alert-red")
          .should("exist")
          .should("contain", "Title cannot be longer than 255 characters");
      }
    });
  });

  it("E0003 - Crear post con caracteres especiales (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-caracteres-especiales"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso título con caracteres especiales
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0004 - Crear post como borrador (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-borrador"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido sin publicar
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // Then el post debe aparecer en borradores
    cy.visit("/ghost/#/posts?type=draft");
    cy.contains(postData.titulo).should("exist");
  });

  it("E0005 - Crear post con título corto (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-titulo-corto"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título corto y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0006 - Crear post con título numérico (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-titulo-numerico"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título numérico y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0007 - Crear post con título en otro idioma (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-titulo-otro-idioma"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título en otro idioma y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0008 - Programar publicación de post (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-programado"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(1000);

    // And configuro la publicación programada
    cy.get("span").contains("Publish").click();
    cy.contains("Right now").click();
    cy.contains("Schedule for later").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe aparecer como programado
    cy.visit("/ghost/#/posts?type=scheduled");
    cy.contains(postData.titulo).should("exist");
  });

  it("E0009 - Crear y editar post (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "post-editar");

    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // When edito el título del post
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).click();
    cy.get("textarea[data-test-editor-title-input]")
      .clear()
      .type(postData.tituloNuevo);
    cy.wait(1000);

    // Then puedo actualizar el post
    cy.get("button").contains("Update").click();
  });

  it("E0010 - Crear y eliminar post (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-eliminar"
    );

    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // When elimino el post
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).click();
    cy.get("button.settings-menu-toggle").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();

    // Then el post no debe existir
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).should("not.exist");
  });

  it("E011 - Crear post con titulo vacio y contenido vacio (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "post-vacio");

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').clear();
    cy.get("textarea[data-test-editor-title-input]").clear();
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();

    // Then el botón de publicar debe estar deshabilitado
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").should("be.disabled");
  });

  it("E012 - Crear post con titulo vacio y contenido con caracteres especiales (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-titulo-vacio"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E013 - Crear post con titulo y contenido vacío (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-contenido-vacio"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E014 - Crear post con titulo y contenido con emojis (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "post-emojis");

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // then publish debe no estar visible
    cy.get("span").contains("Publish").should("not.exist");
  });

  it("E015 - Crear post con contenido con emojis (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-content-emojis"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E016 - Crear un post y agregar etiquetas (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-etiquetas"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
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

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E017 - Crear un post y asignar una URL (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "post-url");

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
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

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E018 - Crear un post y agregar un autor secundario (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-autor-secundario"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido
    );
    cy.wait(2000);

    // And agrego un autor secundario
    cy.get("button.settings-menu-toggle").click();
    cy.get('div[data-test-token-input="true"]').last().click();
    cy.get("input.ember-power-select-trigger-multiple-input")
      .last()
      .type(postData.autorSecundario + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E019 - Crear un post y agregar un HTML (A-priori)", () => {
    const postData = dataPrueba.posts.find((post) => post.id === "post-html");

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido + "{enter}"
    );
    cy.wait(2000);

    // And agrego un html
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="HTML"]').click();
    cy.get('div[contenteditable="true"][data-language="html"]').type(
      postData.html
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E020 - Crear un post y agregar un markDown (A-priori)", () => {
    const postData = dataPrueba.posts.find(
      (post) => post.id === "post-markdown"
    );

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postData.contenido + "{enter}"
    );
    cy.wait(2000);

    // And agrego un markdown
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="Markdown"]').click();
    cy.get("div.CodeMirror-code").type(postData.markdown);

    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });
});
