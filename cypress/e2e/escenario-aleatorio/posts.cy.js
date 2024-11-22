import { faker } from '@faker-js/faker';

describe("Posts Ghost - 13 escenarios aleatorios", () => {
  beforeEach(() => {
    cy.visit("/ghost/#/signin");
    Cypress.on("uncaught:exception", (err, runnable) => {
      console.error("Uncaught exception", err);
      return false;
    });
    
    // Login antes de cada prueba
    cy.get('input[name="identification"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/ghost/#/dashboard');
  });

  it("E0001 - Crear post con título aleatorio", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0002 - Validar mensajes de error cuando título excede 255 caracteres", () => {
    const shortTitle = faker.lorem.words(2);
    const postDescription = faker.lorem.sentence();
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(shortTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    
    cy.visit("/ghost/#/posts");
    cy.contains("Draft").should("exist");
    
    cy.contains(shortTitle).click();
    cy.wait(1000);
    
    const longTitle = faker.lorem.words(150); 
    cy.get("textarea[data-test-editor-title-input]").clear().type(longTitle);
    cy.get("span").contains("Publish").click();

    cy.get('body').then(($body) => {
      if ($body.find('.gh-alert-red').length > 0) {
        cy.get('.gh-alert-red')
          .should('exist')
          .should('contain', 'Validation failed: Title cannot be longer than 255 characters.');
      } else {
        cy.contains("Ready, set, publish.").should("exist");
        cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
        cy.get('button[data-test-button="confirm-publish"]').click();
        cy.contains("Validation failed: Title cannot be longer than 255 characters.").should("exist");
        cy.contains("Retry").should("exist");
        cy.contains("Back to settings").should("exist");
      }
    });
  });

  it("E0003 - Crear post con caracteres especiales en título", () => {
    const postTitle = `${faker.lorem.words(3)} !@#$%^&*() ${faker.lorem.word()}`;
    const postDescription = faker.lorem.sentence();
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0004 - Crear y editar post", () => {
    const originalTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();
    const editedTitle = faker.lorem.sentence();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(originalTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(originalTitle).click();
    cy.get("textarea[data-test-editor-title-input]").clear().type(editedTitle);
    cy.wait(1000);
    cy.get('button').contains("Update").click();
  });

  it("E0005 - Programar publicación de post", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.contains("Right now").click();
    cy.contains("Schedule for later").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.visit("/ghost/#/posts?type=scheduled");
    cy.contains(postTitle).should("exist").should("contain", "Scheduled");
  });

  it("E0006 - Crear post como borrador", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(2000);
    cy.visit("/ghost/#/posts?type=draft");
    cy.contains(postTitle).should("exist");
  });

  it("E0007 - Crear post con título corto", () => {
    const shortTitle = faker.lorem.word();
    const postDescription = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(shortTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0008 - Crear post con título numérico", () => {
    const numericTitle = faker.number.int({ min: 10000, max: 99999 }).toString();
    const postDescription = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(numericTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0009 - Crear y eliminar post", () => {
    const postTitle = faker.lorem.sentence();
    const postDescription = faker.lorem.sentence();
  
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(postTitle).click();
    cy.get("button.settings-menu-toggle").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();
    cy.visit("/ghost/#/posts");
    cy.contains(postTitle).should("not.exist");
  });

  it("E0010 - Crear post con título en otro idioma", () => {
    const title = "你好 привет";
    const postDescription = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(title);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0011 - Crear post y verificar historial de cambios", () => {
    const postTitle = faker.lorem.words(3);
    const postDescription = faker.lorem.sentence();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postDescription);
    cy.wait(1000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();
    cy.visit("/ghost/#/posts?type=published");
    cy.wait(1000);
    cy.contains(postTitle).click(); 
    
    cy.get("button.settings-menu-toggle").click();
    cy.get("button[data-test-toggle='post-history']").click();
    cy.contains("Post history").should("exist");
    cy.contains("Published").should("exist");
  });

  it("E0012 - Crear post y verificar preview antes de publicar", () => {
    const postTitle = faker.lorem.words(3);
    const postContent = faker.lorem.sentence();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postContent);
    cy.wait(1000);

    cy.get("button[data-test-button='publish-preview']").first().click();
    cy.wait(1000);

    cy.get('iframe.gh-pe-iframe').then($iframe => {
      const $body = $iframe.contents().find('body');
    
      cy.wrap($body).contains(postTitle).should('exist');
      cy.wrap($body).contains(postContent).should('exist');
    });
  });

  it("E0013 - Despublicar un post publicado", () => {
    const postTitle = faker.lorem.words(3);
    const postContent = faker.lorem.sentence();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(postContent);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.get("button[data-test-button='close-publish-flow']").click();
    cy.contains("Published");
    
    cy.contains(postTitle).click();
    
    cy.get('button.gh-btn-editor.darkgrey.gh-unpublish-trigger').first().click();
    cy.get("button").contains("Unpublish and revert to private draft").click();
    cy.contains("Post reverted to a draft.");
  });
});