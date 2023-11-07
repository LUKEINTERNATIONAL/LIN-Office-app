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
            { label: 'Manage Timesheet', icon: 'pi pi-file', to: '/blocks', badge: 'NEW' },
            { label: 'Manage Users', icon: 'pi pi-users', url: 'https://www.primefaces.org/primeflex/', target: '_blank' },
            { label: 'Manage Projects', icon: 'pi pi-box', to: '/utilities/icons' },
            { label: 'Set Date Line', icon: 'pi pi-chevron-circle-down', url: 'https://www.primefaces.org/primeflex/', target: '_blank' },
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'Manage Account', icon: 'pi pi-users', url: 'https://www.primefaces.org/primeflex/', target: '_blank' },
        ]
    }
]
