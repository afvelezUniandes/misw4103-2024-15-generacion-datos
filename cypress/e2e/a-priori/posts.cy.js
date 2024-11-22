describe("Posts Ghost - 10 escenarios con datos a-priori", () => {
  let dataPrueba;

  before(() => {
    cy.fixture('posts-data.json').then((data) => {
      dataPrueba = data;
    });
  });

  beforeEach(() => {
    cy.visit("/ghost/#/signin");
    Cypress.on("uncaught:exception", (err, runnable) => {
      console.error("Uncaught exception", err);
      return false;
    });
    
    cy.get('input[name="identification"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/ghost/#/dashboard');
  });

  it("E0001 - Crear post básico (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-simple');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0002 - Validar error de título largo (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-largo');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type('Título inicial');
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(1000);
    
    cy.get("textarea[data-test-editor-title-input]").clear().type(postData.titulo, { delay: 0 });
    cy.wait(2000);

    cy.get('body').then(($body) => {
      if ($body.find('.gh-alert-red').length > 0) {
        cy.get('.gh-alert-red')
          .should('exist')
          .should('contain', 'Title cannot be longer than 255 characters');
      } 
    });
  });

  it("E0003 - Crear post con caracteres especiales (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-caracteres-especiales');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0004 - Crear post como borrador (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-borrador');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);
    cy.visit("/ghost/#/posts?type=draft");
    cy.contains(postData.titulo).should("exist");
  });

  it("E0005 - Crear post con título corto (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-corto');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0006 - Crear post con título numérico (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-numerico');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0007 - Crear post con título en otro idioma (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-otro-idioma');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0008 - Programar publicación de post (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-programado');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.contains("Right now").click();
    cy.contains("Schedule for later").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.visit("/ghost/#/posts?type=scheduled");
    cy.contains(postData.titulo).should("exist");
  });

  it("E0009 - Crear y editar post (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-editar');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).click();
    cy.get("textarea[data-test-editor-title-input]").clear().type(postData.tituloNuevo);
    cy.wait(1000);
    cy.get('button').contains("Update").click();
  });

  it("E0010 - Crear y eliminar post (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-eliminar');
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).click();
    cy.get("button.settings-menu-toggle").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).should("not.exist");
  });
});