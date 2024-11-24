import { faker } from "@faker-js/faker";

describe("Posts Ghost - escenarios aleatorios", () => {
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

  it("E001 - Crear post con título aleatorio", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título aleatorio y una descripción
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E002 - Validar mensajes de error cuando título excede 255 caracteres", () => {
    const shortTitle = faker.lorem.words(2);
    const postDescription = faker.lorem.sentence();

    // Given que creo un borrador de post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(shortTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(1000);

    // When verifico que existe como borrador
    cy.visit("/ghost/#/posts");
    cy.contains("Draft").should("exist");

    // And edito el título con uno demasiado largo
    cy.contains(shortTitle).click();
    cy.wait(1000);
    const longTitle = faker.lorem.words(150);
    cy.get("textarea[data-test-editor-title-input]").clear().type(longTitle);
    cy.get("span").contains("Publish").click();

    // Then debo ver el mensaje de error apropiado
    cy.get("body").then(($body) => {
      if ($body.find(".gh-alert-red").length > 0) {
        cy.get(".gh-alert-red")
          .should("exist")
          .should(
            "contain",
            "Validation failed: Title cannot be longer than 255 characters."
          );
      } else {
        cy.contains("Ready, set, publish.").should("exist");
        cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
        cy.get('button[data-test-button="confirm-publish"]').click();
        cy.contains(
          "Validation failed: Title cannot be longer than 255 characters."
        ).should("exist");
        cy.contains("Retry").should("exist");
        cy.contains("Back to settings").should("exist");
      }
    });
  });

  it("E003 - Crear post con caracteres especiales en título", () => {
    const postTitle = `${faker.lorem.words(
      3
    )} !@#$%^&*() ${faker.lorem.word()}`;
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título con caracteres especiales
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E004 - Crear y editar post", () => {
    const originalTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();
    const editedTitle = faker.lorem.sentence();

    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(originalTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // When edito el título del post
    cy.visit("/ghost/#/posts");
    cy.contains(originalTitle).click();
    cy.wait(1000);
    cy.get("textarea[data-test-editor-title-input]").clear().type(editedTitle);
    cy.wait(1000);

    // Then puedo actualizar el post
    cy.get("button").contains("Update").click();
  });

  it("E005 - Programar publicación de post", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When creo un nuevo post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
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
    cy.contains(postTitle).should("exist").should("contain", "Scheduled");
  });

  it("E006 - Crear post como borrador", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When creo un nuevo post sin publicarlo
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // Then el post debe aparecer como borrador
    cy.visit("/ghost/#/posts?type=draft");
    cy.contains(postTitle).should("exist");
  });

  it("E007 - Crear post con título corto", () => {
    const shortTitle = faker.lorem.word();
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When creo un post con título corto
    cy.get("textarea[data-test-editor-title-input]").type(shortTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E008 - Crear post con título numérico", () => {
    const numericTitle = faker.number
      .int({ min: 10000, max: 99999 })
      .toString();
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When creo un post con título numérico
    cy.get("textarea[data-test-editor-title-input]").type(numericTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(1000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E009 - Crear y eliminar post", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();

    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // When elimino el post
    cy.visit("/ghost/#/posts");
    cy.contains(postTitle).click();
    cy.wait(1000);
    cy.get("button.settings-menu-toggle").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();

    // Then el post no debe existir
    cy.visit("/ghost/#/posts");
    cy.contains(postTitle).should("not.exist");
  });

  it("E010 - Crear post con título en otro idioma", () => {
    const title = "你好 привет";
    const postDescription = faker.lorem.sentence();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When creo un post con título en otro idioma
    cy.get("textarea[data-test-editor-title-input]").type(title);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(1000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0011 - Crear post y verificar historial de cambios", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();

    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();

    // When reviso el historial del post
    cy.visit("/ghost/#/posts?type=published");
    cy.wait(1000);
    cy.contains(postTitle).click();
    cy.get("button.settings-menu-toggle").click();
    cy.get("button[data-test-toggle='post-history']").click();

    // Then debo ver el historial de cambios
    cy.contains("Post history").should("exist");
    cy.contains("Published").should("exist");
  });

  it("E0012 - Crear post y verificar preview antes de publicar", () => {
    const postTitle = faker.lorem.words(3);
    const postContent = faker.lorem.sentence();

    // Given que estoy creando un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postContent
    );
    cy.wait(1000);

    // When previsualizo el post
    cy.get("button[data-test-button='publish-preview']").first().click();
    cy.wait(1000);

    // Then debo ver el contenido en la preview
    cy.get("iframe.gh-pe-iframe").then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body).contains(postTitle).should("exist");
      cy.wrap($body).contains(postContent).should("exist");
    });
  });

  it("E013 - Despublicar un post publicado", () => {
    const postTitle = faker.lorem.words(3);
    const postContent = faker.lorem.sentence();

    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postContent
    );
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();
    cy.contains("Published");

    // When despublico el post
    cy.contains(postTitle).click();
    cy.get("button.gh-btn-editor.darkgrey.gh-unpublish-trigger")
      .first()
      .click();
    cy.get("button").contains("Unpublish and revert to private draft").click();

    // Then el post debe estar como borrador
    cy.contains("Post reverted to a draft.");
  });

  it("E014 - Crear Post con contenido con titulo y contenido con emojies", () => {
    const postTitle = `${faker.lorem.words(3)} 🚀🚀🚀 ${faker.lorem.word()}`;
    const postDescription = `${faker.lorem.sentence()} 🚀🚀🚀 ${faker.lorem.sentence()}`;

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E015 - Crear Post y agregar etiquetas", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();
    const postEtiqueta = faker.lorem.word();
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And agrego etiquetas
    cy.get("button.settings-menu-toggle").click();
    cy.get("input.ember-power-select-trigger-multiple-input")
      .first()
      .type(postEtiqueta + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E016 - Crear Post y asignar una URL", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();
    const postUrl = faker.lorem.word();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And asigno una url
    cy.get("button.settings-menu-toggle").click();
    cy.get('input[name="post-setting-slug"]').type(postUrl);
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E017 - Crear post y asignar un autor secundario", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();
    const postAutor = faker.lorem.word();

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription
    );
    cy.wait(2000);

    // And agrego un autor secundario
    cy.get("button.settings-menu-toggle").click();
    cy.get('div[data-test-token-input="true"]').last().click();
    cy.get("input.ember-power-select-trigger-multiple-input")
      .last()
      .type(postAutor + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E018 - Crear post y agregar un HTML", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();
    const postHTML = `<p>${faker.lorem.word()}</p>`;

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription + "{enter}"
    );
    cy.wait(2000);

    // And agrego un html
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="HTML"]').click();
    cy.get('div[contenteditable="true"][data-language="html"]').type(postHTML);
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E019 - Crear un post y agregar un markDown", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();
    const postMarkDown = `## ${faker.lorem.words({ min: 2, max: 5 })}`;

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription + "{enter}"
    );
    cy.wait(2000);

    // And agrego un markdown
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="Markdown"]').click();
    cy.get("div.CodeMirror-code").type(postMarkDown);

    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E020 - Crear post y agregar un divider en el contenido", () => {
    const postTitle = "Post con cita en el contenido";
    const postDescription = "Este es un post con una cita en el contenido.";
    const quoteText = "Esta es una cita de ejemplo.";

    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      postDescription + "{enter}"
    );
    cy.wait(2000);

    // And agrego una cita en el contenido
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="Divider"]').click();
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });
});
