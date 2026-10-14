import { LoginPage } from '../../page-objects/auth/LoginPage';
import { DashboardPage } from '../../page-objects/dashboard/DashboardPage';
import { withCredentials } from '../../utils/env';
import negativeCases from '../../fixtures/login-negative.json';
import { ROUTES } from '../../utils/constants';

describe('Login: Positive scenarios', () => {
    const loginPage = new LoginPage();
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        loginPage.visit().verifyOnLoginPage();
    });

    it('Log in with valid credentials', { tags: ['@smoke', '@critical']}, () => {
        withCredentials(({ username, password }) => {
            loginPage.login(username, password);
        });
        dashboardPage.verifyLoadedDashboardPage();
    });

    it('Log out and returns to the login page', { tags: '@regression' }, () => {
        withCredentials(({ username, password }) => {
            loginPage.login(username, password);
        });
        dashboardPage.verifyLoadedDashboardPage().logout();
        loginPage.verifyOnLoginPage();
    });

    it('Does not allow access to dashboard without authentication', { tags: '@regression' }, () => {
        cy.visit(ROUTES.dashboard);
        loginPage.verifyOnLoginPage();
    });

    describe('Login: Negative scenarios', () => {
        negativeCases.forEach(({ title, username, password, error }) => {
            it(`Show validation for ${title}`, { tags: '@regression' }, () => {
                loginPage.login(username, password);

                if (error === 'invalid') {
                    loginPage.verifyInvalidCredentialsError();
                } else {
                    loginPage.verifyRequiredFieldErrors(1);
                }
                cy.url().should('include', '/auth/login');
            });
        });
    });
});