export class ConfirmDialog {
    static confirmDelete(): void {
        cy.get('.oxd-dialog-container-default')
        .should('be.visible')
        .contains('button', 'Yes, Delete')
        .click();
    }
}