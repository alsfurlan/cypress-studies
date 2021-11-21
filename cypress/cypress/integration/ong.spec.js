/// <reference types="cypress" />

describe("Ongs", () => {
  it("should do a register", () => {
    const name = "Dogs queridos";
    const email = "dogs@mail.com";
    const whatsApp = "48999999999";
    const city = "Içara";
    const uf = "SC";

    cy.visit("http://localhost:3000/register");
    cy.get("[data-cy=name]").type(name);
    cy.get("[data-cy=email]").type(email);
    cy.get("[data-cy=whatsapp]").type(whatsApp);
    cy.get("[data-cy=city]").type(city);
    cy.get("[data-cy=uf]").type(uf);

    cy.intercept("POST", "**/ongs").as("postOng");

    cy.get("[data-cy=submit]").click();

    cy.wait("@postOng").then(({ request, response }) => {
      expect(request.body.name).be.eq(name);
      expect(request.body.email).be.eq(email);
      expect(request.body.whatsapp).be.eq(whatsApp);
      expect(request.body.city).be.eq(city);
      expect(request.body.uf).be.eq(uf);
      expect(response.statusCode).be.eq(200);
      expect(response.body).has.property("id");
      expect(response.body.id).is.not.null;
    });
  });

  it("should do a login", () => {
    const id = Cypress.env("createdOngId");

    cy.visit("http://localhost:3000");
    cy.intercept({ method: "POST", url: "**/sessions" }).as("sessions");
    cy.get("input").type(id);
    cy.get(".button").click();

    cy.intercept({ method: "GET", url: "**/profile" }).as("profile");

    cy.wait("@sessions").then(({ request, response }) => {
      expect(request.body.id).be.eq(id);
      expect(response.statusCode).be.eq(200);
      cy.location("pathname").should("eq", "/profile");
    });
  });

  it("should register a case", () => {
    const id = Cypress.env("createdOngId");

    cy.visit("http://localhost:3000");
    cy.intercept({ method: "POST", url: "**/sessions" }).as("sessions");
    cy.get("input").type(id);
    cy.get(".button").click();

    cy.intercept({ method: "GET", url: "**/profile" }).as("profile");

    cy.wait("@sessions").then(({ request, response }) => {
      expect(request.body.id).be.eq(id);
      expect(response.statusCode).be.eq(200);
      cy.location("pathname").should("eq", "/profile");
    });

    cy.get(".button").click();

    cy.location("pathname").should("eq", "/incidents/new");

    cy.generateRandomNumber();
    const randomNumber = Cypress.env("randomNumber");

    const caseRegister = {
      title: `Título ${randomNumber}`,
      description: `Descrição ${randomNumber}`,
      value: `${randomNumber}`,
    };

    cy.get('[placeholder="Título do caso"]').type(caseRegister.title);
    cy.get("textarea").type(caseRegister.description);
    cy.get('[placeholder="Valor em reais"]').type(caseRegister.value);

    cy.get(".button").click();

    cy.location("pathname").should("eq", "/profile");
    cy.get("ul > li > p:first").should("have.text", caseRegister.title);
    cy.get("ul > li > p:nth-of-type(2)").should("have.text", caseRegister.description);
    cy.get("ul > li > p:nth-of-type(3)").should("have.text", Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caseRegister.value));
  });
});
