let token;

before(function fetchUser() {
    cy.request('POST', 'http://localhost:3000/auth/login', {
        email: Cypress.env('email'),
        password: Cypress.env('password'),
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

describe('App lauching', () => {
    it('gets the user context', () => {
        cy.visit('/');

        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/users/checkToken',
            auth: {
                bearer: token,
            },
        })
            .its('body')
            .should('deep.equal', {
                email: 'admin@groupomania.com',
                firstName: 'Admin',
                id: 10,
                isAdmin: true,
                lastName: 'Groupomania',
            });
    });
});
