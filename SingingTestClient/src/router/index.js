import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout/index.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      display: false,
    },
    {
      path: '/404',
      component: () => import('@/views/404'),
      display: false,
    },
    {
      path: '/',
      component: Layout,
      redirect: '/main',
      children: [{
        path: 'main',
        name: '首頁',
        component: () => import('@/views/main/index.vue'),
      }],
    },
    {
      path: '/profile-management',
      component: Layout,
      redirect: '/profile-management/driver',
      name: 'Basic data management',
      children: [
        {
          path: 'driver',
          name: '駕駛長資料管理',
          component: () => import('@/views/profile-management/driver/index.vue'),
        },
        {
          path: 'vehicle',
          name: '車輛資料管理',
          component: () => import('@/views/profile-management/vehicle/index.vue'),
        },
        {
          path: 'route',
          name: '路線資料管理',
          component: () => import('@/views/profile-management/route/index.vue'),
        },
        {
          path: 'driver-leave',
          name: '駕駛長休假資料管理',
          component: () => import('@/views/profile-management/driver-leave/index.vue'),
        },
        {
          path: 'national-holiday',
          name: '國定假日資料管理',
          component: () => import('@/views/profile-management/national-holiday/index.vue'),
        },
        {
          path: 'special-date',
          name: '特殊日期資料管理',
          component: () => import('@/views/profile-management/special-date/index.vue'),
        },
      ],
    },

    {
      path: '/schedule-management',
      component: Layout,
      redirect: '/schedule-management/career',
      name: 'Scheduling management',
      children: [
        {
          path: 'career',
          name: '仕業管理',
          component: () => import('@/views/schedule-management/career/index.vue'),
        },
        {
          path: 'general-schedule',
          name: '總班表管理',
          component: () => import('@/views/schedule-management/general-schedule/index.vue'),
        },
        {
          path: 'schedule',
          name: '班表管理',
          component: () => import('@/views/schedule-management/schedule/index.vue'),
        },
        {
          path: 'schedule-query',
          name: '排班資料查詢',
          component: () => import('@/views/schedule-management/schedule-query/index.vue'),
        },
        {
          path: 'working-hours',
          name: '駕駛工時管理',
          component: () => import('@/views/schedule-management/working-hours/index.vue'),
        },
        {
          path: 'distance-adjust',
          name: '里程調整',
          component: () => import('@/views/schedule-management/distance-adjust/index.vue'),
        },
        {
          path: 'schedule-related-reports',
          name: '排班相關報表',
          component: () => import('@/views/schedule-management/schedule-related-reports/index.vue'),
        },
      ],
    },

    {
      path: '/salary-management',
      component: Layout,
      redirect: '/salary-management/basic-salary-parameter',
      name: 'Salary management',
      children: [
        {
          path: 'basic-salary-parameter',
          name: '基本薪資參數管理',
          component: () => import('@/views/salary-management/basic-salary-parameter/index.vue'),
        },
        {
          path: 'payroll',
          name: '薪津表管理',
          component: () => import('@/views/salary-management/payroll/index.vue'),
        },
        {
          path: 'payroll-query',
          name: '薪津表列印',
          component: () => import('@/views/salary-management/payroll-query/index.vue'),
        },
        {
          path: 'salary-statement',
          name: '薪資報表',
          component: () => import('@/views/salary-management/salary-statement/index.vue'),
        },
      ],
    },

    {
      path: '/system-configuration',
      component: Layout,
      redirect: '/system-configuration/personal-password-setting',
      name: 'System configuration',
      children: [
        {
          path: 'personal-password-setting',
          name: '個人密碼設定',
          component: () => import('@/views/system-configuration/personal-password-setting/index.vue'),
        },
        {
          path: 'account-management',
          name: '帳號管理',
          component: () => import('@/views/system-configuration/account-management/index.vue'),
        },
        {
          path: 'transfer-voucher',
          name: '手動轉班表',
          component: () => import('@/views/system-configuration/transfer-voucher/index.vue'),
        },
        {
          path: 'operation-record-query',
          name: '操作紀錄查詢',
          component: () => import('@/views/system-configuration/operation-record-query/index.vue'),
        },
      ],
    },
    { // 404 page must be placed at the end.
      path: '*',
      redirect: '/404',
      display: false,
    },
  ],
});
