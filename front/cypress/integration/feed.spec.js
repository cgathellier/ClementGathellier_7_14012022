const email = 'john.doe@gmail.com';
const password = 'mdpTest01';
let token;

before(function fetchUser() {
    cy.request('POST', 'http://localhost:3000/auth/login', {
        email,
        password,
    })
        .its('body')
        .then((res) => {
            token = res?.accessToken;
        });
});

beforeEach(function setUser() {
    cy.visit('/', {
        onBeforeLoad(win) {
            win.localStorage.setItem('gpmToken', token);
        },
    });
});

describe('Fetch posts, add, update, delete', () => {
    const text = 'Lorem ipsum';
    const updateText = 'Lorem ipsum dolor sit amet';

    it.only('creates a post', () => {
        cy.url().should('include', '/feed');

        cy.get('[data-testid=openPostForm]').click();
        cy.get('[data-testid=post-form-input]')
            .focused()
            .type(text)
            .should('have.value', text);

        cy.intercept('GET', 'http://localhost:3000/posts', (req) => {
            req.on('response', (res) => {
                res.send({
                    statusCode: 200,
                });
            });
        }).as('fetchPosts');

        cy.get('[data-testid=submit-post]').click();

        // alerte
        cy.contains('La publication a bien été enregistrée');

        cy.wait('@fetchPosts').then((intercept) => {
            const postsLength = intercept?.response?.body?.length;

            cy.get('[data-testid=post]:first')
                .should('include.text', text)
                .find('button[aria-label*="Menu modifier"]')
                .click()
                .get('li:first')
                .should('have.text', 'Modifier')
                .click()
                // formulaire modification
                .get('[data-testid=editTextInput]')
                .focused()
                .should('have.text', text)
                .get('[data-testid=submitEditedText]')
                .should('be.disabled')
                .get('[data-testid=editTextInput]')
                .clear()
                .get('[data-testid=submitEditedText]')
                .should('be.disabled')
                .get('[data-testid=editTextInput]')
                .type(updateText)
                .get('[data-testid=submitEditedText]')
                .click();

            cy.wait('@fetchPosts').then(() => {
                cy.contains(updateText);

                // suppression de la publication
                cy.get('[data-testid=post]:first')
                    .find('button[aria-label*="Menu modifier"]')
                    .click()
                    .get('li:last')
                    .should('have.text', 'Supprimer')
                    .click();

                cy.wait('@fetchPosts').then(() => {
                    cy.get('[data-testid=post]').should(
                        'have.length',
                        postsLength - 1,
                    );
                });
            });
        });
    });
});
