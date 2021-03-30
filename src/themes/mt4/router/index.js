import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@m/layout/index'
import { getLoginParams, delayAwait } from '@/utils/util'
import store from '../store'

const routes = [
    {
        path: '/',
        redirect: '/quote',
        component: Layout,
        children: [
            {
                path: 'quote',
                name: 'Quote',
                component: () => import(/* webpackChunkName: "quote" */ '../views/quote/quote.vue'),
                meta: {
                    title: '行情',
                }
            },
            {
                path: 'chart',
                name: 'Chart',
                component: () => import(/* webpackChunkName: "chart" */ '../views/chart/chart.vue'),
                meta: {
                    title: '图表页面，对接接口后处理'
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
                path: 'news',
                name: 'News',
                component: () => import(/* webpackChunkName: "news" */ '../views/news/news.vue'),
                meta: {
                    title: '新闻'
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
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/login/login.vue'),
        meta: {
            title: '登录到一个账户',
            roles: ['Guest'], // Guest 仅游客访问 User 仅登录用户访问
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "register" */ '../views/register/register.vue'),
        meta: {
            title: '注册开户',
            roles: ['Guest'],
        }
    },
    {
        path: '/register/success',
        name: 'RegisterSuccess',
        component: () => import(/* webpackChunkName: "register" */ '../views/register/registerSuccess.vue'),
        meta: {
            title: '注册开户'
        }
    },
    {
        path: '/modifyPwd',
        name: 'ModifyPwd',
        component: () => import(/* webpackChunkName: "modifyPwd" */ '../views/modifyPwd/modifyPwd.vue'),
        meta: {
            title: '更改密码'
        }
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import(/* webpackChunkName: "forgot" */ '../views/forgot/forgot.vue'),
        meta: {
            title: '找回密码'
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
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const loginParams = getLoginParams()
    const roles = to.meta?.roles ?? []
    if (loginParams && roles.length && roles.includes('Guest')) {
        // 仅游客访问，登录用户访问时跳转到行情页面
        next({ name: 'Quote' })
    } else if (!loginParams && roles.length && roles.includes('User')) {
        // 仅登录用户访问，游客访问时跳转到登录页面
        next({ name: 'Login', query: { back: encodeURIComponent(to.fullPath) } })
    } else if (loginParams && store.state._user.loginLoading) {
        delayAwait(() => {
            return !store.state._user.loginLoading
        }).then(next)
    } else {
        next()
    }
})

export default router
