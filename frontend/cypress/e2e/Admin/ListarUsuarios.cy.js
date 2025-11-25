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
    cy.visit("http://localhost:4200/admin", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });
  })

  it('Validar se usuarios estão sendo exibidos na página', ()=>{
    cy.contains('td','kauã diodato2')
  })

  it('Validar se o usuario é excluido da plataforma', ()=>{
    cy.get('table tbody tr').contains('td', 1) 
    .parent()
    .find('button.btn-excluir') 
    .click()
    cy.get('table tbody tr').contains('td', 1).should('not.exist');

  })

  it('Validar redirecionamento para página de edição do usuario', ()=>{
    cy.get('table tbody tr').contains('td',1)
    .parent()
    .find('button.btn-editar')
    .click()
  })

  it('Validar a alteração do campo de usuario', ()=>{

    cy.get('table tbody tr').contains('td',4)
    .parent()
    .find('button.btn-editar')
    .click()

    cy.get('#nome').clear().type('kaua diodato 4')
    cy.get('#tipo').select(1)
    cy.get('#email').clear().type('kauadiodato3@outlook.com')
    cy.get('#senha').clear().type('teste12345')
        cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg')
    cy.contains('button','Salvar alterações').click()
    
  })

  

})