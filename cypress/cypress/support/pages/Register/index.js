import { ELEMENTS } from "./elements";

const name = "Dogs queridos";
const email = "dogs@mail.com";
const whatsApp = "48999999999";
const city = "Içara";
const uf = "SC";

class Register {
  access() {
    cy.visit("http://localhost:3000/register");
  }

  register() {
    cy.get(ELEMENTS.name).type(name);
    cy.get(ELEMENTS.email).type(email);
    cy.get(ELEMENTS.whatsapp).type(whatsApp);
    cy.get(ELEMENTS.city).type(city);
    cy.get(ELEMENTS.uf).type(uf);

    cy.intercept("POST", "**/ongs").as("postOng");

    cy.get(ELEMENTS.submit).click();
  }

  validateRegister() {
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
  }
}

export default new Register();
