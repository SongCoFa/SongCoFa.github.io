const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/repair-system',
    children: [
      {
        path: 'repair-system',
        name: '報修主頁',
        component: () => import('pages/repair-system')
      },
      {
        path: 'repair-system/detail',
        name: '報修明細',
        component: () => import('pages/repair-system/detail')
      },
      {
        path: 'repair-system/print',
        name: '明細列印',
        component: () => import('pages/repair-system/detail/print')
      },
      {
        path: 'login',
        name: '登入頁',
        component: () => import('pages/login')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    redirect: '/login'
  }
]

export default routes
