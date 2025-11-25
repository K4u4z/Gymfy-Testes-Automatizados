/// <reference types="cypress" />

describe('Suite de teste para a página de login', () => {
  beforeEach(() => {
    cy.visit('/login-usuario');
  });

  it('Realizar login com sucesso', () => {

    cy.intercept('POST', '**/auth/login').as('loginRequest');

   
    cy.get('#email').type('kauadiodato2@outlook.com');
    cy.get('#password').type('teste123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');


   cy.contains('Login Realizado!', { timeout: 10000 }).should('be.visible');
cy.contains('Acesso concedido. Você será redirecionado.').should('be.visible');

   

  });


  it('Realizar login com falha', () => {

    cy.intercept('POST', '**/auth/login').as('loginRequest');

   
    cy.get('#email').type('kauadiodato5@outlook.com');
    cy.get('#password').type('teste126');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');


   cy.contains('Falha no Login', { timeout: 10000 }).should('be.visible');
cy.contains('E-mail ou senha incorretos. Verifique suas credenciais.').should('be.visible');

   

  });
});