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
                    title: '图表页面，对接接口后处理'
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
            {
                path: 'accountManager',
                name: 'AccountManager',
                component: () => import('../views/accountManager/accountManager.vue'),
                meta: {
                    title: '账户'
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
        component: () => import('../views/login.vue'),
        meta: {
            title: '登录到一个账户'
        }
    },
    {
        path: '/modifyPwd',
        name: 'ModifyPwd',
        component: () => import('../views/modifyPwd/modifyPwd.vue'),
        meta: {
            title: '更改密码'
        }
    },
    {
        path: '/addAccount',
        name: 'AddAccount',
        component: () => import('../views/accountManager/addAccount.vue'),
        meta: {
            title: '新账户'
        }
    },
    {
        path: '/contract',
        name: 'Contract',
        component: () => import('../views/contract/contract.vue'),
        meta: {
            title: '合约属性'
        }
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/order.vue'),
        meta: {
            title: '下单'
        }
    },
    {
        path: '/order/pending',
        name: 'OrderPending',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/pending.vue'),
        meta: {
            title: '新订单'
        }
    },
    {
        path: '/order/success',
        name: 'OrderSuccess',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/success.vue'),
        meta: {
            title: '成功'
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
