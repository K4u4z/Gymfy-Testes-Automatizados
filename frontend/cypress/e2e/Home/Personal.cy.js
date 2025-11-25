/// <reference types="cypress" />

describe('Validando tela de cadastro de Usuario', () => {
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
    cy.visit("http://localhost:4200/cadastrarusuario", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });
  });

  it('Cadastrar usuário personal com sucesso', () => {
    cy.get('#nome').type('kauan');
    cy.get('select').select(1);
    cy.get('#dataNascimento').type('2002-02-17');
    cy.get('#cpf').type('901.216.630-60');
    cy.get('#email').type('kauadiodato.teste@outlook.com');
    cy.get('#senha').type('teste123');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg');
    cy.get('#especialidade').type('Musculação');
    cy.get('#descricao').type('Personal especializado em musculação');
    cy.get('#redeSocial').type('@Pacho');
    cy.contains('button','Criar').click();
    cy.get('.logo').click();
    cy.contains('a', 'Personais').click();
    cy.contains('h3','kaua');
  });

  it('Ver detalhes de informação do personal', () => {
    // visita diretamente a tela de personais
    cy.visit("http://localhost:4200/tela-personal", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });


    cy.get('.personal-card').should('exist');

    cy.get('a[href="/personal-detalhes/3"]').click();

   
    cy.url().should('include', '/personal-detalhes/3');
    cy.contains('h2','Kauã')
  });
});