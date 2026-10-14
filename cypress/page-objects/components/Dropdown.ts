export class Dropdown {
    static select(getGroup: () => Cypress.Chainable<JQuery<HTMLElement>>, option: string): void {
        expect(option, 'dropdown option to select').to.not.be.empty;
        getGroup().find('.oxd-select-text').click();

        cy.get('.oxd-select-option')
        .should('have.length.greaterThan', 0)
        .should(($opts) => {
            const available = [...$opts].map((o) => o.innerText.trim());
            expect(available, `option "${option}" in [${available.join(' | ')}]`).to.include(option);
        });

        cy.contains('.oxd-select-option', option).click();
        getGroup().find('.oxd-select-text-input').should('contain.text', option);
    }
}