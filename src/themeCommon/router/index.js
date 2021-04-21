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
        },
        beforeEnter: [addParams],
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
        }
    },
    {
        path: '/authConditon',
        name: 'AuthConditon',
        component: () => import(/* webpackChunkName: "authentication" */ '../user/authConditon.vue'),
        meta: {
            title: '身份验证',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/authL1Input',
        name: 'AuthL1Input',
        component: () => import(/* webpackChunkName: "authL1Input" */ '../user/authL1Input.vue'),
        meta: {
            title: '身份验证(LV1认证)',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/authL2',
        name: 'AuthL2',
        component: () => import(/* webpackChunkName: "authL2" */ '../user/authL2.vue'),
        meta: {
            title: '身份验证(LV2认证)',
            footerMenu: false,
            roles: ['User']
        }
    },
    {
        path: '/authL3',
        name: 'AuthL3',
        component: () => import(/* webpackChunkName: "authL3" */ '../user/authL3.vue'),
        meta: {
            title: '身份验证(LV3认证)',
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

]

function addParams (to, from) {
    // if (Object.keys(to.query).length) { return { path: to.path, query: {}, hash: to.hash } }
    console.log('nnn', to)
    if (from.fullPath === '/') {
        to.params = { aa: 3 }
    }

    // return { path: to.path, query: {}, hash: to.hash }
}

export default routes
