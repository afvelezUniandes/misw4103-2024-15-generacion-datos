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
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0012 - Crear post como draft con título corto y luego editarlo para validar límite de caracteres", () => {
    // Crear post inicial con título corto
    const shortTitle = faker.lorem.words(3);
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(shortTitle);
    cy.wait(1000);
    
    // Guardar como draft (al navegar a posts se guarda automáticamente)
    cy.visit("/ghost/#/posts");
    cy.contains("Draft").should("exist");
    
    // Volver a editar el post
    cy.contains(shortTitle).click();
    cy.wait(1000);
    
    // Intentar actualizar con un título muy largo
    const longTitle = faker.lorem.words(100); // Esto generará un título que excede 255 caracteres
    cy.get("textarea[data-test-editor-title-input]").clear().type(longTitle);
    cy.wait(2000);
    
    // Validar mensaje de error
    cy.get('.gh-alert-red').should('exist')
      .should('contain', 'Validation failed: Title cannot be longer than 255 characters.');
    
    // Verificar que no se puede publicar
    cy.get("span").contains("Publish").should("not.exist");
    
    // Verificar que sigue en estado draft
    cy.get("span").contains("Draft").should("exist");
  });

  it("E0013 - Crear post con caracteres especiales en título", () => {
    const specialTitle = `${faker.lorem.words(3)} !@#$%^&*() ${faker.lorem.word()}`;
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(specialTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0014 - Crear y editar post", () => {
    const originalTitle = faker.lorem.sentence();
    const editedTitle = faker.lorem.sentence();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(originalTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(originalTitle).click();
    cy.get("textarea[data-test-editor-title-input]").clear().type(editedTitle);
    cy.wait(2000);
    cy.get('button').contains("Update").click();
  });

  it("E0015 - Programar publicación de post", () => {
    const postTitle = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get("div.gh-radio").contains("Schedule").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
  });

  it("E0016 - Crear post como borrador", () => {
    const postTitle = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.wait(2000);
    cy.visit("/ghost/#/posts");
    cy.contains("Draft");
  });

  it("E0017 - Crear post con título corto", () => {
    const shortTitle = faker.lorem.word();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(shortTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0018 - Crear post con título numérico", () => {
    const numericTitle = faker.number.int({ min: 10000, max: 99999 }).toString();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(numericTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0019 - Crear y eliminar post", () => {
    const postTitle = faker.lorem.sentence();
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(postTitle).click();
    cy.get("button.settings-menu-toggle").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();
  });

  it("E0020 - Crear post con título en otro idioma", () => {
    const nonEnglishTitle = "título en español 你好 привет";
    
    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(nonEnglishTitle);
    cy.wait(2000);
    cy.get("span").contains("Publish").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });
});