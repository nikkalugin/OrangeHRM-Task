import { faker } from '@faker-js/faker';
import { USER_PREFIX } from './constants';
import { ATTACHMENT_PREFIX } from './constants';

export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

export interface TestUser {
    username: string;
    password: string;
    role: UserRole;
    status: UserStatus;
}

export interface TestAttachment {
    fixturePath: string;
    fileName: string;
    description: string;
}

export const buildUser = (overrides: Partial<TestUser> = {}): TestUser => ({
    username: `${USER_PREFIX}${faker.string.alphanumeric(5)}${Date.now()}`.slice(0, 40),
    password: `Aa1${faker.string.alphanumeric(9)}`,
    role: 'ESS',
    status: 'Enabled',
    ...overrides,
});

export const buildAttachment = (): TestAttachment => ({
    fixturePath: 'cypress/fixtures/attachments/test-file.txt',
    fileName: 'test-file.txt',
    description: `${ATTACHMENT_PREFIX}${faker.string.alphanumeric(5)}${Date.now()}`,
});