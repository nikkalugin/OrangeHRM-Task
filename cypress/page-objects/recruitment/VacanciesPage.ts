import { BasePage } from '../BasePage';
import { ROUTES } from '../../utils/constants';
import { Dropdown } from '../components/Dropdown';

export class VacanciesPage extends BasePage {
    protected readonly path = ROUTES.vacancies;
    private static readonly DELETED_MARK = '(Deleted)';

    private readonly selectors = {
        row: '.oxd-table-card',
        cell: '.oxd-table-cell',
        searchButton: 'button[type="submit"]',
        resetButton: 'button.oxd-button--ghost[type="button"]',
        recordsCount: '.orangehrm-horizontal-padding .oxd-text--span'
    } as const;

    verifyLoaded(): this {
        cy.url().should('include', ROUTES.vacancies);
        cy.get('.oxd-table-header-cell').should(($h) => {
            const headers = [...$h].map((el) => el.innerText.trim());
            expect(headers.some((h) => h.startsWith('Job Title')), `headers: ${headers.join(' | ')}`)
            .to.be.true;
        });
        cy.get(this.selectors.row).should('have.length.greaterThan', 0);
        return this;
    }

    columnIndex(header: string): Cypress.Chainable<number> {
        return cy.get('.oxd-table-header-cell').then(($h) => {
            const idx = [...$h].findIndex((el) => el.innerText.trim().startsWith(header));
            expect(idx, `column "${header}" exists`).to.be.greaterThan(-1);
            return idx;
        });
    }

    getFirstNonEmptyValue(header: string): Cypress.Chainable<string> {
        return this.columnIndex(header).then((idx) =>
            cy.get(this.selectors.row).then(($rows) => {
                const values = [...$rows]
                .map((r) => r.querySelectorAll(this.selectors.cell)[idx]?.textContent?.trim() ?? '')
                .filter((v) => v && !v.includes(VacanciesPage.DELETED_MARK));
                expect(values, `Selectable "${header}" values (without "(Deleted)")`).to.not.be.empty;
                return values[0];
            }),
        );
    }

    filterGroup(index: number) {
        return cy.get('.oxd-table-filter .oxd-input-group').eq(index);
    }

    filterByJobTitle(value: string): this {
        Dropdown.select(() => this.filterGroup(0), value);
        return this;
    }

    filterByVacancy(value: string): this {
        Dropdown.select(() => this.filterGroup(1), value);
        return this;
    }

    filterByStatus(value: string): this {
        Dropdown.select(() => this.filterGroup(3), value);
        return this;
    }

    search(): this {
        cy.get(this.selectors.searchButton).click();
        return this;
    }

    reset(): this {
        cy.get(this.selectors.resetButton).click();
        return this;
    }

    verifyAllRowsMatch(header: string, expected: string): this {
        this.columnIndex(header).then((idx) => {
            cy.get(this.selectors.row)
            .should('have.length.greaterThan', 0)
            .each(($row) => {
                const text = $row.find(this.selectors.cell).eq(idx).text().trim();
                expect(text, `${header} in row`).to.eq(expected);
            });
        });
        return this;
    }

    verifyNoRowsWith(header: string, unexpected: string): this {
        this.columnIndex(header).then((idx) => {
            cy.get(this.selectors.row).each(($row) => {
                const text = $row.find(this.selectors.cell).eq(idx).text().trim();
                expect(text, `${header} must not be "${unexpected}"`).to.not.eq(unexpected);
            });
        });
        return this;
    }

    verifyNoRecords(): this {
        cy.get(this.selectors.row).should('not.exist');
        return this;
    }
}