/// <reference types="cypress" />

describe('Validando tela de cadastro de Usuario', () => {
  let token = '';
  let perfil = '';
  let usuarioId = '';
  let nomeUsuario = '';
  let alertCount = 0;

  // 🔑 Login direto no backend
  before(() => {
    cy.request("POST", "http://localhost:8080/auth/login", {
      email: "kauadiodato2@outlook.com",
      senha: "teste123"
    }).then((response) => {
      const body = response.body;

      // 🔍 Log completo da resposta
      console.log("📦 BODY:", body);
      debugger;

      token = body.token || '';
      perfil = body.perfil || 'Admin';
      usuarioId = body.usuarioId ? body.usuarioId.toString() : '0';
      nomeUsuario = body.nomeUsuario || 'Usuário Teste';

      if (!token) {
        throw new Error("❌ Token ausente na resposta de login.");
      }
    });
  });

  // 🔒 Visita o frontend e injeta sessionStorage
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




  // ✅ Cadastro de usuário comum
  it.only('Cadastrar usuário comum com sucesso', () => {
    cy.get('#nome').type('kaua');
    cy.get('select').select(2);
    cy.get('#dataNascimento').type('2002-02-17');
    cy.get('#cpf').type('901.216.630-60');
    cy.get('#email').type('kauadiodato.teste@outlook.com');
    cy.get('#senha').type('teste123');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg');
    cy.contains('button','Criar').click();


  });

 
  it('Cadastrar usuário personal com sucesso', () => {
    cy.get('#nome').type('kaua');
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
  });

  it('Validar exibição de mensagem de data incorreta', () => {
    cy.get('#dataNascimento').type('2222-02-17');
    cy.get('#senha').type('teste123');
    cy.get('.feedback').should('be.visible').and('contain','A data não pode ser no futuro.'
);
  });

  it('Validar exibição de mensagem de cpf inválido', () => {
    cy.get('#cpf').type('222222222222222');
    cy.get('#senha').type('teste123');
    cy.get('.feedback').should('be.visible').and('contain','CPF inválido');
  });

  it('Validar exibição de mensagem de email inválido', () => {
    cy.get('#email').type('kauadiodato');
    cy.get('#senha').type('teste123');
    cy.get('.feedback').should('be.visible').and('contain','Formato inválido');
  });





});