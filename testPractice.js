describe('Smoke Test', function (){
    before(() => {
        cy.visit('http://qainterview.pythonanywhere.com/')
    })

    it('Title', function () {
        cy.get('h1').should('have.text', 'The greatest factorial calculator!').and('be.visible')
    })

    it ('Arrow', function(){
        cy.get('.icon-arrow-right').should('be.visible')
    })

    it ('Search bar', function(){
        cy.get('input').should('be.visible')
    })

    it ('Calculate Button', function(){
        cy.get('button').should('be.visible')
    })

    it ('Terms and Conditions, Privacy', function(){
        cy.get('a[href="/privacy"]').should('have.text', 'Terms and Conditions').and('be.visible')
        cy.get('a[href="/terms"]').should('have.text', 'Privacy').and('be.visible')
    })

    it ('Qxf2 Services', function () {
        cy.get('a[href="https://www.qxf2.com/?utm_source=qa-interview&utm_medium=click&utm_campaign=From%20QA%20Interview"]')
        .should('have.text', 'Qxf2 Services').and('be.visible') 
    })
})

describe('Functional Test', function(){
    beforeEach(function () {
        cy.visit('http://qainterview.pythonanywhere.com/')
        cy.get('input').clear()
    })

    context('FAST', function(){
        it ('Normal Positive Integer (1-21)', function (){
            checkAnswer(1, 21)
        })

        it ('Normal Positive Integer (21-170)', function (){
            checkAnswer(21, 170)
        })

        it ('Infinity result', function (){
            const input = randomNumber(171, 989)
            input.forEach(input => {
                typeAndClick(input)
                cy.get('[id="resultDiv"]').should('have.text', "The factorial of "+ input + " is: Infinity").and('be.visible')
                cy.get('input').clear()
            })
        })

        it ('Zero', function (){
            typeAndClick(0)
            cy.get('[id="resultDiv"]').should('have.text', 'The factorial of 0 is: 1').and('be.visible')
        })
    })

    context('TOFT', function(){
        it ('Click Terms and Conditions', function(){
            cy.get('a[href="/privacy"]').click()
            cy.url().should('eq', 'http://qainterview.pythonanywhere.com/privacy')
        })

        it ('Click Privacy', function(){
            cy.get('a[href="/terms"]').click()
            cy.url().should('eq', 'http://qainterview.pythonanywhere.com/terms')
        })
    
        it ('Click Qxf2 Services', function () {
            cy.get('a[href="https://www.qxf2.com/?utm_source=qa-interview&utm_medium=click&utm_campaign=From%20QA%20Interview"]')
            .click()
            cy.url().should('eq', 'https://qxf2.com/?utm_source=qa-interview&utm_medium=click&utm_campaign=From%20QA%20Interview')
        })
    })


    context('FET', function(){
        it ('Non-Integer input', function (){
            ForcedErrorTest('abcd')
        })

        it ('Decimal input', function (){
            ForcedErrorTest('1.2')
        })

        it ('Negative Integer', function (){
            ForcedErrorTest('-1')
        })

        it ('Input with brackets', function(){
            ForcedErrorTest('(1+2)')
        })

        it ('Input with space only', function(){
            ForcedErrorTest('    ')
        })

        it ('Big Integer (more than 990)' , function () {
            ForcedErrorTest('1000')
        })
    })
})

function typeAndClick(input){
    cy.get('input').type(input)
    cy.get('button').click()
}

function ForcedErrorTest(input){
    cy.get('input').type(input)
    cy.get('button').click()
    cy.get('[id="resultDiv"]').should('have.text', 'Please enter an integer')
    .and('have.attr', 'style', 'color: rgb(255, 0, 0);')
    .and('be.visible')
}

function randomNumber(min, max) {
    const numbers = []  
    for (let i = 0; i < 3; i++){
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min) 
    }
    return numbers
} 

function checkAnswer(min, max){
    const input = randomNumber(min, max)
        input.forEach(input => {
            typeAndClick(input)
            cy.get('[id="resultDiv"]').should('have.text', "The factorial of "+ input + " is: " + factorial(input)).and('be.visible')
            cy.get('input').clear() 
       })
}

function factorial(input){
    if (input == 0 || input == 1) {
        return 1
    } else {
        return input * factorial(input-1)
    }
}
