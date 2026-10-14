import { UsersPage } from '../../page-objects/admin/UsersPage';
import { UserFormPage } from '../../page-objects/admin/UserFormPage';
import { SidebarMenu } from '../../page-objects/components/SidebarMenu';
import { buildUser } from '../../utils/dataFactory';
import { cleanupRegistry } from '../../utils/cleanupRegistry';

describe('Admin: User Management', () => {
    const usersPage = new UsersPage();
    const userForm = new UserFormPage();

    beforeEach(() => {
        cy.login();
        cy.visit('/web/index.php/dashboard/index');
    });

    afterEach(() => {
        cy.login();
        cleanupRegistry.getUsers().forEach((u) => usersPage.deleteIfExists(u));
        cleanupRegistry.clear();
    });

    it('Navigates to Admin Users Page', { tags: '@smoke' }, () => {
        SidebarMenu.open('Admin');
        usersPage.verifyLoaded();
    });

    it('Creates, verifies, edits and deletes a user', { tags: ['@smoke', '@regression'] }, () => {
        const user = buildUser({ role: 'ESS', status: 'Enabled' });
        cleanupRegistry.addUser(user.username);
        userForm.createUser(user).then((employee) => {
            usersPage.verifyLoaded().searchByUsername(user.username);
            usersPage.verifyUserRow({
                username: user.username,
                role: user.role,
                status: user.status,
                employee: String(employee).split(' ')[0],
            });
        });
        usersPage.openEdit(user.username);
        userForm.editRoleAndStatus(user.username, 'Admin', 'Disabled');
        usersPage.verifyLoaded().searchByUsername(user.username);
        usersPage.verifyUserRow({ username: user.username, role: 'Admin', status: 'Disabled' });
        usersPage.deleteUser(user.username);
        usersPage.searchByUsername(user.username);
        usersPage.verifyUserNotInList(user.username);
        cleanupRegistry.removeUser(user.username);
    });
});