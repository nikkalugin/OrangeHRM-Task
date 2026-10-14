import { AttachmentsPage } from '../../page-objects/my-info/AttachmentsPage';
import { buildAttachment } from '../../utils/dataFactory';
import { SidebarMenu } from '../../page-objects/components/SidebarMenu';
import { cleanupRegistry } from '../../utils/cleanupRegistry';

describe('My Info: Attachments', () => {
    const attachmentsPage = new AttachmentsPage();

    beforeEach(() => {
        cy.login();
        cy.visit('/web/index.php/dashboard/index');
    });

    afterEach(() => {
        cy.login();
        cleanupRegistry.getAttachments().forEach((d) => attachmentsPage.deleteIfExists(d));
        cleanupRegistry.clear();
    });

    it('Navigates to My Info Page', { tags: '@smoke' }, () => {
        SidebarMenu.open('My Info');
        attachmentsPage.verifyLoaded();
    });

    it('Uploads, verifies, downloads and deletes an attachment', { tags: ['@smoke', '@regression'] }, () => {
        const attachment = buildAttachment();
        cleanupRegistry.addAttachment(attachment.description);
        attachmentsPage.open().verifyLoaded();
        attachmentsPage.upload(attachment).verifyListed(attachment);
        attachmentsPage.download(attachment).verifyDownloadedFile(attachment);
        attachmentsPage.delete(attachment).verifyNotListed(attachment);
        cleanupRegistry.removeAttachment(attachment.description);
    });
});