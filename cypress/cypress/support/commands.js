// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("createOng", () => {
  const randomNumber = (Math.random() * 10000).toFixed(0);
  cy.request({
    method: "POST",
    url: "http://localhost:3333/ongs",
    body: {
      name: `Ong ${randomNumber}`,
      email: `ong${randomNumber}@mail.com`,
      whatsapp: `48999999{$randonNumber}`,
      city: "Içara",
      uf: "SC",
    },
  }).then((res) => {
    const { status, body } = res;
    const { id } = body;
    expect(status).be.eq(200);
    expect(body).has.property("id");
    expect(id).is.not.null;
    Cypress.env("createdOngId", id);
  });
});

Cypress.Commands.add('generateRandomNumber', () => {
    const randomNumber = (Math.random() * 10000).toFixed(0);
    Cypress.env('randomNumber', randomNumber);
    return randomNumber;
});
