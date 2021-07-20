import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@c/layout/index'
import { delayAwait, getToken } from '@/utils/util'
import store from '../store'
import themeRouter from '@/themeCommon/router'

const routes = [
    ...themeRouter,
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
                    keepAlive: true,
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
                    keepAlive: true,
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
            }
        ]
    },
    {
        path: '/closePositionSuccess',
        name: 'ClosePositionSuccess',
        component: () => import(/* webpackChunkName: "position" */ '../views/position/closePositionSuccess.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/positionDetail',
        name: 'PositionDetail',
        component: () => import(/* webpackChunkName: "position" */ '../views/position/positionDetail.vue'),
        meta: {
            title: 'route.positionDetail'
        }
    },
    {
        path: '/pendingDetail',
        name: 'PendingDetail',
        component: () => import(/* webpackChunkName: "position" */ '../views/position/pendingDetail.vue'),
        meta: {
            title: 'route.pendingDetail'
        }
    },
    {
        path: '/historyDetail',
        name: 'HistoryDetail',
        component: () => import(/* webpackChunkName: "position" */ '../views/position/historyDetail.vue'),
        meta: {
            title: 'route.historyDetail'
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
        path: '/product',
        name: 'Product',
        component: () => import(/* webpackChunkName: "chart" */ '../views/chart/product.vue'),
        meta: {
            title: 'route.chart',
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
    {
        path: '/search',
        name: 'Search',
        component: () => import(/* webpackChunkName: "search" */ '../views/search/search.vue'),
        meta: {
            title: 'route.search'
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "setting" */ '../views/setting/setting.vue'),
        meta: {
            title: 'cRoute.setting',
            footerMenu: false
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

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const token = getToken()
    const keepAlive = to.meta?.keepAlive ?? false
    const query = to.query
    const nocache = query.hasOwnProperty('nocache') && !query.nocache ? true : query.nocache
    if (keepAlive && nocache) {
        store.commit('del_cacheViews', to.name)
    }
    const roles = to.meta?.roles ?? []
    const customerInfo = store.state._user.customerInfo
    const unKYCPages = ['Authentication', 'Home', 'RegisterSuccess', 'RegKyc', 'AddBank', 'Personal', 'AuthForm', 'BankList', 'Setting', 'KycCommitted']
    if (customerInfo && customerInfo?.kycAuditStatus !== 2 && unKYCPages.indexOf(to.name) === -1) {
        // 未审核通过的用户直接跳转到KYC页面
        next({ name: 'Authentication' })
    } else if (token && roles.length && roles.includes('Guest')) {
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
router.afterEach((to, from) => {
    const keepAlive = to.meta?.keepAlive ?? false
    if (keepAlive) {
        store.commit('add_cacheViews', to.name)
    }
})
export default router
