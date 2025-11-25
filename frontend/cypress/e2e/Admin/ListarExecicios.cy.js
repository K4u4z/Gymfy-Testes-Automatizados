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
    cy.visit("http://localhost:4200/exercicios", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("jwt_token", token);
        win.sessionStorage.setItem("usuarioPerfil", perfil);
        win.sessionStorage.setItem("usuarioId", usuarioId);
        win.sessionStorage.setItem("usuarioNome", nomeUsuario);
      }
    });
  })

  it('Validar se exercicios estão sendo exibidos na página', ()=>{
    cy.contains('td','Costas2')
  })

  it('Validar se o exercicio é excluido da plataforma', ()=>{
    cy.get('table tbody tr').contains('td', 2) 
    .parent()
    .find('button.btn-excluir') 
    .click()
    cy.get('table tbody tr').contains('td', 2).should('not.exist');

  })

  it('Validar redirecionamento para página de edição do exercicio', ()=>{
    cy.get('table tbody tr').contains('td',4)
    .parent()
    .find('button.btn-editar')
    .click()
  })

  it('Validar a alteração do campo de exercicio', ()=>{

    cy.get('table tbody tr').contains('td',4)
    .parent()
    .find('button.btn-editar')
    .click()

    cy.get('#nome').type('Pulley frente2')
    cy.get('#tipo').select(3)
    cy.get('#nivel').select(2)
    cy.get('#agrupamento').type('Peito')
    cy.get('#descricao').type('Exercicios para peito alterado')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/costas.jpg')
    cy.get('#videoUrl').type('https://www.youtube.com/watch?v=y7CrALaIi6E')
    cy.contains('button','Salvar Dados').click()
    
  })

  

})