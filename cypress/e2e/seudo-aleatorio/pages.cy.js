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

    // Login antes de cada prueba
    cy.get('input[name="identification"]').type(Cypress.env("username"));
    cy.get('input[name="password"]').type(Cypress.env("password"));
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/ghost/#/dashboard");
  });

  it("E011 - Crear página con título y descripción", () => {
    const pageData = mockarooData[11];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título y una descripción
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(2000);

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E012 - Crear página y programar publicación", () => {
    const pageData = mockarooData[12];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso el título y descripción
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
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
    cy.contains(pageData.titulo).should("exist");
  });

  it("E013 - Crear página debe mostrar mensaje si no he guardado", () => {
    const pageData = mockarooData[13];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When ingreso un título y una descripción
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(2000);

    // Then el post debe aparecer en borradores
    cy.visit("/ghost/#/page?type=draft");
    cy.contains("Are you sure you want to leave this page?");
  });

  it("E014 - Despublicar una página publicada", () => {
    const pageData = mockarooData[14];

    // Given que creo y publico una página
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(1000);

    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();
    cy.contains("Published");

    // When accedo a la página publicada
    cy.contains(pageData.titulo).click();

    // And la despublico
    cy.get('button[data-test-button="update-flow"]').first().click();
    cy.get("button").contains("Unpublish and revert to private draft").click();

    // Then la página debe estar como borrador
    cy.contains("Page reverted to a draft.");
  });

  it("E015 - Crear página como borrador y verificar su estado", () => {
    const pageData = mockarooData[15];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(2000);

    // Then la página debe aparecer en la lista de borradores
    cy.visit("/ghost/#/pages?type=draft");
    cy.contains(pageData.titulo).should("exist");
  });

  it("E016 - Crear página y agregar etiquetas", () => {
    const pageData = mockarooData[16];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(2000);

    // And agrego etiquetas
    cy.get("button.settings-menu-toggle").click();
    cy.get("input.ember-power-select-trigger-multiple-input")
      .first()
      .type(pageData.etiqueta + "{enter}");
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E017 - Crear página y asignar una URL", () => {
    const pageData = mockarooData[17];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(2000);

    // And asigno una url
    cy.get("button.settings-menu-toggle").click();
    cy.get('input[name="post-setting-slug"]').type(pageData.url);
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E018 - Crear una página y agregar un autor secundario", () => {
    const pageData = mockarooData[18];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido
    );
    cy.wait(2000);

    // And agrego un autor secundario
    cy.get("button.settings-menu-toggle").click();
    cy.get('div[data-test-token-input="true"]').last().click({ force: true });
    cy.get("input.ember-power-select-trigger-multiple-input")
      .last()
      .type(pageData.autor + "{enter}", { force: true });
    cy.wait(2000);
    cy.get("button.settings-menu-toggle").click();

    // And publico la página
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la página debe estar publicada
    cy.contains("Published");
  });

  it("E019 - Crear una página y agregar un HTML", () => {
    const pageData = mockarooData[19];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido + "{enter}"
    );
    cy.wait(2000);

    // And agrego un html
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="HTML"]').click();
    cy.get('div[contenteditable="true"][data-language="html"]').type(
      pageData.html
    );
    cy.wait(2000);

    // And publico la pagina
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la pagina debe estar publicada
    cy.contains("Published");
  });

  it("E020 - Crear un post y agregar un markDown", () => {
    const pageData = mockarooData[19];

    // Given que estoy en el editor de páginas
    cy.visit("/ghost/#/editor/page");

    // When creo una página sin publicarla
    cy.get("textarea[data-test-editor-title-input]").type(pageData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(
      pageData.contenido + "{enter}"
    );
    cy.wait(2000);

    // And agrego un markdown
    cy.get('button[aria-label="Add a card"]').click();
    cy.get('button[data-kg-card-menu-item="Markdown"]').click();
    cy.get("div.CodeMirror-code").type(pageData.markdown);

    cy.wait(2000);

    // And publico la pagina
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then la pagina debe estar publicada
    cy.contains("Published");
  });
});
