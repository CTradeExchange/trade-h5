import themeRouter from '@/themeCommon/router'
import Layout from '../layout/index'
// import popupLayout from '../layout/popupLayout'

const h5Children = [
    {
        path: 'bindEmail', // 绑定邮箱
        component: () => import(/* webpackChunkName: "Setting" */ '../views/setting/bindEmail.vue'),
        meta: {
            title: 'cRoute.bindEmail',
            footerMenu: false,
        }
    },
    {
        path: 'bindMobile', // 绑定手机
        component: () => import(/* webpackChunkName: "Setting" */ '../views/setting/bindMobile.vue'),
        meta: {
            title: 'cRoute.bindMobile',
            footerMenu: false,
        }
    },
    {
        path: 'setLoginPwd', // 设置密码
        component: () => import(/* webpackChunkName: "setLoginPwd" */ '../views/setting/setLoginPwd.vue'),
        meta: {
            title: 'cRoute.setLoginPwd',
            roles: ['User']
        }
    },
    {
        path: 'contract', // 合约属性
        component: () => import(/* webpackChunkName: "contract" */ '../views/contract/contract.vue'),
        meta: {
            title: '',
            roles: ['User']
        }
    },
    {
        path: 'transfer', // 划转
        component: () => import(/* webpackChunkName: "transfer" */ '../views/transfer/transfer.vue'),
        meta: {
            title: 'route.transfer',
            roles: ['User']
        }
    },
    {
        path: 'chooseAccount', // 选择币种
        component: () => import(/* webpackChunkName: "chooseAccount" */ '../views/chooseAccount/chooseAccount.vue'),
        meta: {
            title: 'cRoute.chooseCurrency',
        }
    },
    {
        path: 'deposit', // 入金
        component: () => import(/* webpackChunkName: "deposit" */ '../views/deposit/deposit.vue'),
        meta: {
            title: 'cRoute.deposit',
        }
    },
    {
        path: 'withdrawAccount', // 提现
        component: () => import(/* webpackChunkName: "withdrawAccount" */ '../views/withdrawAccount/withdrawAccount.vue'),
        meta: {
            title: 'cRoute.withdrawAccount',
        }
    },
    {
        path: 'authentication', // 身份认证
        component: () => import(/* webpackChunkName: "authentication" */ '../views/authentication/authentication.vue'),
        meta: {
            title: 'cRoute.authentication',
        }
    },
    {
        path: 'addBank', // 添加银行卡
        component: () => import(/* webpackChunkName: "Bank" */ '../views/bank/addBank.vue'),
        meta: {
            title: 'cRoute.addBank',
        }
    },
    {
        path: 'bankList', // 银行卡列表
        component: () => import(/* webpackChunkName: "Bank" */ '../views/bank/bankList.vue'),
        meta: {
            title: 'cRoute.bankList',
        }
    },
    {
        path: 'fundRecord', // 资金流水
        component: () => import(/* webpackChunkName: "fundRecord" */ '../views/fundRecord/fundRecord.vue'),
        meta: {
            title: 'cRoute.bankList',
        }
    },
    {
        path: 'loan', // 借款
        component: () => import(/* webpackChunkName: "loan" */ '../views/loan/loan.vue'),
        meta: {
            title: 'route.loan',
        }
    },
    {
        path: 'returnMoney', // 还款
        component: () => import(/* webpackChunkName: "returnMoney" */ '../views/returnMoney/returnMoney.vue'),
        meta: {
            title: 'route.returnMoney',
        }
    },
]

const routes = [
    ...themeRouter,
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "Login" */ '../views/login/login.vue'),
        meta: {
            title: 'route.login',
            keepAlive: true,
            roles: [],
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "Register" */ '../views/register/register.vue'),
        meta: {
            title: 'route.register',
            keepAlive: true,
            roles: [],
        }
    },
    {
        path: '/register/success',
        name: 'RegisterSuccess',
        component: () => import(/* webpackChunkName: "Register" */ '../views/register/registerSuccess.vue'),
        meta: {
            title: 'route.registerSuccess',
            keepAlive: true,
            roles: [],
        }
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import(/* webpackChunkName: "Forgot" */ '../views/forgot/forgot.vue'),
        meta: {
            title: 'route.forgot',
            keepAlive: true,
            roles: [],
        }
    },
    {
        path: '/resetPwd',
        name: 'ResetPwd',
        component: () => import(/* webpackChunkName: "Forgot" */ '../views/forgot/resetPwd.vue'),
        meta: {
            title: 'route.resetPwd',
            keepAlive: true,
            roles: [],
        }
    },
    {
        path: '/resetSuccess',
        name: 'ResetSuccess',
        component: () => import(/* webpackChunkName: "resetSuccess" */ '../views/forgot/resetSuccess.vue'),
        meta: {
            title: 'cRoute.resetPwdSuccess'
        }
    },
    {
        path: '/resetFail',
        name: 'ResetFail',
        component: () => import(/* webpackChunkName: "resetFail" */ '../views/forgot/resetFail.vue'),
        meta: {
            title: 'cRoute.resetPwdFaid'
        }
    },
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
                component: () => import(/* webpackChunkName: "Home" */ '../views/home/home.vue'),
                meta: {
                    title: 'route.home',
                    keepAlive: true,
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'quote',
                name: 'Quote',
                component: () => import(/* webpackChunkName: "Quote" */ '../views/quote/quote.vue'),
                meta: {
                    title: 'route.quote',
                    keepAlive: true,
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'order',
                name: 'Order',
                component: () => import(/* webpackChunkName: "Order" */ '../views/order/order.vue'),
                meta: {
                    title: 'route.order',
                    keepAlive: true,
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'assets',
                name: 'Assets',
                component: () => import(/* webpackChunkName: "Assets" */ '../views/assets/assets.vue'),
                meta: {
                    title: 'route.assets',
                    keepAlive: true,
                    roles: [],
                }
            },
        ]
    },
    // {
    //     path: '/:params/setting',
    //     name: 'Setting',
    //     component: {
    //         centerView: () => import(/* webpackChunkName: "Forgot" */ '../views/setting/setting.vue')
    //     },
    //     meta: {
    //         title: 'route.setting',
    //         keepAlive: true,
    //         roles: [],
    //     }
    // },
]

export default routes
