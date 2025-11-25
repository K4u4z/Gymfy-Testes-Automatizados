/// <reference types="cypress" />

describe('Validando tela de exercícios', () => {
  let token = '';
  let perfil = '';
  let usuarioId = '';
  let nomeUsuario = '';

  before(() => {
    cy.request("POST", "http://localhost:8080/auth/login", {
      email: "kauadiodato2@outlook.com",
      senha: "teste123"
    }).then((response) => {
      const body = response.body;

      token = body.token || '';
      perfil = body.perfil || 'Admin';
      usuarioId = body.usuarioId ? body.usuarioId.toString() : '0';
      nomeUsuario = body.nomeUsuario || 'Usuário Teste';

      if (!token) {
        throw new Error("❌ Token ausente na resposta de login.");
      }
    });
  });

  beforeEach(() => {
    cy.visit("http://localhost:4200/tela-exercicio", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });
  });

  it('Validar filtro de exercícios por categoria', () => {
    cy.contains('button', 'Peito').click();
    cy.contains('button', 'Bíceps').click();
  });

  it('Visitar detalhes de um exercício criado', () => {
    cy.contains('.exercise-card h3', 'Pulley frente2').should('exist');
    cy.contains('.exercise-card h3', 'Pulley frente2')
      .parents('.exercise-card')
      .find('.inspect-btn')
      .click();
    cy.url().should('include', '/detalhes');
    cy.contains('h2', 'Pulley frente2').should('be.visible');
  });

 it('Dar play no vídeo do exercício', () => {
  cy.contains('.exercise-card h3', 'Pulley frente2')
    .parents('.exercise-card')
    .find('.inspect-btn')
    .click();

  cy.url().should('include', '/detalhes');

  cy.get('iframe[title*="Pulley frente2"]').should('exist').and('be.visible');
});
});