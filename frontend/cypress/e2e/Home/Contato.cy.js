/// <reference types="cypress" />

describe('Validando formulário de contato', () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200/contato");
  });

  it('Preencher todos os campos obrigatórios e enviar com sucesso', () => {
    cy.get('#nome').first().type('Kauã');
    cy.get('#nome').last().type('Diodato');
    cy.get('#email').type('kauan@teste.com');
    cy.get('#confirmar-email').type('kauan@teste.com');
    cy.get('#telefone').type('999999999');
    cy.get('#assunto').type('Dúvida sobre planos');
    cy.get('input[name="mensagem"]').type('Gostaria de saber mais sobre os planos disponíveis.');
    cy.contains('button','Enviar').click();

    // valida que o formulário foi enviado (exemplo: mensagem de sucesso)
    cy.get('.container-form').should('contain.text','Formulário');
  });

  it('Validar erro ao enviar sem preencher campos obrigatórios', () => {
    cy.contains('button','Enviar').click();
    cy.get('#nome').first().then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
    cy.get('#email').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
    cy.get('#assunto').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
    cy.get('input[name="mensagem"]').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
  });

  it('Validar erro quando e-mails não coincidem', () => {
    cy.get('#nome').first().type('Kauã');
    cy.get('#nome').last().type('Diodato');
    cy.get('#email').type('kauan@teste.com');
    cy.get('#confirmar-email').type('diferente@teste.com');
    cy.get('#assunto').type('Teste de email');
    cy.get('input[name="mensagem"]').type('Mensagem teste');
    cy.contains('button','Enviar').click();

    // valida que o campo confirmar-email tem erro
    cy.get('#confirmar-email').then(($input) => {
      expect($input[0].validationMessage).to.not.be.empty;
    });
  });

  it('Validar campo telefone aceita apenas números', () => {
    cy.get('#telefone').type('abcde');
    cy.get('#telefone').should('have.value',''); // navegador bloqueia caracteres inválidos
  });

  it('Validar limite de caracteres nos campos', () => {
    cy.get('#nome').first().type('a'.repeat(35));
    cy.get('#nome').first().invoke('val').should('have.length.at.most',30);

    cy.get('#email').type('a'.repeat(60) + '@teste.com');
    cy.get('#email').invoke('val').should('have.length.at.most',50);

    cy.get('#assunto').type('a'.repeat(120));
    cy.get('#assunto').invoke('val').should('have.length.at.most',100);
  });
});