import { BasePage } from '../BasePage';
import { ROUTES } from '../../utils/constants';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TestAttachment } from '../../utils/dataFactory';

export class AttachmentsPage extends BasePage {
    protected readonly path = ROUTES.myInfo;

    private readonly selectors = {
        myInfoMenu: 'a[href*="/pim/viewMyDetails"]',
        addButton: '.orangehrm-attachment .orangehrm-action-header button',
        fileInput: 'input[type="file"]',
        description: '.orangehrm-attachment textarea',
        saveButton: '.orangehrm-attachment button[type="submit"]',
        row: '.oxd-table-card',
        cell: '.oxd-table-cell',
        downloadIcon: '.bi-download',
        deleteIcon: '.bi-trash',
        addAttachmentSection: '.orangehrm-card-container'
    } as const;

    open(): this {
        cy.get(this.selectors.myInfoMenu).click();
        cy.url().should('include', ROUTES.currentMyInfo);
        return this;
    }

    verifyLoaded(): this {
        cy.get('.orangehrm-attachment').should('exist');
        return this;
    }

    upload(attachment: TestAttachment): this {
        cy.get(this.selectors.addButton).scrollIntoView().click();
        cy.contains(this.selectors.addAttachmentSection, 'Add Attachment')
        .find(this.selectors.fileInput)
        .selectFile(
        {
            contents: Cypress.Buffer.from('Test QA attachment content'),
            fileName: attachment.fileName,
            mimeType: 'text/plain',
        },
            { 
                force: true 
            },
        );
        cy.get(this.selectors.description).type(attachment.description);
        cy.get(this.selectors.saveButton).click();
        return this;
    }

    verifyListed(attachment: TestAttachment): this {
        cy.contains(this.selectors.row, attachment.description).within(() => {
            cy.get(this.selectors.cell).should('contain.text', attachment.fileName);
            cy.get(this.selectors.cell).should('contain.text', attachment.description);
        });
        return this;
    }

    download(attachment: TestAttachment): this {
        cy.task('clearDownloads');
        cy.contains(this.selectors.row, attachment.description)
        .find(this.selectors.downloadIcon)
        .click();
        return this;
    }

    verifyDownloadedFile(attachment: TestAttachment): this {
        cy.readFile(`cypress/downloads/${attachment.fileName}`)
        .should('exist')
        .and('contain', 'QA attachment content');
        return this;
    }

    delete(attachment: TestAttachment): this {
        cy.contains(this.selectors.row, attachment.description)
        .find(this.selectors.deleteIcon)
        .click();
        ConfirmDialog.confirmDelete();
        return this;
    }

    verifyNotListed(attachment: TestAttachment): this {
        cy.contains(this.selectors.row, attachment.description).should('not.exist');
        return this;
    }

    openDirectly(): this {
        cy.visit(ROUTES.myInfo);
        cy.url().should('include', ROUTES.currentMyInfo);
        return this;
    }

    deleteIfExists(description: string): this {
        this.openDirectly().verifyLoaded();
        cy.get('body').then(($body) => {
            const $row = $body.find(`${this.selectors.row}:contains("${description}")`);
            if ($row.length) {
                $row.find(this.selectors.deleteIcon).trigger('click');
                ConfirmDialog.confirmDelete();
            }
        });
        return this;
    }
}