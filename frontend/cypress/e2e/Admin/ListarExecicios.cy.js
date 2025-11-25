/// <reference types="cypress" />

describe('Validando tela de cadastro de Usuario', () => {
  let token = '';
  let perfil = '';
  let usuarioId = '';
  let nomeUsuario = '';
  const nomeExercicio = 'Pulley frente2';

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
    cy.visit("http://localhost:4200/cadastrarexercicios", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });

    cy.intercept('POST', '/exercicios').as('novoExercicio');
    cy.get('#nome').clear().type(nomeExercicio);
    cy.get('#tipo').select(3, { force: true });
    cy.get('#nivel').select(2, { force: true });
    cy.get('#agrupamento').clear().type('Peito');
    cy.get('#descricao').clear().type('Exercicios para peito');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/costas.jpg');
    cy.get('#videoUrl').clear().type('https://www.youtube.com/watch?v=y7CrALaIi6E');
    cy.contains('button','Cadastrar').click();
    cy.wait('@novoExercicio');

    cy.visit("http://localhost:4200/exercicios", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });
  });

  it('Validar se exercicios estão sendo exibidos na página', () => {
    cy.contains('td', nomeExercicio, { timeout: 10000 }).should('be.visible');
  });

  it('Validar se o exercicio é excluido da plataforma', () => {
    cy.intercept('DELETE', '/exercicios/*').as('excluirExercicio');

    cy.get('table tbody tr').contains('td', nomeExercicio)
      .parent()
      .find('button.btn-excluir')
      .click();

    cy.wait('@excluirExercicio');
    cy.reload();

    cy.contains('td', nomeExercicio).should('not.exist');
  });

  it('Validar redirecionamento para página de edição do exercicio', () => {
    cy.get('table tbody tr').contains('td', nomeExercicio)
      .parent()
      .find('button.btn-editar')
      .click();

    cy.url().should('include', '/editar-exercicio/');
  });

  it('Validar a alteração do campo de exercicio', () => {
    cy.intercept('PUT', '/exercicios/*').as('editarExercicio');

    cy.get('table tbody tr').contains('td', nomeExercicio)
      .parent()
      .find('button.btn-editar')
      .click();

    cy.get('#nome').clear().type('Pulley frente atualizado');
    cy.get('#tipo').select(3, { force: true });
    cy.get('#nivel').select(2, { force: true });
    cy.get('#agrupamento').select(1);
    cy.get('#descricao').clear().type('Exercicios para peito alterado');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/costas.jpg');
    cy.get('#videoUrl').clear().type('https://www.youtube.com/watch?v=y7CrALaIi6E');
    cy.contains('button','Salvar Dados').click();

    cy.wait('@editarExercicio');
    cy.reload();

    cy.contains('td','Pulley frente atualizado', { timeout: 10000 }).should('be.visible');
  });
});
