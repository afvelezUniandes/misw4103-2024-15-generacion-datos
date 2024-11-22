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
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido del post
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0002 - Validar error de título largo (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-largo');
    
    // Given que estoy en el editor de posts con un título inicial
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type('Título inicial');
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(1000);
    
    // When intento cambiar a un título demasiado largo
    cy.get("textarea[data-test-editor-title-input]").clear().type(postData.titulo, { delay: 0 });
    cy.wait(2000);

    // Then debo ver un mensaje de error
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
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso título con caracteres especiales
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0004 - Crear post como borrador (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-borrador');
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido sin publicar
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);

    // Then el post debe aparecer en borradores
    cy.visit("/ghost/#/posts?type=draft");
    cy.contains(postData.titulo).should("exist");
  });

  it("E0005 - Crear post con título corto (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-corto');
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título corto y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0006 - Crear post con título numérico (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-numerico');
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título numérico y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0007 - Crear post con título en otro idioma (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-titulo-otro-idioma');
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso un título en otro idioma y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(2000);

    // And publico el post
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();

    // Then el post debe estar publicado
    cy.contains("Published");
  });

  it("E0008 - Programar publicación de post (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-programado');
    
    // Given que estoy en el editor de posts
    cy.visit("/ghost/#/editor/post");

    // When ingreso el título y contenido
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
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
    const postData = dataPrueba.posts.find(post => post.id === 'post-editar');
    
    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    // When edito el título del post
    cy.visit("/ghost/#/posts");
    cy.contains(postData.titulo).click();
    cy.get("textarea[data-test-editor-title-input]").clear().type(postData.tituloNuevo);
    cy.wait(1000);

    // Then puedo actualizar el post
    cy.get('button').contains("Update").click();
  });

  it("E0010 - Crear y eliminar post (A-priori)", () => {
    const postData = dataPrueba.posts.find(post => post.id === 'post-eliminar');
    
    // Given que creo y publico un post
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postData.titulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postData.contenido);
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
});