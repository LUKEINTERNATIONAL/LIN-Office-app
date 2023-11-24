export default [
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/nav/timesheet_home' }]
    },
    {
        label: 'General',
        items: [
            { label: 'Timesheet', icon: 'pi pi-calendar-plus', to: '/nav/timesheet' },
        ]
    },
    {
        label: 'Admin',
        items: [
            { label: 'Manage Timesheet', icon: 'pi pi-file', to: '/nav/timesheet_admin', badge: 'NEW' },
            { label: 'Manage Users', icon: 'pi pi-users', to: '/nav/manage_users'  },
            { label: 'Manage Projects', icon: 'pi pi-box', to: '/nav/manage_projects' },
            { label: 'Manage Occupations', icon: 'pi pi-box', to: '/nav/manage_occupations' },
            { label: 'Timesheet Configurations', icon: 'pi pi-chevron-circle-down', to: '/nav/timesheet_conf'},
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'Manage Account', icon: 'pi pi-users', to: '/nav/manage_account' },
        ]
    }
]
