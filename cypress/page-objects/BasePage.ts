export abstract class BasePage {
    protected abstract readonly path: string;

    visit(): this {
        cy.visit(this.path);
        return this;
    }

    verifyUrlContains(fragment: string): this {
        cy.url().should('include', fragment);
        return this;
    }

    protected fieldByLabel(label: string) {
        return cy.contains('.oxd-label', new RegExp(`^\\s*${label}\\s*$`)).closest('.oxd-input-group');
    }
}