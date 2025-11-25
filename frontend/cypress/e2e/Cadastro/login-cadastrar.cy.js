/// <reference types="cypress" />

describe('Suite de teste para a página de cadastro', ()=> {

beforeEach(()=>{
    cy.visit('/login-cadastrar')
})


it('Cadastrar usuário comum com sucesso', () =>{
    cy.get('#nome').type('kaua')
    cy.get('select').select(2)
    cy.get('#dataNascimento').type('2002-02-17')
    cy.get('#cpf').type('901.216.630-60')
    cy.get('#email').type('kauadiodato.teste@outlook.com')
    cy.get('#senha').type('teste123')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg')
    cy.contains('button','Cadastrar').click()
    cy.on('window:alert', (msg) => {
    alertCount++

    if (alertCount === 1) {
      expect(msg).to.equal('Deseja realmente cadastrar este usuário?')
    }

    if (alertCount === 2) {
      expect(msg).to.equal('Cadastro realizado com sucesso')
    }
  })



})

it('Cadastrar usuário personal com sucesso', () =>{
    cy.get('#nome').type('kaua')
    cy.get('select').select(1)
    cy.get('#dataNascimento').type('2002-02-17')
    cy.get('#cpf').type('901.216.630-60')
    cy.get('#email').type('kauadiodato.teste@outlook.com')
    cy.get('#senha').type('teste123')
    cy.get('input[type="file"]').selectFile('cypress/fixtures/imagens/pacho.jpg')
    cy.contains('button','Cadastrar').click()
    cy.get('#especialidade').type('Musculação')
    cy.get('#descricao').type('Personal especializado em musculação')
    cy.get('#redeSocial').type('@Pacho')
    cy.contains('button','Cadastrar').click()



})

it('Validar exibição de mensagem de data incorreta', ()=>{
    cy.get('#dataNascimento').type('2222-02-17')
    cy.get('#senha').type('teste123')
    cy.get('.error-message').should('be.visible').and('contain','A data não pode ser no futuro')
})

it('Validar exibição de mensagem de cpf invalido', ()=>{
    cy.get('#cpf').type('222222222222222')
    cy.get('#senha').type('teste123')
    cy.get('.error-message').should('be.visible').and('contain','CPF inválido')
})

it('Validar exibição de mensagem de email invalido', ()=>{
    cy.get('#email').type('kauadiodato')
    cy.get('#senha').type('teste123')
    cy.get('.error-message').should('be.visible').and('contain','E-mail inválido')
})

})
