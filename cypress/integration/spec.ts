
describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Welcome')
    cy.contains('sandbox app is running!')
  });

  it('Prueba a visitar la página de contacto', () => {
    cy.visit('/contacus')
    cy.contains('HOLA')
    cy.contains('sandbox app is running!')
  });
})
