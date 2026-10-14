export const ROUTES = {
    login: '/web/index.php/auth/login',
    dashboard: '/web/index.php/dashboard/index',
    users: '/web/index.php/admin/viewSystemUsers',
    addUser: '/web/index.php/admin/saveSystemUser',
    myInfo: '/web/index.php/pim/viewMyDetails',
    currentMyInfo: '/pim/viewPersonalDetails',
    vacancies: '/web/index.php/recruitment/viewJobVacancy'
} as const;

export const USER_PREFIX = 'qa_auto_';
export const ATTACHMENT_PREFIX = 'qa_auto_attach_';