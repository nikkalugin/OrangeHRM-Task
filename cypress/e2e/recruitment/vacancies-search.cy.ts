import { VacanciesPage } from '../../page-objects/recruitment/VacanciesPage';
import filters from '../../fixtures/vacancy-filters.json';

describe('Recruitment: Vacancies Search', () => {
    const vacanciesPage = new VacanciesPage();

    beforeEach(() => {
        cy.login();
        cy.visit('/web/index.php/dashboard/index');
        vacanciesPage.visit().verifyLoaded();
    });

    it('Filters by Job Title taken from existing data', { tags: ['@smoke', '@regression'] }, () => {
        vacanciesPage.getFirstNonEmptyValue('Job Title').then((jobTitle) => {
            vacanciesPage.filterByJobTitle(jobTitle).search();
            vacanciesPage.verifyAllRowsMatch('Job Title', jobTitle);
        });
    });

    it('Filters by Vacancy name taken from existing data', { tags: ['@smoke', '@regression'] }, () => {
        vacanciesPage.getFirstNonEmptyValue('Vacancy').then((vacancy) => {
            vacanciesPage.filterByVacancy(vacancy).search();
            vacanciesPage.verifyAllRowsMatch('Vacancy', vacancy);
        });
    });

    filters.statuses.forEach((status) => {
        it(`Filters by Status = ${status}`, { tags: '@regression' }, () => {
            vacanciesPage.filterByStatus(status).search();
            cy.get('body').then(($body) => {
                if ($body.find('.oxd-table-card').length) {
                    vacanciesPage.verifyAllRowsMatch('Status', status);
                    const opposite = status === 'Active' ? 'Closed' : 'Active';
                    vacanciesPage.verifyNoRowsWith('Status', opposite);
                } else {
                    vacanciesPage.verifyNoRecords();
                }
            });
        });
    });

    it('Combines Job Title and Status filters', { tags: '@regression' }, () => {
        vacanciesPage.getFirstNonEmptyValue('Job Title').then((jobTitle) => {
            vacanciesPage.getFirstNonEmptyValue('Status').then((status) => {
                vacanciesPage.filterByJobTitle(jobTitle).filterByStatus(status).search();
                vacanciesPage.verifyAllRowsMatch('Job Title', jobTitle);
                vacanciesPage.verifyAllRowsMatch('Status', status);
            });
        });
    });

    it('Restores the full list after Reset', { tags: '@regression' }, () => {
        cy.get('.oxd-table-card').its('length').then((initialCount) => {
            vacanciesPage.getFirstNonEmptyValue('Job Title').then((jobTitle) => {
                vacanciesPage.filterByJobTitle(jobTitle).search().reset();
                cy.get('.oxd-table-card').should('have.length', initialCount);
            });
        });
    });
});