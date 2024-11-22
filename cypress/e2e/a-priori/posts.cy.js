import { faker } from '@faker-js/faker';

describe("Posts Ghost - 10 escenarios a-priori", () => {
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

  it("E0011 - Crear post con título aleatorio", () => {
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

  it("E0012 - Validar mensajes de error cuando título excede 255 caracteres", () => {
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

  it("E0013 - Crear post con caracteres especiales en título", () => {
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
});