import { faker } from '@faker-js/faker';

describe("Pages Ghost - 10 escenarios a-priori", () => {
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

  it("E0014 - Crear página con título y descripción aleatoria", () => {
    const paginaTitulo = faker.lorem.sentence();
    const paginaDescripcion = faker.lorem.paragraph();
    
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescripcion);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0015 - Crear página con título HTML y validar renderizado", () => {
    const htmlTitulo = `<h1>${faker.lorem.words(3)}</h1>`;
    const paginaDescription = faker.lorem.paragraph();
    
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(htmlTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescription);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0016 - Crear página y programar publicación", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.paragraph();
    
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescripcion);
    
    cy.get("span").contains("Publish").click();
    cy.contains("Right now").click();
    cy.contains("Schedule for later").click();
    
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.visit("/ghost/#/pages?type=scheduled");
    cy.contains(paginaTitulo).should("exist");
  });

  it("E0017 - Crear página con contenido extenso", () => {
    const paginaTitulo = faker.lorem.words(3);
    const paginaDescripcion = faker.lorem.paragraph(5);
    
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescripcion);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0018 - Validar mensajes de error cuando título excede 255 caracteres", () => {
    const paginaTitulo = faker.lorem.words(2);
    const paginaDescripcion = faker.lorem.paragraph();
    
    cy.visit("/ghost/#/editor/page");
    cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
    cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescripcion);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
    cy.get("button[data-test-button='close-publish-flow']").click();

    cy.contains(paginaTitulo).click();
    cy.wait(1000);

    const tituloLargo = faker.lorem.words(150); 
    cy.get("textarea[data-test-editor-title-input]").clear().type(tituloLargo);  
    cy.get("span").contains("Update").click(); 

    cy.get('body').then(($body) => {
        if ($body.find('.gh-alert-red').length > 0) {
          cy.get('.gh-alert-red')
            .should('exist')
            .should('contain', 'Update failed: Title cannot be longer than 255 characters.');
        } else {
          cy.contains("Ready, set, publish.").should("exist");
          cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
          cy.get('button[data-test-button="confirm-publish"]').click();
          cy.contains("Update failed: Title cannot be longer than 255 characters.").should("exist");
          cy.contains("Retry").should("exist");
          cy.contains("Back to settings").should("exist");
        }
      });
  });

    it("E0019 - Despublicar una página publicada", () => {
        const paginaTitulo = faker.lorem.words(3);
        const paginaDescripcion = faker.lorem.paragraph();
        
        cy.visit("/ghost/#/editor/page");
        cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
        cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescripcion);
        cy.wait(1000);
        
        cy.get("span").contains("Publish").click();
        cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
        cy.get('button[data-test-button="confirm-publish"]').click();
        cy.get("button[data-test-button='close-publish-flow']").click();
        cy.contains("Published");

        cy.contains(paginaTitulo).click();
        
        cy.get('button[data-test-button="update-flow"]').first().click();
        cy.get("button").contains("Unpublish and revert to private draft").click();
        
        cy.contains("Page reverted to a draft.");
    });

    it("E0020 - Crear página como borrador y verificar su estado", () => {
        const paginaTitulo = faker.lorem.words(3);
        const paginaDescripcion = faker.lorem.paragraph();
        
        cy.visit("/ghost/#/editor/page");
        cy.get("textarea[data-test-editor-title-input]").type(paginaTitulo);
        cy.get('div[data-secondary-instance="false"] [data-kg="editor"]').type(paginaDescripcion);
        cy.wait(2000);

        cy.visit("/ghost/#/pages?type=draft");
        cy.contains(paginaTitulo).should("exist");
    });

});