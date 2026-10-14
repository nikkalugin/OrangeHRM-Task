type Credentials = { 
    username: string; 
    password: string 
};

export const withCredentials = (callback: (creds: Credentials) => void): void => {
    cy.task<Partial<Credentials>>('getCredentials', null, { log: false }).then(
        ({ username, password }) => {
            if (!username || !password) {
                throw new Error('Missing ORANGEHRM_USERNAME / ORANGEHRM_PASSWORD. Check your .env file.');
            }
            callback({ username, password });
        },
    );
};