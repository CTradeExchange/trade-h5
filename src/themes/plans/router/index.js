import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index'
import { delayAwait, getToken } from '@/utils/util'
import store from '../store'
import themeRouter from '@/themeCommon/router'

const routes = [
    ...themeRouter,
    {
        path: '/',
        redirect: '/home',
        name: 'Layout',
        component: Layout,
        keepAlive: true,
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
                path: 'assets',
                name: 'Assets',
                component: () => import(/* webpackChunkName: "Assets" */ '../views/assets/assets.vue'),
                meta: {
                    title: 'route.assets',
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
                path: 'order',
                name: 'Order',
                component: () => import(/* webpackChunkName: "order" */ '../views/order/order.vue'),
                meta: {
                    title: 'route.order',
                    roles: ['User'],
                }
            },
        ]
    },
    {
        path: '/assetsInfo',
        name: 'AssetsInfo',
        component: () => import(/* webpackChunkName: "AssetsInfo" */ '../views/assets/assetsInfo.vue'),
        meta: {
            title: 'route.assets',
        }
    },
    {
        path: '/returnMoney',
        name: 'ReturnMoney',
        component: () => import(/* webpackChunkName: "ReturnMoney" */ '../views/returnMoney/returnMoney.vue'),
        meta: {
            title: 'route.returnMoney',
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
    {
        path: '/trustDetail',
        name: 'TrustDetail',
        component: () => import(/* webpackChunkName: "otherpage" */ '../views/orderList/trustDetail.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/list',
        name: 'List',
        component: () => import(/* webpackChunkName: "otherpage" */ '../views/orderList/list.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/withdrawCoin',
        name: 'WithdrawCoin',
        component: () => import(/* webpackChunkName: "otherpage" */ '../views/withdrawCoin/withdrawCoin.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/positionDetail',
        name: 'PositionDetail',
        component: () => import(/* webpackChunkName: "otherpage" */ '../views/position/positionDetail.vue'),
        meta: {
            title: 'route.positionDetail'
        }
    },
    {
        path: '/loan',
        name: 'Loan',
        component: () => import(/* webpackChunkName: "otherpage" */ '../views/loan/loan.vue'),
        meta: {
            title: 'route.loan'
        }
    },
    {
        path: '/record',
        name: 'Record',
        component: () => import(/* webpackChunkName: "record" */ '../views/record/record.vue'),
        meta: {
            title: ''
        }
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'Mine' } },
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
