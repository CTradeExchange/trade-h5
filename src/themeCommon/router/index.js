import { createRouter, createWebHistory, beforeEnter } from 'vue-router'
import store from '../../store'
const routes = [
    {
        path: '/withdraw',
        name: 'Withdraw',
        component: () => import(/* webpackChunkName: "withdraw" */ '../user/withdraw.vue'),
        meta: {
            title: '取款',
            footerMenu: false,
            roles: ['User'],
        }
    },
    {
        path: '/withdrawRecord',
        name: 'WithdrawRecord',
        component: () => import(/* webpackChunkName: "withdrawRecord" */ '../user/withdrawRecord.vue'),
        meta: {
            title: '取款记录',
            footerMenu: false,
            roles: ['User'],
        }
    },
    {
        path: '/addBank',
        name: 'AddBank',
        component: () => import(/* webpackChunkName: "addBank" */ '../user/addBank.vue'),
        meta: {
            title: '添加银行卡',
            footerMenu: false,
            roles: ['User'],
        }
    },
    {
        path: '/desposit',
        name: 'Desposit',
        component: () => import(/* webpackChunkName: "addBank" */ '../user/desposit.vue'),
        meta: {
            title: '存款',
            footerMenu: false,
            roles: ['User'],
        }
    },
    {
        path: '/despositRecord',
        name: 'DespositRecord',
        component: () => import(/* webpackChunkName: "addBank" */ '../user/despositRecord.vue'),
        meta: {
            title: '存款记录',
            footerMenu: false,
            roles: ['User'],
        }
    },
    {
        path: '/msg',
        name: 'Msg',
        component: () => import(/* webpackChunkName: "msg" */ '../user/msg.vue'),
        meta: {
            title: '消息中心',
            footerMenu: false,
            roles: ['User'],
        }
    },
    {
        path: '/fundDetail',
        name: 'FundDetail',
        component: () => import(/* webpackChunkName: "fundDetail" */ '../user/fundDetail.vue'),
        meta: {
            title: '资金明细',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/fund',
        name: 'Fund',
        component: () => import(/* webpackChunkName: "fundDetail" */ '../user/fund.vue'),
        meta: {
            title: '账户资金',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/personal',
        name: 'Personal',
        component: () => import(/* webpackChunkName: "personal" */ '../user/personal.vue'),
        meta: {
            title: '个人信息',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/authentication',
        name: 'Authentication',
        component: () => import(/* webpackChunkName: "authentication" */ '../user/authentication.vue'),
        meta: {
            title: '身份验证',
            footerMenu: false,
            roles: ['User']
        },
        beforeEnter: (to, from, next) => {
            next()
        }
    },
    {
        path: '/authForm',
        name: 'AuthForm',
        component: () => import(/* webpackChunkName: "authentication" */ '../user/authForm.vue'),
        meta: {
            title: '身份验证',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/bankList',
        name: 'BankList',
        component: () => import(/* webpackChunkName: "bankList" */ '../user/bankList.vue'),
        meta: {
            title: '银行卡列表',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "bankList" */ '../user/setting.vue'),
        meta: {
            title: '设置',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/setLoginPwd',
        name: 'SetLoginPwd',
        component: () => import(/* webpackChunkName: "setLoginPwd" */ '../user/setLoginPwd.vue'),
        meta: {
            title: '设置登录密码',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/page',
        name: 'Page',
        component: () => import(/* webpackChunkName: "page" */ '../user/page.vue'),
        meta: {
            title: '界面',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/bindMobile',
        name: 'BindMobile',
        component: () => import(/* webpackChunkName: "page" */ '../user/bindMobile.vue'),
        meta: {
            title: '绑定手机',
            footerMenu: false,
        }
    },
    {
        path: '/bindEmail',
        name: 'BindEmail',
        component: () => import(/* webpackChunkName: "page" */ '../user/bindEmail.vue'),
        meta: {
            title: '绑定邮箱',
            footerMenu: false,
        }
    },
    {
        path: '/kycCommitted',
        name: 'KycCommitted',
        component: () => import(/* webpackChunkName: "page" */ '../user/kycCommitted.vue'),
        meta: {
            title: '提交KYC',
            footerMenu: false,
        }
    },
    {
        path: '/despositCb',
        name: 'DespositCb',
        component: () => import(/* webpackChunkName: "page" */ '../user/despositCb.vue'),
        meta: {
            title: '充值结果',
            footerMenu: false,
        }
    },
    {
        path: '/changeBindEmail',
        name: 'ChangeEmail',
        component: () => import(/* webpackChunkName: "page" */ '../user/changeBindEmail.vue'),
        meta: {
            title: '更换邮箱',
            footerMenu: false,
        }
    },
    {
        path: '/changeBindMobile',
        name: 'ChangeMobile',
        component: () => import(/* webpackChunkName: "page" */ '../user/changeBindMobile.vue'),
        meta: {
            title: '更换手机',
            footerMenu: false,
        }
    },

]

export default routes
