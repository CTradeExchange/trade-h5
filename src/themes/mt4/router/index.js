import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@m/layout/index'
import { delayAwait, getToken } from '@/utils/util'
import store from '../store'
import themeRouter from '@/themeCommon/router'

const routes = [
    {
        path: '/',
        redirect: '/quote',
        component: Layout,
        children: [
            {
                path: 'quote',
                name: 'Quote',
                component: () => import(/* webpackChunkName: "Quote" */ '../views/quote/quote.vue'),
                meta: {
                    title: '行情',
                }
            },
            {
                path: 'chart',
                name: 'Chart',
                component: () => import(/* webpackChunkName: "chart" */ '../views/chart/chart.vue'),
                meta: {
                    title: '图表'
                }
            },
            {
                path: 'position',
                name: 'Position',
                component: () => import(/* webpackChunkName: "position" */ '../views/position/position.vue'),
                meta: {
                    title: '交易'
                }
            },
            {
                path: 'history',
                name: 'History',
                component: () => import(/* webpackChunkName: "history" */ '../views/history/history.vue'),
                meta: {
                    title: '历史'
                }
            },
            {
                path: 'onlineService',
                name: 'OnlineService',
                component: () => import(/* webpackChunkName: "onlineService" */ '../views/onlineService/onlineService.vue'),
                meta: {
                    title: '在线客服'
                }
            },
            {
                path: 'accountManager',
                name: 'AccountManager',
                component: () => import(/* webpackChunkName: "accountManager" */ '../views/accountManager/accountManager.vue'),
                meta: {
                    title: '账户'
                }
            },
            {
                path: '/addAccount',
                name: 'AddAccount',
                component: () => import(/* webpackChunkName: "addAccount" */ '../views/accountManager/addAccount.vue'),
                meta: {
                    title: '新账户',
                    footerMenu: false
                }
            }
        ]
    },
    {
        path: '/news',
        name: 'News',
        component: () => import(/* webpackChunkName: "news" */ '../views/news/news.vue'),
        meta: {
            title: '新闻',
            keepAlive: true,
        }
    },

    {
        path: '/contract',
        name: 'Contract',
        component: () => import(/* webpackChunkName: "contract" */ '../views/contract/contract.vue'),
        meta: {
            title: '合约属性'
        }
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/order.vue'),
        meta: {
            title: '下单',
            roles: ['User'],
        }
    },
    {
        path: '/order/success',
        name: 'OrderSuccess',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/success.vue'),
        meta: {
            title: '成功',
            roles: ['User'],
        }
    },
    {
        path: '/closePosition',
        name: 'ClosePosition',
        component: () => import(/* webpackChunkName: "closePosition" */ '../views/order/closePosition.vue'),
        meta: {
            title: '平仓',
            roles: ['User'],
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import(/* webpackChunkName: "search" */ '../views/search/search.vue'),
        meta: {
            title: '添加交易品种'
        }
    },
    {
        path: '/market',
        name: 'Market',
        component: () => import(/* webpackChunkName: "search" */ '../views/search/market.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/optional',
        name: 'Optional',
        component: () => import(/* webpackChunkName: "search" */ '../views/search/optional.vue'),
        meta: {
            title: ''
        }
    },

    {
        path: '/otherpage/:type',
        name: 'Otherpage',
        component: () => import(/* webpackChunkName: "otherpage" */ '../views/otherpage/otherpage.vue'),
        meta: {
            title: ''
        }
    },
    ...themeRouter
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const token = getToken()
    const roles = to.meta?.roles ?? []
    if (token && roles.length && roles.includes('Guest')) {
        // 仅游客访问，登录用户访问时跳转到行情页面
        next({ name: 'Quote' })
    } else if (!token && roles.length && roles.includes('User')) {
        // 仅登录用户访问，游客访问时跳转到登录页面
        next({ name: 'Login', query: { back: encodeURIComponent(to.fullPath) } })
    } else if (token && store.state._user.loginLoading) {
        delayAwait(() => {
            return !store.state._user.loginLoading
        }).then(next)
    } else {
        next()
    }
})

export default router
