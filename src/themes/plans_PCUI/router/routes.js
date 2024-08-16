import themeRouter from '@/themeCommon/router'

const h5Children = [
    {
        path: 'personalInformation', // 修改个人信息
        component: () =>
            import(/* webpackChunkName: "Setting" */ '../views/user/personalInformation.vue'),
        meta: {
            title: 'cRoute.personal',
            footerMenu: false,
            roles: ['User']
        },

    },
    {
        path: 'bindEmail', // 绑定邮箱
        component: () =>
            import(/* webpackChunkName: "Setting" */ '../views/setting/bindEmail.vue'),
        meta: {
            title: 'cRoute.bindEmail',
            footerMenu: false,
        }
    },
    {
        path: 'bindMobile', // 绑定手机
        component: () =>
            import(/* webpackChunkName: "Setting" */ '../views/setting/bindMobile.vue'),
        meta: {
            title: 'cRoute.bindMobile',
            footerMenu: false,
        }
    },
    {
        path: 'setLoginPwd', // 设置密码
        component: () =>
            import(/* webpackChunkName: "setLoginPwd" */ '../views/setting/setLoginPwd.vue'),
        meta: {
            title: 'cRoute.setLoginPwd',
            roles: ['User']
        }
    },
    {
        path: 'setFundPwd', // 设置资金密码
        component: () =>
            import(/* webpackChunkName: "setLoginPwd" */ '../views/setting/setFundPwd.vue'),
        meta: {
            title: 'cRoute.setFundPwd',
            roles: ['User']
        }
    },
    {
        path: 'bankList',
        component: () =>
            import(/* webpackChunkName: "bankList" */ '../views/user/bankList.vue'),
        meta: {
            title: 'cRoute.bankList',
            roles: ['User']
        }
    },
    {
        path: 'addBank',
        component: () =>
            import(/* webpackChunkName: "addBank" */ '../views/user/addBank.vue'),
        meta: {
            title: 'cRoute.addBank',
            roles: ['User']
        }
    },
    {
        path: 'authentication',
        // name: 'Authentication',
        component: () =>
            import(/* webpackChunkName: "addBank" */ '../views/user/authentication.vue'),
        meta: {
            title: 'cRoute.authentication',
            roles: ['User']
        }
    },
    {
        path: 'authForm',
        component: () =>
            import(/* webpackChunkName: "addBank" */ '../views/user/authForm.vue'),
        meta: {
            title: 'cRoute.authForm',
            roles: ['User']
        }
    },
    {
        path: 'area',
        component: () =>
            import(/* webpackChunkName: "addBank" */ '../views/user/changeArea.vue'),
        meta: {
            title: 'common.area',
            roles: ['User']
        }
    },
    {
        path: 'kycCommitted',
        // name: 'KycCommitted',
        component: () =>
            import(/* webpackChunkName: "addBank" */ '../views/user/kycCommitted.vue'),
        meta: {
            title: 'cRoute.kycCommitted',
            roles: ['User']
        }
    },
    {
        path: 'contract',
        component: () =>
            import(/* webpackChunkName: "contract" */ '../views/contract/contract.vue'),
        meta: {
            title: '',
            roles: ['User']
        }
    },
    {
        path: 'recharge',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/deposit.vue'),
        meta: {
            title: 'cRoute.deposit',
            roles: ['User']
        }
    },
    // {
    //     path: 'recharge',
    //     component: () =>
    //         import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/blockAtmFaq.vue'),
    //     meta: {
    //         title: 'cRoute.deposit',
    //         roles: ['User']
    //     }
    // },
    {
        path: 'transfer',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/transfer/transfer.vue'),
        meta: {
            title: 'route.transfer',
            roles: ['User']
        }
    },
    {
        path: 'transferSuccess',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/TransferSuccess.vue'),
        meta: {
            title: 'route.transfer',
            roles: ['User']
        }
    },
    {
        path: 'withdrawCoin',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/withdraw/withdrawCoin.vue'),
        meta: {
            title: 'route.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'withdrawAccount',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/withdraw/withdrawAccount.vue'),
        meta: {
            title: 'route.withdrawAccount',
            roles: ['User']
        }
    },
    {
        path: 'withdraw',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/Withdraw.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'fundRecords', // 资金记录
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/FundRecords.vue'),
        meta: {
            title: 'record.fundRecord',
            roles: ['User']
        }
    },
    {
        path: 'fundFlow', // 资金记录
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/FundFlow.vue'),
        meta: {
            title: 'record.capitalRecord',
            roles: ['User']
        }
    },
    // {
    //     path: 'transfer', // 划转
    //     component: () =>
    //         import(/* webpackChunkName: "transfer" */ '../views/transfer/transfer.vue'),
    //     meta: {
    //         title: 'route.transfer',
    //         roles: ['User']
    //     }
    // },
    {
        path: 'chooseAccount', // 选择币种
        component: () =>
            import(/* webpackChunkName: "chooseAccount" */ '../views/chooseAccount/chooseAccount.vue'),
        meta: {
            title: 'cRoute.chooseCurrency',
            roles: ['User']
        }
    },
    {
        path: 'withdrawMoney', // 提现
        component: () =>
            import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawMoney.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'withdrawRedeem', // 提现Payredeem
        component: () =>
            import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawRedeem.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'pay8Account',
        component: () =>
            import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/pay8Account.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'pay8Bank',
        component: () =>
            import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/pay8Bank.vue'),
        meta: {
            title: 'cRoute.withdraw',
            roles: ['User']
        }
    },
    {
        path: 'withdrawRecord',
        component: () =>
            import(/* webpackChunkName: "withdrawAccount" */ '../views/withdraw/withdrawRecord.vue'),
        meta: {
            title: 'cRoute.withdrawRecord',
            roles: ['User']
        }
    },
    // {
    //     path: 'authentication', // 身份认证
    //     component: () =>
    //         import(/* webpackChunkName: "authentication" */ '../views/authentication/authentication.vue'),
    //     meta: {
    //         title: 'cRoute.authentication',
    //     }
    // },
    {
        path: 'walletAdd', // 添加钱包
        component: () =>
            import(/* webpackChunkName: "Bank" */ '../views/wallet/walletAdd.vue'),
        meta: {
            title: 'cRoute.walletAdd',
            roles: ['User']
        }
    },
    {
        path: 'walletAddress', // 添加钱包
        component: () =>
            import(/* webpackChunkName: "Bank" */ '../views/wallet/walletAddress.vue'),
        meta: {
            title: 'cRoute.walletAdd',
            roles: ['User']
        }
    },
    {
        path: 'loan', // 借款
        component: () =>
            import(/* webpackChunkName: "loan" */ '../views/loan/loan.vue'),
        meta: {
            title: 'route.loan',
            roles: ['User']
        }
    },
    {
        path: 'returnMoney', // 还款
        component: () =>
            import(/* webpackChunkName: "returnMoney" */ '../views/returnMoney/returnMoney.vue'),
        meta: {
            title: 'route.returnMoney',
            roles: ['User']
        }
    },
    {
        path: 'record', // 资金记录
        component: () =>
            import(/* webpackChunkName: "returnMoney" */ '../views/record/record.vue'),
        meta: {
            title: 'route.records',
            roles: ['User']
        }
    },
    {
        path: 'regKyc', // 注册KYC
        component: () =>
            import(/* webpackChunkName: "RegKyc" */ '../views/register/regKyc.vue'),
        meta: {
            title: 'route.RegKyc',
        }
    },
    {
        path: 'googleMFA/status',
        component: () =>
            import(/* webpackChunkName: "google_MFA" */ '../views/google_MFA/status.vue'),
        meta: {
            title: 'route.MFA_status',
        }
    },
    {
        path: 'googleMFA/install',
        component: () =>
            import(/* webpackChunkName: "google_MFA" */ '../views/google_MFA/install.vue'),
        meta: {
            title: 'route.MFA_status',
        }
    },
    {
        path: 'googleMFA/secretKey',
        component: () =>
            import(/* webpackChunkName: "google_MFA" */ '../views/google_MFA/secretKey.vue'),
        meta: {
            title: 'route.MFA_bind',
        }
    },
    {
        path: 'googleMFA/bind',
        component: () =>
            import(/* webpackChunkName: "google_MFA" */ '../views/google_MFA/bind.vue'),
        meta: {
            title: 'route.MFA_bind',
        }
    },
    {
        path: 'googleSecurityCheck/index',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/googleSecurityCheck/index.vue'),
        meta: {
            title: 'route.MFA_check',
        }
    },
    {
        path: 'api/createSuccess',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/api/createSuccess.vue'),
        meta: {
            title: 'api.createTitle',
        }
    },
    {
        path: 'message',
        component: () =>
            import(/* webpackChunkName: "googleSecurityCheck" */ '../views/user/message.vue'),
        meta: {
            title: 'cRoute.msg',
        }
    }
]

const routes = [
    ...themeRouter,
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import(/* webpackChunkName: "Login" */ '../views/login/loginSelect.vue'),
        meta: {
            title: 'route.login',
            roles: [],
        }
    },
    {
        path: '/login/select',
        name: 'LoginSelect',
        component: () =>
            import(/* webpackChunkName: "Login" */ '../views/login/login.vue'),
        meta: {
            title: 'route.login',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/register', // 登記
        name: 'Register',
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/register.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/register/step1', // 登記
        name: 'RegisterStep1',
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/register-step1.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/register/step2', // 登記
        name: 'RegisterStep2',
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/register-step2.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/register/step3', // 登記
        name: 'RegisterStep3',
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/register-step3.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/investing', // 於Investing.com宣傳的登記網頁(尼日利亞)
        name: 'Register2',
        query: {
            utm_source: 5,
            utm_medium: 'CPL',
            utm_campaign: 'InvestingctabuttonNG',
            utm_content: 'buysellbuttonpostback',
            subID: ':subID',
        },
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/investingRegNg.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/investingPH', // 於Investing.com宣傳的登記網頁(菲律賓)
        name: 'Register3',
        query: {
            utm_source: 5,
            utm_medium: 'CPL',
            utm_campaign: 'InvestingctabuttonPH',
            utm_content: 'buysellbuttonpostback',
            subID: ':subID',
        },
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/investingReg.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/investingMY', // 於Investing.com宣傳的登記網頁(法國)
        name: 'Register4',
        query: {
            utm_source: 5,
            utm_medium: 'CPL',
            utm_campaign: 'InvestingctabuttonMY',
            utm_content: 'buysellbuttonpostback',
            subID: ':subID',
        },
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/investingReg.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/investingIN', // 於Investing.com宣傳的登記網頁(法國)
        name: 'Register5',
        query: {
            utm_source: 5,
            utm_medium: 'CPL',
            utm_campaign: 'InvestingctabuttonIN',
            utm_content: 'buysellbuttonpostback',
            subID: ':subID',
        },
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/investingReg.vue'),
        meta: {
            title: 'route.register',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/register/success', // 成功登記的通知頁面
        name: 'RegisterSuccess',
        component: () =>
            import(/* webpackChunkName: "Register" */ '../views/register/registerSuccess.vue'),
        meta: {
            title: 'route.registerSuccess',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/forgot', // 忘記密碼
        name: 'Forgot',
        component: () =>
            import(/* webpackChunkName: "Forgot" */ '../views/forgot/forgot.vue'),
        meta: {
            title: 'route.forgot',
            roles: [],
        },
        children: h5Children
    },
    {
        path: '/resetPwd',
        name: 'ResetPwd',
        component: () =>
            import(/* webpackChunkName: "Forgot" */ '../views/forgot/resetPwd.vue'),
        meta: {
            title: 'route.resetPwd',
            // keepAlive: true,
            roles: [],
        }
    },
    {
        path: '/resetFundPwd',
        name: 'ResetFundPwd',
        component: () =>
            import(/* webpackChunkName: "Forgot" */ '../views/forgot/resetFundPwd.vue'),
        meta: {
            title: 'route.resetFundPwd',
            // keepAlive: true,
            roles: [],
        },
        children: h5Children
    },

    {
        path: '/resetSuccess',
        name: 'ResetSuccess',
        component: () =>
            import(/* webpackChunkName: "resetSuccess" */ '../views/forgot/resetSuccess.vue'),
        meta: {
            title: 'cRoute.resetPwdSuccess'
        }
    },
    {
        path: '/resetFail',
        name: 'ResetFail',
        component: () =>
            import(/* webpackChunkName: "resetFail" */ '../views/forgot/resetFail.vue'),
        meta: {
            title: 'cRoute.resetPwdFaid'
        }
    },
    {
        path: '/',
        redirect: '/home',
        name: 'Layout',
        component: () =>
            import(/* webpackChunkName: "Home" */ '../layout/index.vue'),
        // keepAlive: true,
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () =>
                    import(/* webpackChunkName: "Home" */ '../views/home/home.vue'),
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
                component: () =>
                    import(/* webpackChunkName: "Quote" */ '../views/quote/quote.vue'),
                meta: {
                    title: 'route.quote',
                    roles: [],
                    assetsTop: true
                },
                children: h5Children
            },
            {
                path: 'aboutus',
                name: 'Aboutus',
                component: () =>
                    import(/* webpackChunkName: "Quote" */ '../views/aboutus/aboutus.vue'),
                meta: {
                    title: 'route.aboutus',
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'support',
                name: 'Support',
                component: () =>
                    import(/* webpackChunkName: "Quote" */ '../views/aboutus/aboutus.vue'),
                meta: {
                    title: 'route.aboutus',
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'infoDetail',
                name: 'InfoDetail',
                component: () => import(/* webpackChunkName: "Home" */ '../views/infoDetail/newInfoDetail.vue'),
                meta: {
                    title: 'route.home',
                },
                children: h5Children
            },
            { // 針對banner topic的頁面內容
                path: 'infoDetail2',
                name: 'InfoDetail2',
                query: {
                    id: 22356,
                },
                component: () => import(/* webpackChunkName: "Home" */ '../views/infoDetail/infoDetailBanner.vue'),
                meta: {
                    title: 'route.home',
                },
                children: h5Children
            },
            {
                path: 'economicCalendar',
                name: 'EconomicCalendar',
                component: () => import(/* webpackChunkName: "Home" */ '../views/economicCalendar/economicCalendar.vue'),
                meta: {
                    title: 'route.home',
                },
                children: h5Children
            },
            {
                path: 'competition',
                name: 'Competition',
                component: () => import(/* webpackChunkName: "Home" */ '../views/competition/competition.vue'),
                meta: {
                    title: 'route.home',
                },
                children: h5Children
            },
            {
                path: 'competitionRules',
                name: 'CompetitionRules',
                component: () => import(/* webpackChunkName: "Home" */ '../views/competition/rules.vue'),
                meta: {
                    title: 'route.home',
                },
                children: h5Children
            },
            {
                path: 'myRace',
                name: 'MyRace',
                component: () => import(/* webpackChunkName: "Home" */ '../views/myRace/myRace.vue'),
                meta: {
                    title: 'route.home',
                },
                children: h5Children
            },
            {
                path: 'order',
                name: 'Order',
                component: () =>
                    import(/* webpackChunkName: "Order" */ '../views/order/order.vue'),
                meta: {
                    title: 'route.order',
                    roles: [],
                    assetsTop: true
                },
                children: h5Children
            },
            {
                path: 'mine',
                name: 'Mine',
                component: () => import(/* webpackChunkName: "Mine" */ '../../plans/views/mine/mine.vue'),
                meta: {
                    title: 'route.mine',
                }
            },
            {
                path: 'transRecords',
                name: 'TransRecords',
                component: () =>
                    import(/* webpackChunkName: "Quote" */ '../views/transRecords/transRecords.vue'),
                meta: {
                    title: 'route.transRecords',
                    roles: [],
                },
                children: h5Children
            },
            {
                path: 'fees',
                name: 'Fees',
                component: () =>
                    import(/* webpackChunkName: "footerUrlPage" */ '../views/footerUrlPage/fees/index.vue'),
                meta: {
                    title: '',
                },
                children: h5Children
            },
            {
                path: 'about',
                name: 'About',
                component: () =>
                    import(/* webpackChunkName: "footerUrlPage" */ '../views/footerUrlPage/aboutUs/index.vue'),
                meta: {
                    title: '',
                },
                children: h5Children
            },
            {
                path: 'fundManager', // 基金操作专区
                name: 'FundManager',
                component: () =>
                    import(/* webpackChunkName: "returnMoney" */ '../views/fundManager/index.vue'),
                meta: {
                    title: 'route.fundManager',
                    roles: ['User']
                },
                children: h5Children
            },
            {
                path: 'businessKYC/index',
                name: 'BusinessKYC',
                component: () =>
                    import(/* webpackChunkName: "businessKYC" */ '../views/businessKYC/index.vue'),
                meta: {
                    title: '企业KYC',
                },
                children: h5Children
            },
            {
                path: 'businessKYC',
                name: 'BusinessKYCList',
                component: () =>
                    import(/* webpackChunkName: "businessKYC" */ '../views/businessKYC/kycList.vue'),
                meta: {
                    title: '企业KYC',
                },
                children: h5Children
            },
            {
                path: '/businessKYC/content',
                name: 'BusinessKYCContent',
                component: () =>
                    import(/* webpackChunkName: "businessKYC" */ '../views/businessKYC/content.vue'),
                meta: {
                    title: '企业KYC',
                },
                children: h5Children
            },
            {
                path: '/download',
                name: 'Download',
                component: () =>
                    import(/* webpackChunkName: "resetFail" */ '../views/download/index.vue'),
                meta: {
                    title: 'route.download'
                },
                children: h5Children
            },
            {
                path: '/promotion',
                name: 'promotion',
                component: () =>
                    import(/* webpackChunkName: "resetFail" */ '../views/promotion/promoteWeb.vue'),
                meta: {
                    title: 'route.promotion',
                },
                children: h5Children
            },
            {
                path: '/ranking',
                name: 'Ranking',
                component: () =>
                    import(/* webpackChunkName: "resetFail" */ '../views/ranking/ranking.vue'),
                meta: {
                    title: 'route.ranking'
                }
            },
            {
                path: '/api',
                name: 'Api',
                component: () =>
                    import(/* webpackChunkName: "api" */ '../views/api/api.vue'),
                meta: {
                    title: 'route.api'
                },
                children: h5Children
            },
            {
                path: '/apiEdit',
                name: 'ApiEdit',
                component: () =>
                    import(/* webpackChunkName: "api" */ '../views/api/edit.vue'),
                meta: {
                    title: 'route.api'
                },
                children: h5Children
            },
            {
                path: '/notice',
                name: 'Notice',
                component: () =>
                    import(/* webpackChunkName: "api" */ '../views/notice/index.vue'),
                meta: {
                    title: 'route.noticeTitle'
                },
                children: h5Children
            },
            {
                path: '/noticeDetail',
                name: 'NoticeDetail',
                component: () =>
                    import(/* webpackChunkName: "api" */ '../views/notice/detail.vue'),
                meta: {
                    title: 'route.noticeTitle'
                },
                children: h5Children
            },
            {
                path: '/appRegister',
                name: 'AppRegister',
                component: () => import(/* webpackChunkName: "login" */ '../views/register/appRegister.vue'),
                meta: {
                    title: 'cRoute.register'
                },
                children: h5Children
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
                        },
                        children: h5Children
                    },
                    {
                        path: '/earning',
                        name: 'Earning',
                        component: () =>
                            import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/staking/index.vue'),
                        meta: {
                            title: ''
                        },
                        children: h5Children
                    },
                    {
                        path: '/earning/detail',
                        name: 'Earning-Detail',
                        component: () =>
                            import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/staking/detail.vue'),
                        meta: {
                            title: ''
                        },
                        children: h5Children
                    },
                    {
                        path: '/indexFunds',
                        name: 'IndexFunds',
                        component: () =>
                            import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/indexFunds/index.vue'),
                        meta: {
                            title: ''
                        },
                        children: h5Children
                    },
                    {
                        path: '/indexFunds/detail',
                        name: 'IndexFunds-Detail',
                        component: () =>
                            import(/* webpackChunkName: "api" */ '@/themeCommon/user/fundDEX/indexFunds/detail.vue'),
                        meta: {
                            title: ''
                        },
                        children: h5Children
                    }
                ]
            }
        ],
    },
    {
        path: '/signalDetail',
        name: 'SignalDetail',
        component: () => import(/* webpackChunkName: "signalDetail" */ '../views/signal/detail.vue'),
        meta: {
            title: 'route.signalDetail',
        }
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
