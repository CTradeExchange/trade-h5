// import { createRouter, createWebHistory } from 'vue-router'
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
        component: () => import(/* webpackChunkName: "addBank" */ '../user/depositRecord.vue'),
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
            roles: ['User'],
        }
    },
    {
        path: '/fund',
        name: 'Fund',
        component: () => import(/* webpackChunkName: "fundDetail" */ '../user/fund.vue'),
        meta: {
            title: '账户资金',
            footerMenu: false,
        }
    },
    {
        path: '/personal',
        name: 'Personal',
        component: () => import(/* webpackChunkName: "personal" */ '../user/personal.vue'),
        meta: {
            title: '个人信息',
            footerMenu: false
        }
    },
    {
        path: '/authentication',
        name: 'Authentication',
        component: () => import(/* webpackChunkName: "authentication" */ '../user/authentication.vue'),
        meta: {
            title: '身份验证',
            footerMenu: false
        }
    },
    {
        path: '/authL1',
        name: 'AuthL1',
        component: () => import(/* webpackChunkName: "authentication" */ '../user/authL1.vue'),
        meta: {
            title: '身份验证(LV1认证)',
            footerMenu: false
        }
    },
    {
        path: '/authL1Input',
        name: 'AuthL1Input',
        component: () => import(/* webpackChunkName: "authL1Input" */ '../user/authL1Input.vue'),
        meta: {
            title: '身份验证(LV1认证)',
            footerMenu: false
        }
    },
    {
        path: '/authL2',
        name: 'AuthL2',
        component: () => import(/* webpackChunkName: "authL2" */ '../user/authL2.vue'),
        meta: {
            title: '身份验证(LV2认证)',
            footerMenu: false
        }
    },
    {
        path: '/authL3',
        name: 'AuthL3',
        component: () => import(/* webpackChunkName: "authL3" */ '../user/authL3.vue'),
        meta: {
            title: '身份验证(LV3认证)',
            footerMenu: false
        }
    },

]

export default routes
