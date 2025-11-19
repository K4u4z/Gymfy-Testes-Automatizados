/// <reference types="cypress" />

describe('Suite de teste para a página de login', () => {
  beforeEach(() => {
    cy.visit('/login-usuario');
  });

  it('Exibe alerta de sucesso após login', () => {
    // Intercepta a requisição de login
    cy.intercept('POST', '**/auth/login').as('loginRequest');

    // Preenche os campos
    cy.get('#email').type('kauadiodato2@outlook.com');
    cy.get('#password').type('teste123');
    cy.get('button[type="submit"]').click();

    // Aguarda resposta do backend
    cy.wait('@loginRequest');

    // Aguarda o alerta aparecer
   cy.contains('Login Realizado!', { timeout: 10000 }).should('be.visible');
cy.contains('Acesso concedido. Você será redirecionado.').should('be.visible');

   

  });
});