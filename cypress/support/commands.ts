import { LoginPage } from "../page-objects/auth/LoginPage";
import { DashboardPage } from "../page-objects/dashboard/DashboardPage";
import { withCredentials } from '../utils/env';
import { ROUTES } from "../utils/constants";

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
                    cy.visit(ROUTES.dashboard);
                    cy.url().should('include', '/dashboard');
                },
                cacheAcrossSpecs: true,
            },
        );
    });
});