import { DashboardPage } from '../../page-objects/dashboard/DashboardPage';
import widgets from '../../fixtures/dashboard-widgets.json';

describe('Dashboard: Chart Widgets', () => {
    const dashboardPage = new DashboardPage();

    beforeEach(() => {
        cy.login();
        dashboardPage.visit().verifyLoadedDashboardPage();
    });

    widgets.chartWidgets.forEach(({ title, forbiddenLabels }) => {
        it(`Validates "${title}" chart`, { tags: ['@smoke', '@regression'] }, () => {
        dashboardPage
            .verifyWidgetVisible(title)
            .verifyChartRendered(title)
            .verifyLegendHasValidLabels(title, forbiddenLabels)
            .verifyWidgetHasNoErrorState(title);
        });
    });

    it('Does not show widgets that do not exist', { tags: '@regression' }, () => {
        widgets.absentWidgets.forEach((title) => dashboardPage.verifyWidgetAbsent(title));
    });

    it('Keeps both chart widgets on the page at the same time', { tags: '@regression' }, () => {
        widgets.chartWidgets.forEach(({ title }) => dashboardPage.verifyWidgetVisible(title));
    });
});