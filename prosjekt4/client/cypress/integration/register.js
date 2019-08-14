describe('test signup', function(){
    it("create new user", function(){
        cy.visit("/")
        cy.contains("Logout").click({ force: true }) // TODO: remove this
        //there is no method for hovering over elements in cypress, this is one of the 
        //sugested solutions. setting force: true in click allows 
        //you to click on hidden objects. 
        cy.contains("Signup").click({ force: true}) // TODO: remove force: true, if dropdown is removed
        //The data-cy atribute needs to be added to the element
        //in order to accsess it like this. 
        //this is considerd best practice https://docs.cypress.io/guides/references/best-practices.html 
        cy.get("[data-cy=signup_username]").type("testUsername")
        cy.get("[data-cy=signup_password]").type("testPassword")
        //TODO: når vi fikser unittestbiten 
        //fjern komentar
        cy.get("[data-cy=signup_submit]")//.clicl()
        
  })
})
