describe("Pruebas de miembros", () => {
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

  xit("E021 - Crear miembro", () => {
    const memberData = mockarooData[21];

    // Given Abro Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // Then Debo ver mensaje "Saved"
    cy.contains(memberData.nombre);
  });

  xit("E022 - Crear nuevo miembro solo con email", () => {
    const memberData = mockarooData[22];

    // Given Abro Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // Then Debo ver mensaje "Saved"
    cy.contains(memberData.email);
  });

  xit("E023 - Crear nuevo miembro solo con nombre", () => {
    const memberData = mockarooData[23];

    // Given Abro Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    cy.contains("Please enter an email");
  });

  xit("E024 - Crear nuevo miembro con email erroneo", () => {
    const memberData = mockarooData[24];

    // Given Abro Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.titulo);
    cy.wait(2000);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    cy.contains("Invalid Email");
  });

  xit("E025 - Editar miembro", () => {
    const memberData = mockarooData[25];

    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.wait(2000);

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el miembro creado
    cy.contains(memberData.nombre).click();

    // And Ingreso el nuevo nombre
    cy.get('input[name="name"]').clear().type(memberData.nombreEditado);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    // Then Debo ver mensaje "Saved"
    cy.contains("Saved");
  });

  xit("E026 - Editar miembro con email erroneo", () => {
    const memberData = mockarooData[26];

    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.wait(2000);

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el miembro creado
    cy.contains(memberData.nombre).click();

    // And Ingreso el nuevo nombre
    cy.get('input[name="email"]').clear().type(memberData.titulo);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    cy.contains("Invalid Email");
  });

  xit("E027 - Eliminar miembro", () => {
    const memberData = mockarooData[27];

    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.wait(2000);

    // Given Abro Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el miembro editado
    cy.contains(memberData.nombre).click();

    // And Hago click en el botón de acciones
    cy.get('button[data-test-button="member-actions"]').click();

    // And Hago click en el botón de eliminar
    cy.get('button[data-test-button="delete-member"]').click();

    // And Hago click en el botón de confirmar
    cy.get('button[data-test-button="confirm"]').click();

    // Then Debo ver mensaje "Miembro eliminado"
    cy.contains(memberData.nombreEditado).should("not.exist");
  });

  xit("E028 - Crear miembro con newsletter desactivado", () => {
    const memberData = mockarooData[28];

    // Given Abro Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Desactivo el newsletter
    cy.get("span.input-toggle-component").click();

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // Then Debo ver mensaje "Saved"
    cy.contains(memberData.nombre);
  });

  xit("E029 - Crear link de acceso como miembro", () => {
    const memberData = mockarooData[29];

    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.wait(2000);

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el miembro creado
    cy.contains(memberData.nombre).click();

    // And Hago click en el botón de acciones
    cy.get('button[data-test-button="member-actions"]').click();

    // And Hago click en el botón de "impersonate
    cy.get('button[data-test-button="impersonate"]').click();

    // Then Debo ver mensaje "Link copied"
    cy.contains("Impersonate");
  });

  it("E030 - Debe desloguearse de todos los lugares", () => {
    const memberData = mockarooData[30];

    cy.visit("/ghost/#/members");

    // When Hago click en el botón de nuevo miembro
    cy.get('a[data-test-new-member-button="true"]').click();

    // And Lleno los campos
    cy.get('input[name="name"]').type(memberData.nombre);
    cy.get('input[name="email"]').type(memberData.email);

    // And Hago click en el botón de guardar
    cy.get("button.gh-btn-primary").click();
    cy.wait(2000);

    // And Navego a Miembros
    cy.visit("/ghost/#/members");

    // When Hago click en el miembro creado
    cy.contains(memberData.nombre).click();

    // And Hago click en el botón de acciones
    cy.get('button[data-test-button="member-actions"]').click();

    // And Hago click en el botón de "desloguearse"
    cy.get('button[data-test-button="logout-member"]').click();

    cy.get('span[data-test-task-button-state="idle"]')
      .contains("Sign out")
      .click();

    // Then Debo ver mensaje "sign out
    cy.get('span[data-test-task-button-state="success"]').should(
      "contain",
      "Signed out"
    );
  });
});
