describe('test signup', function(){
    beforeEach(function() {
  
        cy.request({
            method: "POST",
            url: "http://localhost:8080/db/token/memes",
            failOnStatusCode: false
        })
        cy.request({
            method: "POST",
            url: "http://localhost:8080/db/drop/memes",
            failOnStatusCode: false
        })
        cy.request({
            method: "POST",
            url: "http://localhost:8080/db/test/memes",
            failOnStatusCode: false
        })
    
    })
    
    it("create new user, and login", function(){
        cy.visit("http://localhost:3000")
        //there is no method for hovering over elements in cypress, this is one of the 
        //sugested solutions. setting force: true in click allows 
        //you to click on hidden objects. 
        cy.contains("Signup").click({ force: true})
        //The data-cy atribute needs to be added to the element
        //in order to accsess it like this. 
        //this is considerd best practice https://docs.cypress.io/guides/references/best-practices.html 
        cy.get("[data-cy=signup_username]").type("testUsername")
        cy.get("[data-cy=signup_password]").type("testPassword")
        //TODO: når vi fikser unittestbiten 
        //fjern komentar
        cy.get("[data-cy=signup_submit]").click()
        cy.get("[data-cy=login]").click()
        cy.get("[data-cy=login_username]").type("testUsername")
        cy.get("[data-cy=login_password]").type("testPassword")
        cy.get("[data-cy=login_submit]").click()
       
        cy.contains("[data-cy=active_username]").should("have.value","testUsername")

        it("login with testuser", function (){
            cy.visit("http://localhost:3000")
            cy.contains("Signup").click({ force: true})
            // a user with the username test and pw test is already in the db
            cy.get("[data-cy=login_username]").type("test")
            cy.get("[data-cy=login_password]").type("test")
            
            cy.get("[data-cy=login_submit]").click()
       
            cy.contains("[data-cy=active_username]").should("have.value","test")
        })
    
  })
})
