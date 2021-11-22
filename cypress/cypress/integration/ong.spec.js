/// <reference types='cypress' />

import Logon from "../support/pages/Logon";
import Register from "../support/pages/Register";
import Profile from "../support/pages/Profile";
import NewIncident from "../support/pages/NewIncident";

describe("Ongs", () => {
  it("should do a register", () => {
    Register.access();
    Register.register();
    Register.validateRegister();
  });

  it("should do a login", () => {
    Logon.access();
    Logon.doLogin();
    Logon.validateLogin();
  });

  it("should register a case", () => {
    cy.login();
    cy.generateRandomNumber();
    Profile.registerNewCase();
    NewIncident.register();
    NewIncident.validateRegister();
    Profile.validateCaseRegister();
  });

  it("should do a logout", () => {
    cy.login();
    Profile.logout();   
  });

  it("should delete a case", () => {
    cy.registerNewCase();
    cy.login();
    Profile.deleteCase();
    Profile.validateDeleteCase();
  });
});
