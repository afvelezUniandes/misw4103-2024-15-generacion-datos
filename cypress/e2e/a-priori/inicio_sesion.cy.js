import { faker } from '@faker-js/faker';

describe("Posts Ghost - 10 escenarios a-priori", () => {
  beforeEach(() => {
    cy.visit("/ghost/#/signin");
    Cypress.on("uncaught:exception", (err) => {
      console.error("Uncaught exception", err);
      return false;
    });

    cy.get('input[name="identification"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/ghost/#/dashboard');
  });

  it("E0011 - Crear nuevo post con contenido aleatorio", () => {
    const postTitle = faker.lorem.sentence();
    const postContent = faker.lorem.paragraphs(3);

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0012 - Crear post con título extremadamente largo", () => {
    const longTitle = faker.lorem.words(50);
    const postContent = faker.lorem.paragraph();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(longTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0013 - Crear post con caracteres especiales en título", () => {
    const specialTitle = `${faker.lorem.words(3)} !@#$%^&*() ${faker.lorem.word()}`;
    const postContent = faker.lorem.paragraph();

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(specialTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    cy.contains("Published");
  });

  it("E0014 - Crear y editar post con contenido aleatorio", () => {
    const originalTitle = faker.lorem.sentence();
    const editedTitle = faker.lorem.sentence();
    const postContent = faker.lorem.paragraphs(2);

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(originalTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(originalTitle).click();
    cy.get("textarea[data-test-editor-title-input]").clear().type(editedTitle);
    cy.get('button[data-test-button="publish-save"]').click();
  });

  it("E0015 - Programar post para publicación futura", () => {
    const postTitle = faker.lorem.sentence();
    const postContent = faker.lorem.paragraphs(2);

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get('button[data-test-setting-title=""]').contains("Right now").click();
    cy.get("div.gh-radio").contains("Schedule").click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
  });

  it("E0016 - Crear post como borrador con URLs en contenido", () => {
    const postTitle = faker.lorem.sentence();
    const postContent = `${faker.lorem.paragraph()}\n${faker.internet.url()}\n${faker.lorem.paragraph()}`;

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.visit("/ghost/#/posts");
    cy.contains("Draft");
  });

  it("E0017 - Crear post con contenido multilínea", () => {
    const postTitle = faker.lorem.sentence();
    const multiLineContent = Array.from({ length: 5 }, () => faker.lorem.paragraph()).join('\n\n');

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get("div[data-kg='editor']").type(multiLineContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
  });

  it("E0018 - Crear post con título numérico", () => {
    const numericTitle = faker.number.int({ min: 10000, max: 99999 }).toString();
    const postContent = faker.lorem.paragraphs(2);

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(numericTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
  });

  it("E0019 - Crear y eliminar post inmediatamente", () => {
    const postTitle = faker.lorem.sentence();
    const postContent = faker.lorem.paragraphs(2);

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
    
    cy.visit("/ghost/#/posts");
    cy.contains(postTitle).click();
    cy.get("button[data-test-psm-trigger]").click();
    cy.get('button[data-test-button="delete-post"]').click();
    cy.get('button[data-test-button="delete-post-confirm"]').click();
  });

  it("E0020 - Crear post con título en otro idioma", () => {
    const postTitle = "título en español 你好 привет";
    const postContent = faker.lorem.paragraphs(2);

    cy.visit("/ghost/#/editor/post");
    cy.get("textarea[data-test-editor-title-input]").type(postTitle);
    cy.get("div[data-kg='editor']").type(postContent);
    cy.get('button[data-test-button="publish-flow"]').click();
    cy.get("button.gh-btn.gh-btn-black.gh-btn-large").click();
    cy.get('button[data-test-button="confirm-publish"]').click();
  });
});