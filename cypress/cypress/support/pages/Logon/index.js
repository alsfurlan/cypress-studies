import { ELEMENTS } from "./elements";

class Logon {
  access() {
    cy.visit("http://localhost:3000");
  }

  doLogin() {
    cy.get(ELEMENTS.id).type(Cypress.env("createdOngId"));
    cy.intercept({ method: "POST", url: "**/sessions" }).as("sessions");
    cy.get(ELEMENTS.buttonLogin).click();
  }

  validateLogin() {
    cy.wait("@sessions").then(({ request, response }) => {
      expect(request.body.id).be.eq(Cypress.env("createdOngId"));
      expect(response.statusCode).be.eq(200);
      cy.location("pathname").should("eq", "/profile");
      cy.intercept({ method: "GET", url: "**/profile" }).as("profile");
    });
  }
}

export default new Logon();
