/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import lazy from './lazy'

// import Hello from '@/components/Hello';
// import SignIn from '@/components/SignIn';
// import SignUp from '@/components/SignUp';
// import Product from '@/components/Product';

// import Thanks from '@/components/shop/cart/Thanks';
// import Checkout from '@/components/shop/cart/Checkout';
// import Cart from '@/components/shop/cart/Cart';

// import Email from '@/components/contact/Email';
// import Phone from '@/components/contact/Phone';
// import Gmap from '@/components/contact/Gmap';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: lazy('/Hello'),
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: lazy('/SignIn'),
    },
    {
      path: '/signUp',
      name: 'SignUp',
      component: lazy('/SignUp'),
    },
    {
      path: '/orders',
      name: 'Orders',
      component: lazy('/orders/orders')
    },
    {
      path: '/user',
      name: 'User',
      component: lazy('/user/User')
    },
    {
      path: '/editUser',
      name: 'editUser',
      component: lazy('/user/editUser')
    },
    {
      path: '/product',
      name: 'Product',
      component: lazy('/Product'),
    },
    {
      path: '/products',
      name: 'Shop',
      component: lazy('/shop/Shop'),
    },
    {
      path: '/search-pro',
      name: 'Search',
      component: lazy('/shop/search'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: lazy('/shop/cart/Cart'),
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: lazy('/shop/cart/Checkout'),
    },
    {
      path: '/thanks',
      name: 'Thanks',
      component: lazy('/shop/cart/Thanks'),
    },
    {
      path: '/contact',
      component: lazy('/contact/Index'),
      children: [
        {
          path: '',
          component: lazy('/contact/Email'),
        },
        {
          path: 'phone',
          component: lazy('/contact/Phone'),
        },
        {
          path: 'gmap',
          component: lazy('/contact/Gmap'),
        },
      ],
    },
    {
      path: '/advantage',
      component: lazy('/advantage/index'),
      children: [
        {
          path: 'guide',
          component: lazy('/advantage/guide'),
          meta: { name: 'Hướng dẫn mua' }
        },
        {
          path: '/shared/briefInfo',
          component: lazy('/shared/briefInfo'),
          meta: { name: '简介' }
        },{
          path: 'product',
          component: lazy('/advantage/product'),
          meta: { name: 'Chính sách bảo hành' }
        },
        {
          path: 'delivery',
          component: lazy('/advantage/delivery'),
          meta: { name: 'Phương thức giao hàng' }
        },
        {
          path: 'replace',
          component: lazy('/advantage/replace'),
          meta: { name: 'Đổi hàng trong 15 ngày' }
        },
        {
          path: 'service',
          component: lazy('/advantage/service'),
          meta: { name: 'Cá nhânCá nhân' }
        },
        {
          path: 'news',
          component: lazy('/advantage/news'),
          meta: { name: 'news' }
        },
        {
          path: 'newsDetail',
          component: lazy('/advantage/newsDetail'),
          meta: { name: 'newsDetail' }
        },
        {
          path: 'FAQ',
          component: lazy('/advantage/FAQ'),
          meta: { name: 'FAQ' }
        }
      ]
    }

  ],
});
