import { createRouter, createWebHistory } from 'vue-router'
import { delayAwait, getToken, getCookie, setCookie, langList } from '@/utils/util'
import { DEFAULT_LANG } from '@/utils/constant'
import themeRouter from '@/themeCommon/router'
import Layout from '../layout/index'
import store from '../store'

export const routes = [
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
                component: () => import(/* webpackChunkName: "Home" */ '../views/newHome/newHome.vue'),
                meta: {
                    title: 'route.home',
                    keepAlive: true,
                }
            },
            // {
            //     path: 'home',
            //     name: 'Home',
            //     component: () => import(/* webpackChunkName: "Quote" */ '../views/home/home.vue'),
            //     meta: {
            //         title: 'route.home',
            //         keepAlive: true,
            //     }
            // },
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
                path: 'about',
                name: 'Aboutnew',
                component: () => import(/* webpackChunkName: "SelfSymbol" */ '../views/selfSymbol/selfSymbol.vue'),
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
                    roles: ['User'],
                }
            },
            {
                path: 'order',
                name: 'Order',
                component: () => import(/* webpackChunkName: "order" */ '../views/order/order.vue'),
                meta: {
                    title: 'route.order',
                }
            },
            {
                path: 'productSearch',
                name: 'ProductSearch',
                component: () => import(/* webpackChunkName: "ProductSearch" */ '../views/productSearch/productSearch.vue'),
                meta: {
                    title: 'route.productSearch',
                }
            },
            {
                path: 'download',
                name: 'Download',
                component: () => import(/* webpackChunkName: "fundProduct" */ '../views/download/download.vue'),
                meta: {
                    title: 'route.download',
                }
            },
            {
                path: 'changList',
                name: 'ChangList',
                component: () => import(/* webpackChunkName: "fundProduct" */ '../views/changeList/changeList.vue'),
                meta: {
                    title: 'route.changList',
                }
            },

            // {
            //     path: 'personalInformation',
            //     name: 'PersonalInformation',

            //     component: () => import(/* webpackChunkName: "Home" */ '../views/personalInformation/personalInformation.vue'),
            //     meta: {
            //         title: 'route.home',
            //         roles: ['User'],
            //         keepAlive: true
            //     },
            //     children: [

            //     ]
            // },
            // {
            //     path: 'area',
            //     name: 'Area',
            //     component: () => import(/* webpackChunkName: "Home" */ '../views/area/area.vue'),
            //     meta: {
            //         title: 'route.home',
            //     }
            // }
            // {
            //     path: 'infoDetail',
            //     name: 'InfoDetail',
            //     component: () => import(/* webpackChunkName: "Home" */ '../views/infoDetail/infoDetail.vue'),
            //     meta: {
            //         title: 'route.home',
            //     }
            // },
            // {
            //     path: 'economicCalendar',
            //     name: 'EconomicCalendar',
            //     component: () => import(/* webpackChunkName: "Home" */ '../views/economicCalendar/economicCalendar.vue'),
            //     meta: {
            //         title: 'route.home',
            //     }
            // },
            // {
            //     path: 'competition',
            //     name: 'Competition',
            //     component: () => import(/* webpackChunkName: "Home" */ '../views/competition/competition.vue'),
            //     meta: {
            //         title: 'route.home',
            //     }
            // },
            // {
            //     path: 'assetsInfo',
            //     name: 'AssetsInfo',
            //     component: () => import(/* webpackChunkName: "AssetsInfo" */ '../views/assets/assetsInfo.vue'),
            //     meta: {
            //         title: 'route.assets',
            //     }
            // },
            // {
            //     path: 'returnMoney',
            //     name: 'ReturnMoney',
            //     component: () => import(/* webpackChunkName: "ReturnMoney" */ '../views/returnMoney/returnMoney.vue'),
            //     meta: {
            //         title: 'route.returnMoney',
            //     }
            // },
            // {
            //     path: 'contract',
            //     name: 'Contract',
            //     component: () => import(/* webpackChunkName: "contract" */ '../views/contract/contract.vue'),
            //     meta: {
            //         title: 'route.contract',
            //         roles: ['User'],
            //     }
            // },
            // {
            //     path: 'product',
            //     name: 'Product',
            //     component: () => import(/* webpackChunkName: "chart" */ '../views/chart/product.vue'),
            //     meta: {
            //         title: 'route.chart',
            //     }
            // },
            // {
            //     path: 'deposit',
            //     name: 'Deposit',
            //     component: () => import(/* webpackChunkName: "chart" */ '../views/deposit/deposit.vue'),
            //     meta: {
            //         title: 'route.deposit',
            //     }
            // },
            // {
            //     path: 'payRecord',
            //     name: 'PayRecord',
            //     component: () => import(/* webpackChunkName: "chart" */ '../views/payRecord/payRecord.vue'),
            //     meta: {
            //         title: 'route.payRecord',
            //     }
            // },
            // {
            //     path: 'product/chart',
            //     name: 'ProductChart',
            //     component: () => import(/* webpackChunkName: "chart" */ '../views/chart/productChart.vue'),
            //     meta: {
            //         title: 'route.productChart',
            //     }
            // },
            // {
            //     path: 'order/success',
            //     name: 'OrderSuccess',
            //     component: () => import(/* webpackChunkName: "order" */ '../views/order/success.vue'),
            //     meta: {
            //         title: 'route.orderSuccess',
            //         roles: ['User'],
            //     }
            // },
            // // {
            // //     path: 'closePosition',
            // //     name: 'ClosePosition',
            // //     component: () => import(/* webpackChunkName: "closePosition" */ '../views/order/closePosition.vue'),
            // //     meta: {
            // //         title: 'route.orderClose',
            // //         roles: ['User'],
            // //     }
            // // },
            // {
            //     path: 'search',
            //     name: 'Search',
            //     component: () => import(/* webpackChunkName: "search" */ '../views/search/search.vue'),
            //     meta: {
            //         title: 'route.search'
            //     }
            // },
            // {
            //     path: 'setting',
            //     name: 'Setting',
            //     component: () => import(/* webpackChunkName: "setting" */ '../views/setting/setting.vue'),
            //     meta: {
            //         title: 'cRoute.setting',
            //         footerMenu: false
            //     }
            // },
            // {
            //     path: 'otherpage/:type',
            //     name: 'Otherpage',
            //     component: () => import(/* webpackChunkName: "otherpage" */ '../views/otherpage/otherpage.vue'),
            //     meta: {
            //         title: '',
            //         roles: ['User'],
            //     },
            // },
            // {
            //     path: 'otherpage/:type',
            //     name: 'Nest',
            //     component: () => import(/* webpackChunkName: "otherpage" */ '../views/otherpage/otherpage.vue'),
            //     meta: {
            //         title: ''
            //     }
            // },
            // {
            //     path: 'trustDetail',
            //     name: 'TrustDetail',
            //     component: () => import(/* webpackChunkName: "otherpage" */ '../views/orderList/trustDetail.vue'),
            //     meta: {
            //         title: ''
            //     }
            // },
            // {
            //     path: 'list',
            //     name: 'List',
            //     component: () => import(/* webpackChunkName: "otherpage" */ '../views/orderList/list.vue'),
            //     meta: {
            //         title: '',
            //         roles: ['User'],
            //     }
            // },
            // {
            //     path: 'positionDetail',
            //     name: 'PositionDetail',
            //     component: () => import(/* webpackChunkName: "otherpage" */ '../views/position/positionDetail.vue'),
            //     meta: {
            //         title: 'route.positionDetail'
            //     }
            // },
            // {
            //     path: 'loan',
            //     name: 'Loan',
            //     component: () => import(/* webpackChunkName: "otherpage" */ '../views/loan/loan.vue'),
            //     meta: {
            //         title: 'route.loan'
            //     }
            // },
            // {
            //     path: 'record',
            //     name: 'Record',
            //     component: () => import(/* webpackChunkName: "record" */ '../views/record/record.vue'),
            //     meta: {
            //         title: ''
            //     }
            // },
            // {
            //     path: 'transfer',
            //     name: 'Transfer',
            //     component: () => import(/* webpackChunkName: "transfer" */ '../views/transfer/transfer.vue'),
            //     meta: {
            //         title: 'route.transfer'
            //     }
            // },
            // {
            //     path: 'fundProductList',
            //     name: 'FundProductList',
            //     component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundProduct/fundProductList.vue'),
            //     meta: {
            //         title: 'route.fundProductList',
            //     }
            // },
            // {
            //     path: 'fundProductInfo',
            //     name: 'FundProductInfo',
            //     component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundProduct/fundProductInfo.vue'),
            //     meta: {
            //         title: 'route.fundProductInfo'
            //     }
            // },
            // {
            //     path: 'fundApply',
            //     name: 'FundApply',
            //     component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundOrder/fundApply.vue'),
            //     meta: {
            //         title: 'route.fundPurchase',
            //         roles: ['User'],
            //     }
            // },
            // {
            //     path: 'fundRedeem',
            //     name: 'FundRedeem',
            //     component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundOrder/fundRedeem.vue'),
            //     meta: {
            //         title: 'route.fundRedemption',
            //         roles: ['User'],
            //     }
            // },
            // {
            //     path: 'fundRecord',
            //     name: 'FundRecord',
            //     component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundRecord/fundRecord.vue'),
            //     meta: {
            //         title: '',
            //         roles: ['User'],
            //     }
            // },
            // {
            //     path: 'fundRules',
            //     name: 'FundRules',
            //     component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundOrder/fundRules.vue'),
            //     meta: {
            //         title: 'route.fundRules',
            //         roles: ['User'],
            //     }
            // },
            // {
            //     path: 'fundDEX',
            //     name: 'fundDEX',
            //     redirect: '/dashboard',
            //     component: () =>
            //         import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/components/layout.vue'),
            //     children: [
            //         {
            //             path: 'dashboard',
            //             name: 'Dashboard',
            //             component: () =>
            //                 import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/dashboard/index.vue'),
            //             meta: {
            //                 title: ''
            //             }
            //         },
            //         {
            //             path: 'earning',
            //             name: 'Earning',
            //             component: () =>
            //                 import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/staking/index.vue'),
            //             meta: {
            //                 title: ''
            //             }
            //         },
            //         {
            //             path: 'earning/detail',
            //             name: 'Earning-Detail',
            //             component: () =>
            //                 import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/staking/detail.vue'),
            //             meta: {
            //                 title: ''
            //             }
            //         },
            //         {
            //             path: 'indexFunds',
            //             name: 'IndexFunds',
            //             component: () =>
            //                 import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/indexFunds/index.vue'),
            //             meta: {
            //                 title: ''
            //             }
            //         },
            //         {
            //             path: 'indexFunds/detail',
            //             name: 'IndexFunds-Detail',
            //             component: () =>
            //                 import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/indexFunds/detail.vue'),
            //             meta: {
            //                 title: ''
            //             }
            //         },
            //         {
            //             path: 'noticeDetail',
            //             name: 'NoticeDetail',
            //             component: () =>
            //                 import(/* webpackChunkName: "msg" */ '@/themeCommon/user/noticeDetail.vue'),
            //             meta: {
            //                 title: 'route.noticeTitle',
            //                 footerMenu: false,
            //                 // roles: ['User'],
            //             },
            //         },
            //     ]
            // },
        ]
    },
    {
        path: '/area',
        name: 'Area',
        component: () => import(/* webpackChunkName: "Home" */ '../views/area/area.vue'),
        meta: {
            title: 'route.home',
        }
    },
    {
        path: '/personalInformation',
        name: 'PersonalInformation',
        component: () => import(/* webpackChunkName: "Home" */ '../views/personalInformation/personalInformation.vue'),
        meta: {
            title: 'route.home',
            roles: ['User'],
            keepAlive: true
        },
    },
    {
        path: '/competition',
        name: 'Competition',
        component: () => import(/* webpackChunkName: "Home" */ '../views/competition/competition.vue'),
        meta: {
            title: 'route.home',
        }
    },
    {
        path: '/competitionRules',
        name: 'CompetitionRules',
        component: () => import(/* webpackChunkName: "Home" */ '../views/competition/rules.vue'),
        meta: {
            title: 'route.home',
        }
    },
    {
        path: '/myRace',
        name: 'MyRace',
        component: () => import(/* webpackChunkName: "Home" */ '../views/myRace/myRace.vue'),
        meta: {
            title: 'route.home',
            roles: ['User'],
        }
    },
    {
        path: '/infoDetail',
        name: 'InfoDetail',
        component: () => import(/* webpackChunkName: "Home" */ '../views/infoDetail/newInfoDetail.vue'),
        meta: {
            title: 'route.home',
        }
    },
    {
        path: '/infoDetail2',
        name: 'InfoDetail2',
        component: () => import(/* webpackChunkName: "Home" */ '../views/infoDetail/infoDetail2.vue'),
        meta: {
            title: 'route.home',
        }
    },
    {
        path: '/economicCalendar',
        name: 'EconomicCalendar',
        component: () => import(/* webpackChunkName: "Home" */ '../views/economicCalendar/economicCalendar.vue'),
        meta: {
            title: 'route.home',
        }
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
        path: '/deposit',
        name: 'Deposit',
        component: () => import(/* webpackChunkName: "chart" */ '../views/deposit/index.vue'),
        meta: {
            title: 'route.deposit',
            roles: ['User'],
        }
    },
    {
        path: '/faqs',
        name: 'faqs',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/faqs/faqs.vue'),
        meta: {
            title: 'route.faqs',
        }
    },
    {
        path: '/faqItem',
        name: 'faqItem',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/faqs/faqItem.vue'),
        meta: {
            title: 'route.faqItem',
        }
    },
    {
        path: '/payRecord',
        name: 'PayRecord',
        component: () => import(/* webpackChunkName: "chart" */ '../views/payRecord/payRecord.vue'),
        meta: {
            title: 'route.payRecord',
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
            title: '',
            roles: ['User'],
        },
    },
    {
        path: '/otherpage/:type',
        name: 'Nest',
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
            title: '',
            roles: ['User'],
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
    {
        path: '/capitalList',
        name: 'CapitalList',
        component: () => import(/* webpackChunkName: "record" */ '../views/record/components/capitalList.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/transferList',
        name: 'TransferList',
        component: () => import(/* webpackChunkName: "record" */ '../views/record/components/transferList.vue'),
        meta: {
            title: ''
        }
    },
    {
        path: '/transfer',
        name: 'Transfer',
        component: () => import(/* webpackChunkName: "transfer" */ '../views/transfer/transfer.vue'),
        meta: {
            title: 'route.transfer'
        }
    },
    {
        path: '/fundProductList',
        name: 'FundProductList',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundProduct/fundProductList.vue'),
        meta: {
            title: 'route.fundProductList',
        }
    },
    {
        path: '/fundProductInfo',
        name: 'FundProductInfo',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundProduct/fundProductInfo.vue'),
        meta: {
            title: 'route.fundProductInfo'
        }
    },
    {
        path: '/fundApply',
        name: 'FundApply',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundOrder/fundApply.vue'),
        meta: {
            title: 'route.fundPurchase',
            roles: ['User'],
        }
    },
    {
        path: '/fundRedeem',
        name: 'FundRedeem',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundOrder/fundRedeem.vue'),
        meta: {
            title: 'route.fundRedemption',
            roles: ['User'],
        }
    },
    {
        path: '/fundRecord',
        name: 'FundRecord',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundRecord/fundRecord.vue'),
        meta: {
            title: '',
            roles: ['User'],
        }
    },
    {
        path: '/fundRules',
        name: 'FundRules',
        component: () => import(/* webpackChunkName: "fundProduct" */ '../views/fundOrder/fundRules.vue'),
        meta: {
            title: 'route.fundRules',
            roles: ['User'],
        }
    },
    {
        path: '/signalDetail',
        name: 'SignalDetail',
        component: () => import(/* webpackChunkName: "signalDetail" */ '../views/signal/detail.vue'),
        meta: {
            title: 'route.signalDetail',
        }
    },
    {
        path: '/fundDEX',
        name: 'fundDEX',
        redirect: '/dashboard',
        component: () =>
            import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/components/layout.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () =>
                    import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/dashboard/index.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: '/earning',
                name: 'Earning',
                component: () =>
                    import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/staking/index.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: '/earning/detail',
                name: 'Earning-Detail',
                component: () =>
                    import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/staking/detail.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: '/indexFunds',
                name: 'IndexFunds',
                component: () =>
                    import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/indexFunds/index.vue'),
                meta: {
                    title: ''
                }
            },
            {
                path: '/indexFunds/detail',
                name: 'IndexFunds-Detail',
                component: () =>
                    import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/indexFunds/detail.vue'),
                meta: {
                    title: ''
                }
            },

        ]
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'Mine' } },
]

let lang = location.pathname.split('/')[1] || getCookie('lang')
if (!langList.includes(lang)) {
    lang = DEFAULT_LANG
    setCookie('lang', lang, 'y10')
}
const router = createRouter({
    history: createWebHistory(`/${lang}/`),
    scrollBehavior: () => ({ top: 0 }),
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
