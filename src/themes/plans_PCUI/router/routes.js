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
        path: 'bankList',
        component: () => import(/* webpackChunkName: "bankList" */ '../views/user/bankList.vue'),
        meta: {
            title: 'cRoute.bankList',
            roles: ['User']
        }
    },
    {
        path: 'addBank',
        component: () => import(/* webpackChunkName: "addBank" */ '../views/user/addBank.vue'),
        meta: {
            title: 'cRoute.addBank',
            roles: ['User']
        }
    },
    {
        path: 'authentication',
        // name: 'Authentication',
        component: () => import(/* webpackChunkName: "addBank" */ '../views/user/authentication.vue'),
        meta: {
            title: 'cRoute.authentication',
            // roles: ['User']
        }
    },
    {
        path: 'authForm',
        component: () => import(/* webpackChunkName: "addBank" */ '../views/user/authForm.vue'),
        meta: {
            title: 'cRoute.authForm',
            // roles: ['User']
        }
    },
    {
        path: 'kycCommitted',
        // name: 'KycCommitted',
        component: () => import(/* webpackChunkName: "addBank" */ '../views/user/kycCommitted.vue'),
        meta: {
            title: 'cRoute.kycCommitted',
            // roles: ['User']
        }
    },
    {
        path: 'contract',
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
            roles: ['User']
        }
    },
    {
        path: 'depositChoose', // 选择充值方式
        component: () => import(/* webpackChunkName: "deposit" */ '../views/deposit/choose.vue'),
        meta: {
            title: 'cRoute.deposit',
            roles: ['User']
        }
    },
    {
        path: 'depositDirect', // 直充
        component: () => import(/* webpackChunkName: "deposit" */ '../views/deposit/direct.vue'),
        meta: {
            title: 'cRoute.deposit',
            roles: ['User']
        }
    },
    {
        path: 'deposit', // 汇兑
        component: () => import(/* webpackChunkName: "deposit" */ '../views/deposit/deposit.vue'),
        meta: {
            title: 'cRoute.deposit',
            roles: ['User']
        }
    },
    {
        path: 'depositRecord', // 入金记录
        component: () => import(/* webpackChunkName: "deposit" */ '../views/deposit/depositRecord.vue'),
        meta: {
            title: 'cRoute.depositRecord',
            roles: ['User']
        }
    },
    {
        path: 'depositCb', // 入金结果
        component: () => import(/* webpackChunkName: "deposit" */ '../views/deposit/depositCb.vue'),
        meta: {
            title: 'cRoute.despositCb',
            roles: ['User']
        }
    },
    {
        path: 'withdrawAccount', // 选择提现币种
        component: () => import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawAccount.vue'),
        meta: {
            title: 'cRoute.withdrawAccount',
            roles: ['User']
        }
    },
    {
        path: 'withdrawMoney', // 提现
        component: () => import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawMoney.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'withdrawCoin', // 提币
        component: () => import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawCoin.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'withdrawRecord', // 选择提现币种
        component: () => import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawRecord.vue'),
        meta: {
            title: 'cRoute.withdrawRecord',
            roles: ['User']
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
        path: 'walletAdd', // 添加钱包
        component: () => import(/* webpackChunkName: "Bank" */ '../views/wallet/walletAdd.vue'),
        meta: {
            title: 'cRoute.walletAdd',
            roles: ['User']
        }
    },
    {
        path: 'loan', // 借款
        component: () => import(/* webpackChunkName: "loan" */ '../views/loan/loan.vue'),
        meta: {
            title: 'route.loan',
            roles: ['User']
        }
    },
    {
        path: 'returnMoney', // 还款
        component: () => import(/* webpackChunkName: "returnMoney" */ '../views/returnMoney/returnMoney.vue'),
        meta: {
            title: 'route.returnMoney',
            roles: ['User']
        }
    },
    {
        path: 'record', // 资金记录
        component: () => import(/* webpackChunkName: "returnMoney" */ '../views/record/record.vue'),
        meta: {
            title: 'route.records',
            roles: ['User']
        }
    },
    {
        path: 'regKyc', // 注册KYC
        component: () => import(/* webpackChunkName: "RegKyc" */ '../views/register/regKyc.vue'),
        meta: {
            title: 'route.RegKyc',
        }
    }
]

const routes = [
    ...themeRouter,
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "Login" */ '../views/login/login.vue'),
        meta: {
            title: 'route.login',
            roles: [],
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import(/* webpackChunkName: "Register" */ '../views/register/register.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/register/success',
        name: 'RegisterSuccess',
        component: () => import(/* webpackChunkName: "Register" */ '../views/register/registerSuccess.vue'),
        meta: {
            title: 'route.registerSuccess',
            roles: [],
        }
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () => import(/* webpackChunkName: "Forgot" */ '../views/forgot/forgot.vue'),
        meta: {
            title: 'route.forgot',
            roles: [],
        }
    },
    {
        path: '/resetPwd',
        name: 'ResetPwd',
        component: () => import(/* webpackChunkName: "Forgot" */ '../views/forgot/resetPwd.vue'),
        meta: {
            title: 'route.resetPwd',
            // keepAlive: true,
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
        // keepAlive: true,
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import(/* webpackChunkName: "Home" */ '../views/home/home.vue'),
                meta: {
                    title: 'route.home',
                    // keepAlive: true,
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
                    roles: []
                },
                children: h5Children
            },
            {
                path: 'transRecords',
                name: 'TransRecords',
                component: () => import(/* webpackChunkName: "Quote" */ '../views/transRecords/transRecords.vue'),
                meta: {
                    title: 'route.transRecords',
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'fund',
                name: 'Fund',
                component: () => import(/* webpackChunkName: "returnMoney" */ '../views/fund/index.vue'),
                meta: {
                    title: 'route.fund',
                },
                children: h5Children
            },
            {
                path: 'fundManager', // 基金操作专区
                name: 'FundManager',
                component: () => import(/* webpackChunkName: "returnMoney" */ '../views/fundManager/index.vue'),
                meta: {
                    title: 'route.fundManager',
                    roles: ['User']
                },
                children: h5Children
            }
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
