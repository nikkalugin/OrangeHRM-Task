import { BasePage } from '../BasePage';
import { ROUTES } from '../../utils/constants';

export class LoginPage extends BasePage {
    protected readonly path = ROUTES.login;

    private readonly selectors = {
        usernameField: "input[name='username']",
        passwordField: "input[name='password']",
        loginButton: "button[type='submit']",
        errorAlert: "div[role='alert']",
        fieldError: "span.oxd-text",
        loginHeading: "h5"
    } as const;

    enterUsernameValue(username: string): this {
        if (username) {
            cy.get(this.selectors.usernameField).clear().type(username);
        }
        return this;
    }

    enterPasswordValue(password: string): this {
    if (password) {
            cy.get(this.selectors.passwordField).clear().type(password, { log: false });
        }
        return this;
    }

    clickLoginButton(): this {
        cy.get(this.selectors.loginButton).click();
        return this;
    }

    login(username: string, password: string): this {
        this.enterUsernameValue(username);
        this.enterPasswordValue(password);
        return this.clickLoginButton();
    }

    verifyOnLoginPage(): this {
        cy.get(this.selectors.loginHeading).should('be.visible');
        cy.get(this.selectors.loginButton).should('be.visible');
        return this;
    }

    verifyInvalidCredentialsError(): this {
        cy.get(this.selectors.errorAlert).should('be.visible').and('have.text', 'Invalid credentials');
        return this;
    }

    verifyRequiredFieldErrors(count: number): this {
        cy.get(this.selectors.fieldError)
        .should('have.length', count)
        .each(($el) => expect($el.text()).to.eq('Required'));
        return this;
    }
}