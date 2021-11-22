/// <reference types='cypress' />

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
    cy.get("[data-cy=id]").type(id);
    cy.get("[data-cy=button-login]").click();

    cy.intercept({ method: "GET", url: "**/profile" }).as("profile");

    cy.wait("@sessions").then(({ request, response }) => {
      expect(request.body.id).be.eq(id);
      expect(response.statusCode).be.eq(200);
      cy.location("pathname").should("eq", "/profile");
    });
  });

  it("should register a case", () => {
    cy.login();

    cy.get("[data-cy=button-new-case]").click();

    cy.location("pathname").should("eq", "/incidents/new");

    cy.generateRandomNumber();
    const randomNumber = Cypress.env("randomNumber");

    const caseRegister = {
      title: `Título ${randomNumber}`,
      description: `Descrição ${randomNumber}`,
      value: `${randomNumber}`,
    };

    cy.get("[data-cy=title]").type(caseRegister.title);
    cy.get("[data-cy=description]").type(caseRegister.description);
    cy.get("[data-cy=value]").type(caseRegister.value);

    cy.intercept({ method: "POST", url: "**/incidents" }).as("newCase");

    cy.get("[data-cy=button-save]").click();

    cy.wait("@newCase").then(({ request, response }) => {
      expect(request.body.title).be.eq(caseRegister.title);
      expect(request.body.description).be.eq(caseRegister.description);
      expect(request.body.value).be.eq(caseRegister.value);
      expect(response.statusCode).to.eq(200);
      expect(response.body.id).is.not.null;
    });


    cy.location("pathname").should("eq", "/profile");
    cy.get("[data-cy=case-title]").should("have.text", caseRegister.title);
    cy.get("[data-cy=case-description]").should(
      "have.text",
      caseRegister.description
    );
    cy.get("[data-cy=case-value]").should(
      "have.text",
      Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        caseRegister.value
      )
    );
  });

  it("should do a logout", () => {
    cy.login();
    cy.get("[data-cy=button-delete]")
      .click()
      .should(() => {
        expect(localStorage.getItem("ongId")).to.be.null;
        expect(localStorage.getItem("ongName")).to.be.null;
      });
    cy.location("pathname").should("eq", "/");
  });

  it("should delete a case", () => {
    cy.registerNewCase();
    cy.login();

    cy.intercept({ method: "DELETE", url: `**/incidents/*` }).as("caseRemoved");

    cy.get("[data-cy=button-remove]").click();

    cy.wait("@caseRemoved").then(({ request, response }) => {
      expect(request.url).contains(Cypress.env("createdCaseId"));
      expect(response.statusCode).be.eq(204);
      expect(response.body).be.empty;
    });
  });
});
