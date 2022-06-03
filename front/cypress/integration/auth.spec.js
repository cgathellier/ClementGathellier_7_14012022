const firstName = 'John';
const lastName = 'Doe';
const email = 'john.doe@gmail.com';
const password = 'mdpTest01';

describe('Sign up and log in', () => {
    it('should navigate between login and signup forms', () => {
        cy.visit('/');

        cy.url().should('include', '/login');
        cy.get('[data-cy=toSignup]').click();
        cy.url().should('include', '/signup');

        cy.get('[data-cy=toLogin]').click();
        cy.url().should('include', '/login');
    });

    it('sign up new user', () => {
        cy.visit('/signup');

        cy.get('[data-cy=firstName]')
            .type(firstName)
            .should('have.value', firstName);
        cy.get('[data-cy=lastName]')
            .type(lastName)
            .should('have.value', lastName);
        cy.get('[data-cy=email]').type(email).should('have.value', email);
        cy.get('[data-cy=password]')
            .type(password)
            .should('have.value', password);

        cy.intercept('http://localhost:3000/auth/signup').as('signupUser');

        cy.get('[data-cy=submit]').click();

        cy.wait('@signupUser').then((interception) => {
            if (interception?.response?.statusCode === 201) {
                cy.url().should('include', '/feed');
            } else if (interception?.response?.statusCode === 409) {
                cy.contains(
                    'Un compte est déjà enregistré avec cette adresse email',
                );
                cy.url().should('include', '/signup');
            }
        });
    });

    describe('Log in', () => {
        beforeEach(() => {
            cy.request(
                {
                    method: 'POST',
                    url: 'http://localhost:3000/auth/signup',
                    failOnStatusCode: false,
                },
                {
                    firstName,
                    lastName,
                    email,
                    password,
                },
            );
        });

        it('logs the user in', () => {
            cy.visit('/login');

            cy.get('[data-cy=email]').type(email).should('have.value', email);
            cy.get('[data-cy=password]')
                .type(password)
                .should('have.value', password);

            cy.get('[data-cy=submit]').click();

            cy.url().should('include', '/feed');
        });
    });

    describe('Error messages', () => {
        beforeEach(() => {
            cy.visit('/signup');
        });
        it('shows required-related error messages', () => {
            cy.get('[data-cy=submit]').click();

            cy.contains('Veuillez entrer votre prénom');
            cy.contains('Veuillez entrer votre nom');
            cy.contains('Veuillez indiquer votre adresse mail');
            cy.contains('Veuillez entrer un mot de passe');
        });

        it('should disable submit button if a field contains only spaces', () => {
            cy.get('[data-cy=firstName]').type('    ');
            cy.get('[data-cy=submit]').should('be.disabled');
            cy.get('[data-cy=firstName]').should('have.focus');
        });

        it('shows password-related error messages', () => {
            cy.get('[data-cy=firstName]')
                .type(firstName)
                .should('have.value', firstName);
            cy.get('[data-cy=lastName]')
                .type(lastName)
                .should('have.value', lastName);
            cy.get('[data-cy=email]').type(email).should('have.value', email);

            cy.get('[data-cy=password]').type('short');
            cy.get('[data-cy="submit"]').click();
            cy.contains('8 caractères minimum');

            cy.get('[data-cy=password]').type('thisPasswordIsTooLong');
            cy.contains('doit faire moins de 20 caractères');
        });
    });
});
