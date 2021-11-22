import { ELEMENTS } from "../Profile/elements";

class Profile {
  logout() {
    cy.get(ELEMENTS.buttonLogout)
      .click()
      .should(() => {
        expect(localStorage.getItem("ongId")).to.be.null;
        expect(localStorage.getItem("ongName")).to.be.null;
      });
    cy.location("pathname").should("eq", "/");
  }

  registerNewCase() {
    cy.get(ELEMENTS.buttonNewCase).click();
    cy.location("pathname").should("eq", "/incidents/new");
  }

  validateCaseRegister() {
    const caseRegister = Cypress.env("createdIncident");
    cy.get(ELEMENTS.caseTitle).should("have.text", caseRegister.title);
    cy.get(ELEMENTS.caseDescription).should(
      "have.text",
      caseRegister.description
    );
    cy.get(ELEMENTS.caseValue).should(
      "have.text",
      Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        caseRegister.value
      )
    );
  }

  deleteCase() {
    cy.intercept({ method: "DELETE", url: `**/incidents/*` }).as("caseRemoved");
    cy.get(ELEMENTS.buttonRemoveCase).click();
  }

  validateDeleteCase() {
    cy.wait("@caseRemoved").then(({ request, response }) => {
      expect(request.url).contains(Cypress.env("createdCaseId"));
      expect(response.statusCode).be.eq(204);
      expect(response.body).be.empty;
    });
  }
}

export default new Profile();
