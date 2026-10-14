import { BasePage } from '../BasePage';
import { ROUTES } from '../../utils/constants';
import { Dropdown } from '../components/Dropdown';
import { Autocomplete } from '../components/Autocomplete';
import type { TestUser } from '../../utils/dataFactory';

export class UserFormPage extends BasePage {
    protected readonly path = ROUTES.addUser;

    selectRole(role: string): this {
        Dropdown.select(() => this.fieldByLabel('User Role'), role);
        return this;
    }

    selectStatus(status: string): this {
        Dropdown.select(() => this.fieldByLabel('Status'), status);
        return this;
    }

    selectEmployee(hint = 'a') {
        return Autocomplete.pickFirst(() => this.fieldByLabel('Employee Name'), hint);
    }

    enterUsername(username: string): this {
        this.fieldByLabel('Username').find('input').clear().type(username);
        return this;
    }

    enterPassword(password: string): this {
        this.fieldByLabel('Password').find('input').type(password, { log: false });
        this.fieldByLabel('Confirm Password').find('input').type(password, { log: false });
        return this;
    }

    save(): this {
        cy.contains('button', 'Save').click();
        return this;
    }

    createUser(user: TestUser) {
        this.visit();
        this.selectRole(user.role);
        const employee = this.selectEmployee();
        this.selectStatus(user.status);
        this.enterUsername(user.username);
        this.enterPassword(user.password);
        this.save();
        return employee;
    }

    private waitForEditFormReady(username: string): this {
        this.fieldByLabel('Username').find('input').should('have.value', username);
        this.fieldByLabel('User Role')
            .find('.oxd-select-text-input')
            .should('not.have.text', '-- Select --');
        return this;
    }

    editRoleAndStatus(username: string, role: string, status: string): this {
        this.waitForEditFormReady(username);
        this.selectRole(role);
        this.selectStatus(status);
        this.save();
        return this;
    }
}