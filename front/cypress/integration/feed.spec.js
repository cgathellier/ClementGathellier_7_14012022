let token;

before(function fetchUser() {
    cy.request('POST', 'http://localhost:3000/auth/login', {
        email: 'john.doe@gmail.com',
        password: 'mdpTest01',
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

    cy.request({
        method: 'GET',
        url: 'http://localhost:3000/posts',
        failOnStatusCode: false,
        auth: {
            bearer: token,
        },
    }).then((res) => {
        if (res.status === 404) {
            cy.request({
                method: 'POST',
                url: 'http://localhost:3000/posts',
                auth: {
                    bearer: token,
                },
                body: {
                    text: 'Lorem ipsum',
                },
            });
        }
    });
});

describe('Fetch, add, update, delete posts/comments', () => {
    const text = 'Lorem ipsum';
    const updateText = 'Lorem ipsum dolor sit amet';
    const commentText = 'Random text';
    const updateCommentText = 'Modified text';

    it('manages a post', () => {
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

    it('manages a comment', () => {
        cy.get('[data-testid=post]:first')
            .find('[data-testid=commentBtn]')
            .click()
            .get('[data-testid=commentSubmit]')
            .should('be.disabled')
            .get('[data-testid=commentInput]')
            .focused()
            .type(commentText)
            .should('have.text', commentText);

        cy.intercept('GET', 'http://localhost:3000/posts').as('fetchPosts');
        cy.get('[data-testid=commentSubmit]').click();

        cy.wait('@fetchPosts').then((intercept) => {
            const commentsLength =
                intercept?.response?.body?.[0].comments?.length;

            cy.get('[data-testid=comment]:last')
                .find('button[aria-label*="Menu modifier"]')
                .click()
                .get('li:first')
                .should('have.text', 'Modifier')
                .click()
                // formulaire modification
                .get('[data-testid=editTextInput]')
                .focused()
                .should('have.text', commentText)
                .get('[data-testid=submitEditedText]')
                .should('be.disabled')
                .get('[data-testid=editTextInput]')
                .clear()
                .get('[data-testid=submitEditedText]')
                .should('be.disabled')
                .get('[data-testid=editTextInput]')
                .type(updateCommentText)
                .get('[data-testid=submitEditedText]')
                .click();

            cy.wait('@fetchPosts').then(() => {
                cy.contains(updateCommentText);

                // suppression du commentaire
                cy.get('[data-testid=comment]:last')
                    .find('button[aria-label*="Menu modifier"]')
                    .click()
                    .get('li:last')
                    .should('have.text', 'Supprimer')
                    .click();

                cy.wait('@fetchPosts').then(() => {
                    cy.get('[data-testid=post]:first')
                        .find('[data-testid=comment]')
                        .should('have.length', commentsLength - 1);
                });
            });
        });
    });
});
