import { AttachmentsPage } from '../../page-objects/my-info/AttachmentsPage';
import { buildAttachment } from '../../utils/dataFactory';
import { SidebarMenu } from '../../page-objects/components/SidebarMenu';
import { cleanupRegistry } from '../../utils/cleanupRegistry';
import { ROUTES } from '../../utils/constants';

describe('My Info: Attachments', () => {
    const attachmentsPage = new AttachmentsPage();

    beforeEach(() => {
        cy.login();
        cy.visit(ROUTES.dashboard);
        attachmentsPage.open().verifyLoaded();
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

    it('Uploads an attachment and lists it', { tags: ['@smoke', '@regression'] }, () => {
        const attachment = buildAttachment();
        cleanupRegistry.addAttachment(attachment.description);

        attachmentsPage.upload(attachment).verifyListed(attachment);
    });

    it('Downloads an uploaded attachment', { tags: '@regression' }, () => {
        const attachment = buildAttachment();
        cleanupRegistry.addAttachment(attachment.description);

        attachmentsPage.upload(attachment);
        attachmentsPage.download(attachment).verifyDownloadedFile(attachment);
    });

    it('Deletes an attachment and removes it from the list', { tags: '@regression' }, () => {
        const attachment = buildAttachment();
        cleanupRegistry.addAttachment(attachment.description);

        attachmentsPage.upload(attachment);
        attachmentsPage.delete(attachment).verifyNotListed(attachment);
        cleanupRegistry.removeAttachment(attachment.description);
    });
});