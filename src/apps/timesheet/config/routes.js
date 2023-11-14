export default [
    {
      name: "timesheet_home",
      path: "timesheet_home",
      component: () => import('@/apps/timesheet/views/home.vue')
    },
    {
      name: "timesheet",
      path: "timesheet",
      component: () => import('@/apps/timesheet/views/Timesheet.vue')
    },
    {
      name: "timesheet_admin",
      path: "timesheet_admin",
      component: () => import('@/apps/timesheet/views/TimesheetAdmin.vue')
    },
    {
      name: "manage_users",
      path: "manage_users",
      component: () => import('@/apps/timesheet/views/ManageUsers.vue')
    },
    {
      name: "manage_projects",
      path: "manage_projects",
      component: () => import('@/apps/timesheet/views/ManageProjects.vue')
    },
    {
      name: "timesheet_conf",
      path: "timesheet_conf",
      component: () => import('@/apps/timesheet/views/TimesheetConfigurations.vue')
    },
    {
      name: "manage_account",
      path: "manage_account",
      component: () => import('@/apps/timesheet/views/ManageAccount.vue')
    }

  ]
  
  