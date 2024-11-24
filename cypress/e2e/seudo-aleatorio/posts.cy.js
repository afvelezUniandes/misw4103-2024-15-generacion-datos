describe("Pages Ghost - Escenarios con datos de Mockaroo", () => {
  let mockarooData;

  before(() => {
    const mockarooUrl = `https://my.api.mockaroo.com/${Cypress.env(
      "moockarooSchema"
    )}.json?key=${Cypress.env("moockarooKey")}`;

    cy.request(mockarooUrl).then((response) => {
      mockarooData = response.body;
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

  it("E0001 - Crear post básico", () => {
    const postData = mockarooData[0];

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

  it("E0002 - Crear post como borrador", () => {
    const postData = mockarooData[1];

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

  it("E0003 - Programar publicación de post", () => {
    const postData = mockarooData[3];

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

  it("E0004 - Crear y editar post", () => {
    const postData = mockarooData[4];

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
    cy.visit("/ghost/#/dashboard");
    cy.wait(1000);

    cy.get('button[data-test-button="close-publish-flow"]').then(($btn) => {
      if ($btn.length) {
        cy.wrap($btn).click();
      }
    });

    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).click();
    cy.get("textarea[data-test-editor-title-input]")
      .clear()
      .type(postData.tituloNuevo);
    cy.wait(1000);

    // Then puedo actualizar el post
    cy.get("button").contains("Update").click();
  });

  it("E005 - Crear y eliminar post", () => {
    const postData = mockarooData[5];

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
    cy.visit("/ghost/#/dashboard");
    cy.wait(1000);
    cy.get('button[data-test-button="close-publish-flow"]').then(($btn) => {
      if ($btn.length) {
        cy.wrap($btn).click();
      }
    });
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

  it("E006 - Crear un post y agregar etiquetas", () => {
    const postData = mockarooData[6];
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
      .type(postData.etiqueta + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E007 - Crear un post y asignar una URL ", () => {
    const postData = mockarooData[7];

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

  it("E008 - Crear un post y agregar un autor secundario", () => {
    const postData = mockarooData[8];

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

  it("E009 - Crear un post y agregar un HTML", () => {
    const postData = mockarooData[9];

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

  it("E010 - Crear un post y agregar un markDown", () => {
    const postData = mockarooData[10];

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
