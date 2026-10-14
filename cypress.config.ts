import { defineConfig } from 'cypress';
import { allureCypress } from 'allure-cypress/reporter';
import { plugin as grepPlugin } from '@cypress/grep/plugin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

export default defineConfig({
    downloadsFolder: 'cypress/downloads',
    video: false,
    screenshotOnRunFailure: true,
    retries: { 
        runMode: 1, 
        openMode: 0 
    },
    e2e: {
        baseUrl: process.env.BASE_URL,
        defaultCommandTimeout: 10000,
        setupNodeEvents(on, config) {
            on('task', {
                getCredentials() {
                    return {
                        username: process.env.ORANGEHRM_USERNAME,
                        password: process.env.ORANGEHRM_PASSWORD,
                    };
                },
                clearDownloads() {
                const dir = path.resolve(config.downloadsFolder);
                    if (fs.existsSync(dir)) {
                        fs.readdirSync(dir).forEach((f) =>
                            fs.rmSync(path.join(dir, f), { force: true }),
                        );
                    }
                    return null;
                },
            });

            allureCypress(on, config, {
                resultsDir: 'allure-results',
            });
            grepPlugin(config);
            
            return config;
        },
    },
});
