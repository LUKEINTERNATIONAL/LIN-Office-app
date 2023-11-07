export default [
    {
      name: "timesheet_home",
      path: "timesheet_home",
      component: () => import('@/apps/timesheet/views/home.vue')
    },
    {
      name: "timesheet",
      path: "timesheet",
      component: () => import('@/apps/timesheet/views/timesheet.vue')
    }

  ]
  
  