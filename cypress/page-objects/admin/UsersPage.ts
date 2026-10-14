import { BasePage } from '../BasePage';
import { ROUTES } from '../../utils/constants';
import { ConfirmDialog } from '../components/ConfirmDialog';

export class UsersPage extends BasePage {
    protected readonly path = ROUTES.users;

    private readonly selectors = {
        row: '.oxd-table-card',
        cell: '.oxd-table-cell',
        editIcon: '.bi-pencil-fill',
        deleteIcon: '.bi-trash'
    } as const;

    verifyLoaded(): this {
        cy.url().should('include', ROUTES.users);
        cy.contains('button', 'Search').should('be.visible');
        return this;
    }

    searchByUsername(username: string): this {
        this.fieldByLabel('Username').find('input').clear().type(username);
        cy.contains('button', 'Search').click();
        return this;
    }

    addUser(): this {
        cy.contains('button', 'Add').click();
        return this;
    }

    verifyUserRow(expected: { username: string; role: string; status: string; employee?: string }): this {
        cy.contains(this.selectors.row, expected.username).within(() => {
        cy.get(this.selectors.cell).eq(1).should('have.text', expected.username);
        cy.get(this.selectors.cell).eq(2).should('have.text', expected.role);
        cy.get(this.selectors.cell).eq(4).should('have.text', expected.status);
            if (expected.employee) {
                cy.get(this.selectors.cell).eq(3).should('contain.text', expected.employee);
            }
        });
        return this;
    }

    verifyUserNotInList(username: string): this {
        cy.get('body').should('not.contain.text', username);
        cy.get(this.selectors.row).should('not.exist');
        return this;
    }

    openEdit(username: string): this {
        cy.contains(this.selectors.row, username).find(this.selectors.editIcon).click();
        return this;
    }

    deleteUser(username: string): this {
        cy.contains(this.selectors.row, username).find(this.selectors.deleteIcon).click();
        ConfirmDialog.confirmDelete();
        return this;
    }

    deleteIfExists(username: string): this {
        this.visit();
        this.searchByUsername(username);
        cy.get('body').then(($body) => {
            if ($body.find(this.selectors.row).length) {
                this.deleteUser(username);
            }
        });
        return this;
    }
}