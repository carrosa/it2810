describe('page loads with unitdb', function(){
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
    
    it("Look at frontpage meme", function(){
        cy.visit("http://localhost:3000") 

  })
})

