import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@m/layout/index'

const routes = [
    {
        path: '/',
        redirect: '/quote',
        component: Layout,
        children: [
            {
                path: 'quote',
                name: 'Quote',
                component: () => import('../views/home/home.vue'),
                meta: {
                    title: '行情'
                }
            },
            {
                path: 'chart',
                name: 'Chart',
                component: () => import('../views/chart/chart.vue'),
                meta: {
                    title: '图表'
                }
            },
            {
                path: 'trade',
                name: 'Trade',
                component: () => import('../views/trade/trade.vue'),
                meta: {
                    title: '交易'
                }
            },
            {
                path: 'history',
                name: 'History',
                component: () => import('../views/history/history.vue'),
                meta: {
                    title: '历史'
                }
            },
            {
                path: 'news',
                name: 'News',
                component: () => import('../views/news/news.vue'),
                meta: {
                    title: '新闻'
                }
            },
            {
                path: 'onlineService',
                name: 'OnlineService',
                component: () => import('../views/onlineService/onlineService.vue'),
                meta: {
                    title: '在线客服'
                }
            },
        ]
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
