const usernames = new Set<string>();
const attachments = new Set<string>();

export const cleanupRegistry = {
    addUser: (username: string) => usernames.add(username),
    removeUser: (username: string) => usernames.delete(username),
    getUsers: () => [...usernames],
    clear: () => { 
        usernames.clear(); 
        attachments.clear(); 
    },
    addAttachment: (description: string) => attachments.add(description),
    removeAttachment: (description: string) => attachments.delete(description),
    getAttachments: () => [...attachments],
};