import { faker } from '@faker-js/faker';

describe("Login Ghost - 6 escenarios a-priori", () => {
  beforeEach(() => {
    cy.visit("/ghost/#/signin");
    Cypress.on("uncaught:exception", (err, runnable) => {
      console.error("Uncaught exception", err);
      return false;
    });
  });

  it("E0001 - Login con campos vacíos", () => {
    cy.get('input[name="identification"]').should("have.value", "");
    cy.get('input[name="password"]').should("have.value", "");
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("contain", "Please fill out the form to sign in.");
  });

  // Escenario 2: Email no válido (sin @)
  it("E0002 - Login con email inválido (sin @)", () => {
    const invalidEmail = faker.internet.userName();
    const password = faker.internet.password();

    cy.get('input[name="identification"]').type(invalidEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("be.visible");
  });


  it("E0003 - Login con email no registrado", () => {
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password();

    cy.get('input[name="identification"]').type(randomEmail);
    cy.get('input[name="password"]').type(randomPassword);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("contain", "There is no user with that email address.");
  });


  it("E0004 -  Login con contraseña incorrecta", () => {
    const wrongPassword = faker.internet.password();

    cy.get('input[name="identification"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(wrongPassword);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("contain", "Your password is incorrect.");
  });


  it("E0005 - Login con email con caracteres especiales", () => {
    const specialEmail = `${faker.string.alphanumeric(5)}!#$%@test.com`;
    const randomPassword = faker.internet.password();

    cy.get('input[name="identification"]').type(specialEmail);
    cy.get('input[name="password"]').type(randomPassword);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("be.visible");
  });


  it("E0006 - Login exitoso con credenciales correctas", () => {
    cy.get('input[name="identification"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('button[type="submit"]').click();
    

    cy.url().should('include', '/ghost/#/dashboard');
  });


  it("E0007 - Login con email extremadamente largo", () => {
    const longEmail = `${faker.string.alphanumeric(200)}@${faker.string.alphanumeric(50)}.com`;
    const password = faker.internet.password();

    cy.get('input[name="identification"]').type(longEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("be.visible");
  });

  it("E0008 - Login con email que contiene espacios", () => {
    const emailWithSpaces = `${faker.internet.userName()} ${faker.internet.userName()}@${faker.internet.domainName()}`;
    const password = faker.internet.password();

    cy.get('input[name="identification"]').type(emailWithSpaces);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("be.visible");
  });

  it("E0009 - Login con email con múltiples @", () => {
    const multipleAtEmail = `${faker.internet.userName()}@@${faker.internet.domainName()}`;
    const password = faker.internet.password();

    cy.get('input[name="identification"]').type(multipleAtEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("be.visible");
  });

  it("E0010 - Login con contraseña numérica", () => {
    const numericPassword = faker.string.numeric(10);
    
    cy.get('input[name="identification"]').type(Cypress.env('username'));
    cy.get('input[name="password"]').type(numericPassword);
    cy.get('button[type="submit"]').click();
    cy.get('p.main-error').should("be.visible");
  });

});