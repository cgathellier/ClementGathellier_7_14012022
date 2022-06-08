const email = 'john.doe@gmail.com',
    firstName = 'John',
    lastName = 'Doe',
    password = 'mdpTest01';

const newEmail = 'michel.dupont@gmail.com',
    newFirstName = 'Michel',
    newLastName = 'Dupont',
    newPassword = 'updatedPassword';
let token;

before(function fetchUser() {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/auth/login',
        failOnStatusCode: false,
        body: {
            email,
            password,
        },
    }).then((res) => {
        if (res.status === 401) {
            cy.request({
                method: 'POST',
                url: 'http://localhost:3000/auth/login',
                failOnStatusCode: false,
                body: {
                    email: newEmail,
                    password: newPassword,
                },
            }).then((res) => {
                if (res.status === 401) {
                    cy.request({
                        method: 'POST',
                        url: 'http://localhost:3000/auth/signup',
                        failOnStatusCode: false,
                        body: {
                            firstName,
                            lastName,
                            email,
                            password,
                        },
                    })
                        .its('body')
                        .then((res) => {
                            token = res?.accessToken;
                        });
                } else {
                    token = res?.body?.accessToken;
                }
            });
        } else {
            token = res?.body?.accessToken;
        }
    });
});

beforeEach(function setUser() {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3000/users/checkToken',
        auth: {
            bearer: token,
        },
    }).then((res) => {
        if (res?.body?.email !== email) {
            cy.request({
                method: 'PATCH',
                url: 'http://localhost:3000/users/infos',
                auth: {
                    bearer: token,
                },
                body: {
                    email,
                    firstName,
                    lastName,
                },
            }).then((res) => {
                token = res?.body?.[0].accessToken;
                cy.request({
                    method: 'PATCH',
                    url: 'http://localhost:3000/users/password',
                    auth: {
                        bearer: token,
                    },
                    body: {
                        password,
                    },
                }).then((res) => {
                    token = res?.body?.accessToken;
                });
            });
        }
    });

    cy.visit('/', {
        onBeforeLoad(win) {
            win.localStorage.setItem('gpmToken', token);
        },
    });
});

it.only('update user infos', () => {
    cy.get('button[aria-label="Aller à mon profil"]')
        .click()
        .url()
        .should('contain', '/profile/')
        .get('[data-testid=userName]')
        .should('have.text', `${firstName} ${lastName}`)
        .get('[data-testid=openEditProfileMenu]')
        .click();
    // update mail, prénom, nom
    cy.get('[data-testid=editInfos]')
        .should('be.visible')
        .click()
        .get('[data-testid=submitEditInfos]')
        .as('submitBtn')
        .should('be.disabled')
        .get('input[name=email]')
        .as('emailInput')
        .clear()
        .get('input[name=firstName]')
        .as('firstNameInput')
        .clear()
        .get('input[name=lastName]')
        .as('lastNameInput')
        .clear()
        .get('@submitBtn')
        .should('be.disabled')
        .get('@emailInput')
        .type(newEmail)
        .get('@firstNameInput')
        .type(newFirstName)
        .get('@lastNameInput')
        .type(newLastName)
        .get('@submitBtn')
        .should('not.be.disabled')
        .click();

    cy.get('[data-testid=confirmSubmit]')
        .as('confirmSubmit')
        .should('be.disabled')
        .get('input[name="password"]')
        .focused()
        .type(password)
        .get('@confirmSubmit')
        .click();

    // vérifier le changement de nom prénom sur la page profile
    cy.get('[data-testid=userName]').should(
        'have.text',
        `${newFirstName} ${newLastName}`,
    );

    // changement de mot de passe
    cy.get('[data-testid=openEditProfileMenu]').click();
    cy.get('[data-testid=editInfos]').focused();
    cy.get('[data-testid=editPassword]').should('be.visible').click();
    cy.get('[data-testid=submitEditPassword]')
        .as('submitBtn')
        .should('be.disabled')
        .get('input[name=password]')
        .type(password)
        .get('input[name=newPassword]')
        .type(newPassword)
        .get('input[name=confirmPassword]')
        .type(newPassword)
        .get('@submitBtn')
        .should('not.be.disabled')
        .click();

    // déco/reco pour vérifier que les changements de mail et mdp ont été pris en compte
    cy.get('button[aria-label="Fermer le menu"]')
        .click()
        .get('button[aria-label="Retour au fil d\'actualité"]')
        .click()
        .get('button[aria-label="Se déconnecter"]')
        .click()
        .url()
        .should('include', '/login');

    cy.get('[data-cy=email]')
        .type(newEmail)
        .get('[data-cy=password]')
        .type(newPassword)
        .get('[data-cy=submit]')
        .click()
        .url()
        .should('include', '/feed');

    // supprimer le compte
    cy.get('button[aria-label="Aller à mon profil"]')
        .click()
        .get('[data-testid=openEditProfileMenu]')
        .click();
    cy.get('[data-testid=editInfos]').focused();
    cy.get('[data-testid=deleteAccount]').should('be.visible').focus().click();
    cy.get('h2')
        .should('have.text', 'Supprimer le compte')
        .get('[data-testid=confirm]')
        .click();

    cy.get('[data-testid=confirmSubmit]')
        .as('confirmSubmit')
        .should('be.disabled')
        .get('input[name="password"]')
        .focused()
        .type(newPassword)
        .get('@confirmSubmit')
        .click()
        .url()
        .should('include', '/login');

    cy.get('[data-cy=email]')
        .type(newEmail)
        .get('[data-cy=password]')
        .type(newPassword)
        .get('[data-cy=submit]')
        .click()
        .url()
        .should('not.include', '/feed');

    cy.contains('Aucun compte ne correspond à ces identifiants');
});
