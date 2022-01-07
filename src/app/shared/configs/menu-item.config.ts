import { Menu } from '@shared/models/menu.model';

// Menu Items
export const MENUITEM: Menu[] = [
    {
        url: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        iconType: 'dashboard'
    }, 
    {
        url: '/test-development',
        title: 'Test Development',
        type: 'sub',
        iconType: 'apps',
        collapse: 'test-development',
        children: [
            { url: '/test-scripts', title: 'Test Scripts', ab: '' },
            { url: '/test-steps', title: 'Test Steps', ab: '' },
            { url: '/object-repository', title: 'Object Repository', ab: '' },
        ]
    },
    {
        url: '/test-suites',
        title: 'Test Suites',
        type: 'link',
        iconType: 'assignment'
    }, 
    {
        url: '/test-execution',
        title: 'Test Execution',
        type: 'link',
        iconType: 'assignment'
    }, 
    {
        url: '/test-report',
        title: 'Test Reports',
        type: 'link',
        iconType: 'assignment'
    }, 
    {
        url: '/configurations',
        title: 'Configurations',
        type: 'sub',
        iconType: 'apps',
        collapse: 'configurations',
        children: [
            { url: '/environments', title: 'Environments', ab: '' },
            { url: '/integration', title: 'Integration', ab: '' },
            { url: '/object-repository', title: 'Object Repository', ab: '' },
        ]
    },
    {
        url: '/admin',
        title: 'Admin',
        type: 'sub',
        iconType: 'apps',
        collapse: 'admin',
        children: [
            { url: '/projects', title: 'Projects', ab: '' },
            { url: '/users', title: 'Users', ab: '' },
            { url: '/rules', title: 'Rules', ab: '' },
        ]
    },
    {
        url: '/adons',
        title: 'Adons',
        type: 'link',
        iconType: 'assignment'
    }, 
    {
        url: '/client',
        title: 'Client',
        type: 'link',
        iconType: 'assignment'
    }, 
    {
        url: '/search-api',
        title: 'Search API',
        type: 'link',
        iconType: 'assignment'
    },
];