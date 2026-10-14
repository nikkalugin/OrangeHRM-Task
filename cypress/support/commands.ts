import { LoginPage } from "../page-objects/LoginPage";
import { DashboardPage } from "../page-objects/DashboardPage";
import { withCredentials } from '../utils/env';

Cypress.Commands.add('login', () => {
    withCredentials(({ username, password }) => {
        cy.session(
            [username],
            () => {
                new LoginPage().visit().login(username, password);
                new DashboardPage().verifyLoadedDashboardPage();
            },
            {
                validate: () => {
                    cy.visit('/web/index.php/dashboard/index');
                    cy.url().should('include', '/dashboard');
                },
                cacheAcrossSpecs: true,
            },
        );
    });
});