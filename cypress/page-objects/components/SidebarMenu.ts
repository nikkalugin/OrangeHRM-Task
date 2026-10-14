export class SidebarMenu {
    static open(item: string): void {
        cy.contains('.oxd-main-menu-item', item).click();
    }
}