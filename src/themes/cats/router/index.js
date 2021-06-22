import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@c/layout/index'
import { delayAwait, getToken } from '@/utils/util'
import store from '../store'
import themeRouter from '@/themeCommon/router'

const routes = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import(/* webpackChunkName: "Quote" */ '../views/home/home.vue'),
                meta: {
                    title: 'route.home',
                }
            },
            {
                path: 'selfSymbol',
                name: 'SelfSymbol',
                component: () => import(/* webpackChunkName: "SelfSymbol" */ '../views/selfSymbol/selfSymbol.vue'),
                meta: {
                    title: 'route.selfSymbol',
                }
            },
            {
                path: 'quote',
                name: 'Quote',
                component: () => import(/* webpackChunkName: "Quote" */ '../views/quote/quote.vue'),
                meta: {
                    title: 'route.quote',
                }
            },
            {
                path: 'mine',
                name: 'Mine',
                component: () => import(/* webpackChunkName: "Mine" */ '../views/mine/mine.vue'),
                meta: {
                    title: 'route.mine',
                }
            },
            {
                path: 'chart',
                name: 'Chart',
                component: () => import(/* webpackChunkName: "chart" */ '../views/chart/chart.vue'),
                meta: {
                    title: 'route.chart'
                }
            },
            {
                path: 'position',
                name: 'Position',
                component: () => import(/* webpackChunkName: "position" */ '../views/position/position.vue'),
                meta: {
                    title: 'route.trade'
                }
            },
            {
                path: 'positionDetail',
                name: 'PositionDetail',
                component: () => import(/* webpackChunkName: "position" */ '../views/position/positionDetail.vue'),
                meta: {
                    title: 'route.positionDetail'
                }
            },
            {
                path: 'pendingDetail',
                name: 'PendingDetail',
                component: () => import(/* webpackChunkName: "position" */ '../views/position/pendingDetail.vue'),
                meta: {
                    title: 'route.pendingDetail'
                }
            },
            {
                path: 'historyDetail',
                name: 'HistoryDetail',
                component: () => import(/* webpackChunkName: "position" */ '../views/position/historyDetail.vue'),
                meta: {
                    title: 'route.historyDetail'
                }
            },
            {
                path: 'history',
                name: 'History',
                component: () => import(/* webpackChunkName: "history" */ '../views/history/history.vue'),
                meta: {
                    title: 'route.historyDetail'
                }
            },
            {
                path: 'onlineService',
                name: 'OnlineService',
                component: () => import(/* webpackChunkName: "onlineService" */ '../views/onlineService/onlineService.vue'),
                meta: {
                    title: 'route.onlineService'
                }
            },
            {
                path: 'accountManager',
                name: 'AccountManager',
                component: () => import(/* webpackChunkName: "accountManager" */ '../views/accountManager/accountManager.vue'),
                meta: {
                    title: 'route.account'
                }
            },
            {
                path: '/addAccount',
                name: 'AddAccount',
                component: () => import(/* webpackChunkName: "addAccount" */ '../views/accountManager/addAccount.vue'),
                meta: {
                    title: 'route.newAccount',
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
            title: 'route.news',
            keepAlive: true,
        }
    },

    {
        path: '/contract',
        name: 'Contract',
        component: () => import(/* webpackChunkName: "contract" */ '../views/contract/contract.vue'),
        meta: {
            title: 'route.contract',
            roles: ['User'],
        }
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/order.vue'),
        meta: {
            title: 'route.order',
            roles: ['User'],
        }
    },
    {
        path: '/order/success',
        name: 'OrderSuccess',
        component: () => import(/* webpackChunkName: "order" */ '../views/order/success.vue'),
        meta: {
            title: 'route.orderSuccess',
            roles: ['User'],
        }
    },
    // {
    //     path: '/closePosition',
    //     name: 'ClosePosition',
    //     component: () => import(/* webpackChunkName: "closePosition" */ '../views/order/closePosition.vue'),
    //     meta: {
    //         title: 'route.orderClose',
    //         roles: ['User'],
    //     }
    // },
    {
        path: '/search',
        name: 'Search',
        component: () => import(/* webpackChunkName: "search" */ '../views/search/search.vue'),
        meta: {
            title: 'route.search'
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
