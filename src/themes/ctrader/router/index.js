import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@ct/layout/index'

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
                meta: {
                    title: '关注列表',
                    full: false
                }
            },
            {
                path: '/order',
                name: 'Order',
                component: () => import(/* webpackChunkName: "order" */ '../views/order/order.vue'),
                meta: {
                    title: '创建订单',
                    full: true
                }
            },
        ]
    },
    {
        path: '/productDetail',
        component: Layout,
        children: [
            {
                path: ':id',
                name: 'ProductDetail',
                component: () => import(/* webpackChunkName: "productDetail" */ '../views/productDetail/productDetail.vue'),
                meta: {
                    title: '产品详情',
                    full: true
                }
            },
        ]
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import(/* webpackChunkName: "search" */ '../views/search.vue'),
        meta: {
            title: '搜索'
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "setting" */ '../views/setting.vue'),
        meta: {
            title: '设置'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/register/register.vue'),
        meta: {
            title: '注册开户'
        }
    },
    {
        path: '/register/success',
        name: 'RegisterSuccess',
        component: () => import('../views/register/registerSuccess.vue'),
        meta: {
            title: '注册开户'
        }
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import('../views/forgot/forgot.vue'),
        meta: {
            title: '找回密码'
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
