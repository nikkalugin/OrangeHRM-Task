# OrangeHRM E2E Test Automation

End-to-end UI test suite for the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/)
built with **Cypress + TypeScript**, using the **Page Object Model**, with **Allure** reporting.

## Project overview

Covered scenarios:

| # | Module | Spec |
|---|---|---|
| 2.1 | Login (positive, negative, logout, unauthenticated access) | `e2e/auth/login.cy.ts` |
| 2.2 | Admin → User Management (create, verify, edit, delete) | `e2e/admin/user-management.cy.ts` |
| 2.3 | My Info → Attachments (upload, verify, download, delete) | `e2e/my-info/attachments.cy.ts` |
| 2.4 | Dashboard chart widgets with negative assertions | `e2e/dashboard/dashboard-widgets.cy.ts` |
| 2.5 | Recruitment → Vacancies search by filters | `e2e/recruitment/vacancies-search.cy.ts` |

## Prerequisites

- Node.js 20+ and npm
- Java (JRE 11+) — required only to generate the Allure HTML report
- Google Chrome (or any browser supported by Cypress)

## Setup

```bash
git clone <repo-url>
cd OrangeHRM-Task
npm ci
cp .env.example .env     # on Windows: copy .env.example .env
```

## Configuration

The project reads all environment-specific values (base URL and credentials) from environment variables. Nothing is hardcoded in the test code.

| Variable | Description |
|---|---|
| `BASE_URL` | Base URL of the application under test |
| `ORANGEHRM_USERNAME` | Login username |
| `ORANGEHRM_PASSWORD` | Login password |

### Local run

1. Copy the template: `cp .env.example .env` (on Windows: `copy .env.example .env`).
2. Fill in the values in `.env`. The expected variable names are listed in `.env.example`; the demo credentials are displayed on the login page of the application.

`.env` is git-ignored, while `.env.example` is committed and contains only variable names without values.

### CI run (GitHub Actions)

In CI no `.env` file is used. The same three variables are stored as **repository secrets** (Settings → Secrets and variables → Actions) and passed to the workflow through `env`. To run the pipeline in a fork or a new repository, create secrets with exactly these names: `BASE_URL`, `ORANGEHRM_USERNAME`, `ORANGEHRM_PASSWORD`.

### Security notes

- Values are read in the Node process (`cypress.config.ts` and `cy.task`) and are not exposed through the browser-side Cypress env.
- The password is typed with `{ log: false }`, so it never appears in the Cypress command log.
- GitHub masks secret values in CI logs.
- Secrets are not passed to workflows triggered from forks (a GitHub security restriction).

## Running the tests

| Command | Description |
|---|---|
| `npm run cy:open` | Interactive Test Runner |
| `npm test` | Whole suite, headless |
| `npm run test:smoke` | Only `@smoke` tests |
| `npm run test:regression` | Only `@regression` tests |
| `npx cypress run --spec "cypress/e2e/auth/*.cy.ts"` | A single spec or folder |

### Reports (Allure)

```bash
npm test
npm run allure:serve        # generate and open the report
# or
npm run allure:generate && npm run allure:open
```

## Project structure

```
cypress/
├── e2e/                 # Test scenarios only (no selectors), grouped by feature
├── page-objects/        # One class per page; selectors live inside the class
│   └── components/      # Reusable widgets: Dropdown, Autocomplete, Toast, ConfirmDialog, SidebarMenu
├── fixtures/            # Static test data (JSON, upload file)
├── support/             # Custom commands (cy.login via cy.session), global setup, types
└── utils/               # dataFactory, cleanupRegistry, env helper, constants, Allure metadata
```

## Approach

- **Page Object Model.** Tests contain only scenario steps and assertions; selectors and UI interactions live in page objects. Methods return `this` for fluent chains.
- **Reusable components.** OrangeHRM repeats the same widgets everywhere, so dropdowns, autocomplete, toasts and confirm dialogs are shared classes.
- **Sessions.** `cy.login()` uses `cy.session()` so only `login.cy.ts` goes through the login form each time.
- **Synchronisation.** No fixed `cy.wait(ms)`. Tests wait on elements, URLs, spinners, and `cy.intercept` aliases that only observe UI-triggered requests.
- **Dynamic data.** Usernames and attachment descriptions are generated with `faker` plus a timestamp and use the `qa_auto_` prefix.
- **Data-driven testing.** Cases for login negatives, vacancy statuses, dashboard widgets and user role/status combinations come from JSON fixtures.
- **Cleanup for repeatable runs.**
  1. Every created entity is registered in `cleanupRegistry` before creation.
  2. `afterEach` deletes registered entities through the UI (also after a failed test).
  3. User specs run a pre-run sweep that removes orphaned `qa_auto_*` users from earlier aborted runs.
- **Reporting.** Allure with epic/feature/severity metadata, failure screenshots, and retries in run mode (`retries.runMode = 1`).
- **Tags.** `@smoke`, `@regression`, `@critical` via `@cypress/grep`.

## Design decisions

- **UI-only.** The task describes UI-level E2E testing, so setup and cleanup also go through the UI. This is slower than API setup but stays within scope and avoids coupling to undocumented endpoints.
- **Locators.** OrangeHRM has no `data-testid`, so locators rely on `name`, `type`, `href`, stable `oxd-*` classes, and a label-based helper for form fields.
- **Filter values come from data on the page.** Vacancy filters use values read from the table (skipping rows marked "(Deleted)") instead of hardcoded names.

## Assumptions and limitations

- The demo is a **shared public environment**: data is reset periodically and other users can change global settings. The suite sets the interface language to English during session setup, but a change in the middle of a run can still cause failures.
- Demo data contains records referencing deleted entities (shown as "(Deleted)"); they cannot be selected in dropdowns and are skipped.
- Chart widgets are drawn on `<canvas>`: the suite validates rendering (non-empty pixels), legend labels, and negative conditions, but tooltip text cannot be asserted through the DOM.
- Search verification covers the first page of results only.
- Locators were written against OrangeHRM 5.x and may need adjustment after UI updates.
- The public demo may be slow, so timeouts are raised in `cypress.config.ts`.
- TODO: confirm the exact behaviour of the Username filter (partial match) used by the pre-run cleanup.

## Suggestions for improvement

- Run against a self-hosted OrangeHRM instance (Docker) through `BASE_URL` for a stable, isolated environment.
- Move test data setup and cleanup to API calls to speed up runs, keeping the UI for the scenarios under test.
- Add CSV-driven cases (parsed via `cy.task` plus `papaparse`) and cross-browser runs in CI.
- Add visual regression for dashboard charts.