<template>
    <Suspense>
        <template #default>
            <router-view v-slot='{ Component, route }'>
                <!-- <transition mode='out-in' :name="route.meta.transition || 'fade'"> -->
                <keep-alive :include='cacheViews'>
                    <component :is='Component' :key='route.meta.usePathKey ? route.path : undefined' />
                </keep-alive>
                <!-- </transition> -->
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <!-- <Notice /> -->
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
import { getQueryVariable, sessionSet, unzip, computeHtmlTime } from '@/utils/util'
import getTrackingInvestingFtd from '@/utils/investingComFtd'
import { firebaseAnalytics, pushUserToken } from '@/utils/firebase'
import { configSystem } from '@/api/base'
export default {
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const cacheViews = computed(() => store.state.cacheViews)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const googleAnalytics = computed(() => store.state._base.wpCompanyInfo.googleAnalytics)
        const tipTextCountDown = ref(t('confirm') + '(3s)')
        const noticeContent = ref(null)
        window.store = store
        if (getQueryVariable('b_superiorAgent')) {
            sessionSet('b_superiorAgent', getQueryVariable('b_superiorAgent'))
        }
        // 跳转到登录页面刷新
        const handlerLogout = () => {
            return store
                .dispatch('_user/logout')
                .then(() => {
                    return router.push('/home') // 创建一个访问首页的浏览器历史记录
                })
                .then(() => {
                    return router.push('/login')
                })
                .then(() => {
                    location.reload()
                })
        }

        // 用户被踢出消息
        const kickOut = () => {
            return handlerLogout()
        }

        const handlePathAnalytics = (newPath, oldPath) => {
            const pathInfo = {
                '/register': {
                    event: 'sign_up',
                    param: ['sign_up_way', 'email']
                },
                '/login': {
                    event: 'login',
                    param: ['login_way', 'email']
                },
                '/infodetail': {
                    event: 'ck_hot_event_entrance',
                    param: ['hot_event_entrance', 'home']
                },
                '/economiccalendar': {
                    event: 'ck_financial_event_entrance',
                    param: ['financial_event_entrance', 'home']
                },
                '/quote': {
                    event: 'ck_quote_entrance',
                    param: ['quote_entrance', {
                        '/home': 'home',
                        '/order': 'trade',
                        '/assets': 'assets',
                        '/quote': 'home'
                    }]
                },
                '/order': {
                    event: 'ck_trade_entrance',
                    param: ['trade_entrance', {
                        '/home': 'home',
                        '/assets': 'assets',
                        '/mine': 'me',
                        '/infodetail': 'hot_event',
                        '/economiccalendar': 'financial_event',
                        '/quote': 'trade',
                        '/productsearch': 'search',
                        '/order': 'home'
                    }]
                },
            }
            const npath = newPath?.toLocaleLowerCase() ?? ''
            const opath = oldPath?.toLocaleLowerCase() ?? ''
            if (pathInfo[npath]) {
                const { event, param } = pathInfo[npath]
                let [key, value] = param
                if (typeof value === 'object' && value) {
                    value = value[opath]
                }
                if (!value) return
                firebaseAnalytics(event, { key, value })
            }
        }

        watch(() => route.path, (val) => {
            // 保持置顶
            document.documentElement.scrollTop = document.body.scrollTop = 0
            const doc = document.getElementById('app')
            if (doc) doc.scrollTop = 0
            // 路由埋点
            handlePathAnalytics(val)
        }, {
            immediate: true
        })

        // 用户异地登录
        const disconnect = () => {
            if (MsgSocket?.ws) MsgSocket.ws.close() // 断开msg ws链接
            let countNum = 3
            const countTimer = setInterval(() => {
                countNum--
                tipTextCountDown.value = `${t('confirm')}(${countNum}s)`
                if (countNum === 0) {
                    Dialog.close()
                    handlerLogout()
                    clearInterval(countTimer)
                }
            }, 1000)
            Dialog.alert({
                title: t('tip'),
                message: t('c.otherPlaceLogin'),
                confirmButtonText: tipTextCountDown
            }).then(() => {
                handlerLogout()
            })
        }

        // 处理多tab互踢问题
        const login_token_connect_replace = () => {
            Dialog.alert({
                title: t('tip'),
                message: t('c.tabMessage'),
                showCancelButton: true,
                cancelButtonText: t('c.iknow'),
                confirmButtonText: t('c.againRefresh'),
            }).then(() => {
                location.reload()
            })
        }

        // 全局通知
        const gotMsg = (res) => {
            noticeContent.value = res.detail.content
            const bizType = res.detail.content?.bizType
            let msg = {
                title: noticeContent.value.title || t('c.biaoTi'),
                dangerouslyUseHTMLString: true,
                message: <div class='content'>{computeHtmlTime(noticeContent.value.text)}</div>,
                duration: 60000,
            }

            // 出金入金更新用户信息
            const arr = ['CASH_IN', 'CASH_IN_BO']
            if (arr.includes(res.detail.content?.bizType) && customerInfo.value) {
                store.dispatch('_user/findCustomerInfo', false)
            }

            // CASH_IN是前台入金成功，CASH_IN_BO是后台额度调整成功
            if (bizType === 'CASH_IN') {
                msg = {
                    title: noticeContent.value.title || t('c.biaoTi'),
                    dangerouslyUseHTMLString: true,
                    message: <div class='content'>{computeHtmlTime(noticeContent.value.text)}</div>,
                    class: 'paymentSuccessClass',
                    duration: 60000,
                }
                const { customerNo, activateStatus, email, phone, phoneAll, emailAll } = customerInfo.value || {}
                // 首次入金--插入广告
                /* if (customerNo && activateStatus !== 1) {
                    const { subID } = route?.params || route?.query || {}
                    const body = { user_id: customerNo }
                    if (subID) body['subID'] = subID
                    getTrackingInvestingFtd(body)
                } */

                // 首次入金--插入广告
                if (customerNo && activateStatus !== 1) {
                    let { subID, subid } = route?.params || {}
                    if (!subID && !subid) {
                        subID = route?.query?.subID
                        subid = route?.query?.subid
                    }
                    const body = { user_id: customerNo }
                    if (subID || subid) body['subID'] = subID || subid
                    getTrackingInvestingFtd(body)
                }
            }
            // ElNotification(msg)
        }

        // 检查系统是否在维护
        configSystem()
            .then(res => {
                // "exception":[11,13,16,360,362,387,388,1,2,9,10]
                // "domain:"["cmfbl.com"]
                const isProduction = process.env.NODE_ENV === 'production'
                if (isProduction && res && res.maintenance === true) {
                    const { exception, domain } = res
                    const host = location.host
                    const companyId = window['companyId']
                    const isQA = domain.find(el => host.includes(el)) && exception.indexOf(Number(companyId)) > -1
                    if (!isQA) {
                        location.href = `/upgrading.html?back=${encodeURIComponent(location.href)}`
                    }
                }
            })
            .catch(() => {
                // location.href = `/upgrading.html?back=${encodeURIComponent(location.href)}`
            })

        // 插入谷歌统计代码
        onMounted(() => {
            try {
                if (googleAnalytics.value) {
                    var result = ''
                    const reg = /<?script[^>]*>[^<]*<\/script>/gi
                    const analyticsScript = unzip(googleAnalytics.value).match(reg)
                    for (var i in analyticsScript) result += analyticsScript[i] + '\n'
                    result = result.replace(/<\/?script>/g, '')
                    eval(result)
                }
            } catch (error) {

            }
            // 给body添加h5类
            document.body.classList.add('pc')
        })

        watch(() => customerInfo.value, () => {
            // fcm推送
            pushUserToken(true)
        }, {
            immediate: true
        })

        document.documentElement.classList.add(store.state.invertColor)
        // 监听ws全局事件
        document.body.addEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
        document.body.addEventListener('GotMsg_disconnect', disconnect, false)
        document.body.addEventListener('GotMsg_login_token_connect_replace', login_token_connect_replace, false)
        document.body.addEventListener('GotMsg_notice', gotMsg, false)

        // 跳珠新路由滚动到顶部
        router.afterEach((to, from, next) => {
            window, scrollTo(0, 0)
        })

        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
            document.body.removeEventListener('GotMsg_disconnect', disconnect, false)
            document.body.removeEventListener('GotMsg_login_token_connect_replace', login_token_connect_replace, false)
            document.body.removeEventListener('GotMsg_notice', gotMsg, false)
        })

        return {
            cacheViews,
        }
    },
    created () {
        window.vm = this
    }
}
</script>

<style lang="scss">
@import '~@planspc/font/iconfont.css';
@import '~@/sass/mixin.scss';
@import './style.scss';

</style>
