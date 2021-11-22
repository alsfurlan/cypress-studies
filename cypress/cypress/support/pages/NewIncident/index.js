import { ELEMENTS } from './elements';


const randomNumber = Cypress.env("randomNumber");
const caseRegister = {
  title: `Título ${randomNumber}`,
  description: `Descrição ${randomNumber}`,
  value: `${randomNumber}`,
};

class NewIncident {
  register() {
    cy.get(ELEMENTS.title).type(caseRegister.title);
    cy.get(ELEMENTS.description).type(caseRegister.description);
    cy.get(ELEMENTS.value).type(caseRegister.value);

    cy.intercept({ method: "POST", url: "**/incidents" }).as("newCase");

    cy.get(ELEMENTS.save).click();
  }

  validateRegister() {
    cy.wait("@newCase").then(({ request, response }) => {
      expect(request.body.title).be.eq(caseRegister.title);
      expect(request.body.description).be.eq(caseRegister.description);
      expect(request.body.value).be.eq(caseRegister.value);
      expect(response.statusCode).to.eq(200);
      expect(response.body.id).is.not.null;
    });
    cy.location("pathname").should("eq", "/profile");
    Cypress.env('createdIncident', caseRegister);
  }
}

export default new NewIncident();
