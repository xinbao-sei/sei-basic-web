export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/backConfig',
        name: 'backConfig',
        routes: [
          { path: '/backConfig/appModule', component: './BackConfig/AppModule' },
          { path: '/backConfig/feature', component: './BackConfig/Feature' },
          { path: '/backConfig/appMenu', component: './BackConfig/AppMenu' },
        ],
      },
      {
        path: '/orgStructure',
        name: 'orgStructure',
        routes: [{
          path: '/orgStructure/corporation',
          component: 'OrgStructure/Corporation'
        }, {
          path: '/orgStructure/positionCategory',
          component: 'OrgStructure/PositionCategory',
        }, {
          path: '/orgStructure/position',
          component: 'OrgStructure/Position',
        }, {
          path: '/orgStructure/organization',
          component: 'OrgStructure/Organization',
        }],
      },
      {
        path: '/regionManagement',
        name: 'regionManagement',
        routes: [{
          path: '/regionManagement/country',
          component: 'RegionManagement/Country'
        }],
      },
    ],
  },
];
