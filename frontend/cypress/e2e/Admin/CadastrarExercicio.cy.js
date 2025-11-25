/// <reference types="cypress" />

describe('Validando tela de cadastro de Usuario', () => {
    let token = '';
    let perfil = '';
    let usuarioId = '';
    let nomeUsuario = '';
    let alertCount = 0;
  

    before(() => {
      cy.request("POST", "http://localhost:8080/auth/login", {
        email: "kauadiodato2@outlook.com",
        senha: "teste123"
      }).then((response) => {
        const body = response.body;
  

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

    })


  beforeEach(() => {
    cy.visit("http://localhost:4200/cadastrarexercicios", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });
  })

  it('Cadastrando um exercicio com sucesso', ()=>{
   cy.get('#nome').type('Pulley frente')
   cy.get('#tipo').select(3)
   cy.get('#nivel').select(2)
   cy.get('#agrupamento').type('Peito')
   cy.get('#descricao').type('Exercicios para nota')
   cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/costas.jpg')
   cy.get('#videoUrl').type('https://www.youtube.com/watch?v=y7CrALaIi6E')
   cy.contains('button','Cadastrar').click()
   cy.contains('a','EXERCÍCIOS').click()
   cy.contains('td','Supino declinado')


  })

  it('Cadastrando exercicio com informações faltando', ()=>{
    cy.get('#nome').type('Pulley frente')
    cy.get('#tipo').select(3)
    cy.get('#nivel').select(2)
    cy.get('#agrupamento').type('Peito')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/costas.jpg')
    cy.get('#videoUrl').type('https://www.youtube.com/watch?v=y7CrALaIi6E')
    cy.contains('button','Cadastrar').click()
    cy.get('.feedback').should('be.visible').and('contain','Campo obrigatório (máx. 500 caracteres).')
  })


})