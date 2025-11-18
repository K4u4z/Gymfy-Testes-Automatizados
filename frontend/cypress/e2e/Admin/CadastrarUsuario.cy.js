/// <reference types="cypress" />

describe('Fluxo completo de autenticação e cadastro', () => {

  let token;       // ✅ variável para guardar token
  let alertCount = 0; // ✅ contador para alerts

  // 🔑 Login antes de todos os testes
  before(() => {
    cy.request("POST", "/auth/login", {
      email: "kauadiodato2@outlook.com",
      senha: "teste123"
    }).then((response) => {
      token = response.body.token; // ✅ pega o campo correto
      window.localStorage.setItem("token", token);
    });
  });

  // 🔒 Antes de cada teste, injeta token no localStorage
  beforeEach(() => {
    cy.visit('/cadastrarusuario', {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", token);
      }
    });
  });

  // ✅ Teste de título
  it('Verificar se o título está correto', () => {
    cy.title().should('eq', 'Página de Cadastro');
  });

  // ✅ Cadastro de usuário comum
  it('Cadastrar usuário comum com sucesso', () => {
    cy.get('#nome').type('kaua');
    cy.get('select').select(2);
    cy.get('#dataNascimento').type('2002-02-17');
    cy.get('#cpf').type('901.216.630-60');
    cy.get('#email').type('kauadiodato.teste@outlook.com');
    cy.get('#senha').type('teste123');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg');
    cy.contains('button','Cadastrar').click();

    cy.on('window:alert', (msg) => {
      alertCount++;
      if (alertCount === 1) {
        expect(msg).to.equal('Deseja realmente cadastrar este usuário?');
      }
      if (alertCount === 2) {
        expect(msg).to.equal('Cadastro realizado com sucesso');
      }
    });
  });

  // ✅ Cadastro de usuário personal
  it('Cadastrar usuário personal com sucesso', () => {
    cy.get('#nome').type('kaua');
    cy.get('select').select(1);
    cy.get('#dataNascimento').type('2002-02-17');
    cy.get('#cpf').type('901.216.630-60');
    cy.get('#email').type('kauadiodato.teste@outlook.com');
    cy.get('#senha').type('teste123');
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg');
    cy.contains('button','Cadastrar').click();
    cy.get('#especialidade').type('Musculação');
    cy.get('#descricao').type('Personal especializado em musculação');
    cy.get('#redeSocial').type('@Pacho');
    cy.contains('button','Cadastrar').click();
  });

  // ✅ Validações de erro
  it('Validar exibição de mensagem de data incorreta', () => {
    cy.get('#dataNascimento').type('2222-02-17');
    cy.get('#senha').type('teste123');
    cy.get('.error-message').should('be.visible').and('contain','A data não pode ser no futuro');
  });

  it('Validar exibição de mensagem de cpf inválido', () => {
    cy.get('#cpf').type('222222222222222');
    cy.get('#senha').type('teste123');
    cy.get('.error-message').should('be.visible').and('contain','CPF inválido');
  });

  it('Validar exibição de mensagem de email inválido', () => {
    cy.get('#email').type('kauadiodato');
    cy.get('#senha').type('teste123');
    cy.get('.error-message').should('be.visible').and('contain','E-mail inválido');
  });

  // ✅ Teste de rota protegida Admin
  it('Acessar rota protegida /admin/dashboard', () => {
    cy.request({
      method: "GET",
      url: "/admin/dashboard",
      headers: {
        Authorization: `Bearer ${token}` // ✅ usa token no header
      }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('perfil', 'Admin');
    });
  });

});
