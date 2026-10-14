import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';

export class DashboardPage extends BasePage {
    protected readonly path = ROUTES.dashboard;

    private readonly selectors = {
        dashboardHeader: "h6",
        userDropdown: "p.oxd-userdropdown-name",
        logoutLink: 'a[href*="logout"]',
        widget: '.orangehrm-dashboard-widget',
        canvas: 'canvas',
        legendItem: '.oxd-chart-legend li, .orangehrm-dashboard-widget-body [class*="legend"] li',
        errorToast: '.oxd-toast--error'
    } as const;

    verifyLoadedDashboardPage(): this {
        this.verifyUrlContains('/dashboard');
        cy.get(this.selectors.dashboardHeader).should('have.text', 'Dashboard');
        return this;
    }

    logout(): this {
        cy.get(this.selectors.userDropdown).click();
        cy.get(this.selectors.logoutLink).click();
        return this;
    }

    widget(title: string) {
        return cy.contains(this.selectors.widget, title);
    }

    verifyWidgetVisible(title: string): this {
        this.widget(title).should('be.visible');
        return this;
    }

    verifyChartRendered(title: string): this {
        this.widget(title)
        .find(this.selectors.canvas)
        .should(($canvas) => {
            const canvas = $canvas[0] as HTMLCanvasElement;
            expect(canvas.width, 'canvas width').to.be.greaterThan(0);
            expect(canvas.height, 'canvas height').to.be.greaterThan(0);
            const pixels = canvas
            .getContext('2d')!
            .getImageData(0, 0, canvas.width, canvas.height).data;
            const hasDrawnPixels = pixels.some((value, i) => i % 4 === 3 && value > 0);
            expect(hasDrawnPixels, 'canvas has drawn pixels').to.be.true;
        });
        return this;
    }

    getLegendLabels(title: string): Cypress.Chainable<string[]> {
        return this.widget(title)
        .find(this.selectors.legendItem)
        .should('have.length.greaterThan', 0)
        .then(($items) => [...$items].map((el) => el.innerText.trim()));
    }

    verifyLegendHasValidLabels(title: string, forbidden: string[]): this {
        this.getLegendLabels(title).then((labels) => {
            expect(labels, 'legend labels').to.not.be.empty;
            labels.forEach((l) => expect(l, 'label is not blank').to.not.equal(''));
            forbidden.forEach((bad) => {
                expect(labels, `legend must not contain "${bad}"`).to.not.include(bad);
            });
            expect(new Set(labels).size, 'labels are unique').to.eq(labels.length);
        });
        return this;
    }

    verifyWidgetHasNoErrorState(title: string): this {
        this.widget(title).should('not.contain.text', 'No Records Found');
        cy.get(this.selectors.errorToast).should('not.exist');
        return this;
    }

    verifyWidgetAbsent(title: string): this {
        cy.contains(this.selectors.widget, title).should('not.exist');
        return this;
    }
}