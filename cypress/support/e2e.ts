import 'allure-cypress';
import './commands';
import { register as registerCypressGrep } from '@cypress/grep';

registerCypressGrep();

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes("Cannot read properties of undefined (reading 'response')")) {
        return false;
    }
    return true;
});