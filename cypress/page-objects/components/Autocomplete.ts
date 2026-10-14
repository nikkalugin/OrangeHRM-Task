export class Autocomplete {
    static pickFirst(getGroup: () => Cypress.Chainable<JQuery<HTMLElement>>, hint: string) {
        getGroup().find('input').clear().type(hint);

        cy.get('.oxd-autocomplete-option')
        .should('not.contain.text', 'Searching')
        .first()
        .click();

        return getGroup().find('input').invoke('val');
    }
}