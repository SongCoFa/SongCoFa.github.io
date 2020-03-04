import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/pages/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import Base from '../components/Base.vue';
import CustomerHome from '../components/frontPages/CustomerHome.vue';
import CustomerProduct from '../components/frontPages/CustomerProduct.vue';
import CustomerOrders from '../components/frontPages/CustomerOrders.vue';
import CustomerDetail from '../components/frontPages/CustomerDetail.vue';
import Products from '../components/pages/Products.vue';
import Coupons from '../components/pages/Coupons.vue';
import Orders from '../components/pages/Orders.vue';
import AdminOrders from '../components/pages/AdminOrders.vue';
import CustomerCheckout from '../components/pages/CustomerCheckout.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode:'hash',
  linkActiveClass:'active',
  routes : [{
      path: '*',
      redirect: '/customer_home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [{
          path: 'products',
          name: 'Products',
          component: Products,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'coupons',
          name: 'Coupons',
          component: Coupons,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: {
            requiresAuth: true
          },
        },
        {
          path: 'admin_orders',
          name: 'AdminOrders',
          component: AdminOrders,
          meta: {
            requiresAuth: true
          },
        },
      ],
    },
    {
      path: '/',
      name: 'Base',
      redirect: '/customer_home',
      component:  Base,
      children: [
        {
          path: 'customer_home',
          name: 'CustomerHome',
          component: CustomerHome,
        },
        {
          path: 'customer_product',
          name: 'CustomerProduct',
          component: CustomerProduct,
        },
        {
          path: 'customer_detail/:id',
          name: 'CustomerDetail',
          component: CustomerDetail,
        },
        {
          path: 'customer_orders',
          name: 'CustomerOrders',
          component: CustomerOrders,
        },
        {
          path: 'customer_checkout/:orderId',
          name: 'CustomerCheckout',
          component: CustomerCheckout,
        },
      ],
    },
  ]
});