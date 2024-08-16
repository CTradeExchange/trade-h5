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

    <!--暫時抽離這個v-if="!isUniapp && $route.path.indexOf('/event/') === -1" -->
    <div v-if="$route.path.indexOf('/order') === -1" class='fab'>
        <div
            v-if='!isUniapp && buoyTG.state == 1 '
            class='fab-item'
            :style="isInit ? {} : { top: topPosition + 'px', left: leftPosition + 'px' }"
            @click='handleSkip'
            @touchend.stop='handleMouseUp'
            @touchmove.stop.prevent='handleMouseMove'
            @touchstart.stop='handleMouseDown'
        >
            <img class='tg-bot' :src='commonTgBar' />
        </div>
        <div class='fab-item' @click='openPasstoAIChat'>
            <img class='customer-service' :src='commonServiceBar' />
        </div>
    </div>
    <AutoThirdRegister />
    <Notice />
</template>

<script>
import Notice from '@plans/components/notice'
import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref, toRefs, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog } from 'vant'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
import { localGet, getQueryVariable, sessionSet, unzip, postInviteQuery, parseJSON } from '@/utils/util'
import Base from '@/store/modules/base'
import { setRootVariable } from '@plans/colorVariables'
import onWindowMessage from '@/plugins/onWindowMessage/onMessage'
import AutoThirdRegister from '@/themeCommon/components/autoThirdRegister.vue'
import { firebaseAnalytics, pushUserToken } from '@/utils/firebase'
import { configSystem } from '@/api/base'
import commonTgBar from './images/common-tg.png'
import commonServiceBar from './images/common-service.png'

export default {
    components: {
        Notice,
        AutoThirdRegister,
    },
    setup () {
        const store = useStore()
        window.store = store
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const isUniapp = getQueryVariable('isUniapp')
        // 隐藏tg内置浏览器google第三方登录
        const isTGweb = getQueryVariable('isTGweb')
        if (isTGweb == '1') sessionSet('isTGweb', isTGweb)
        const cacheViews = computed(() => store.state.cacheViews)
        const customerInfo = computed(() => store.state._user.customerInfo)
        const googleAnalytics = computed(() => store.state._base.wpCompanyInfo.googleAnalytics)
        const tipTextCountDown = ref(t('confirm') + '(3s)')
        if (getQueryVariable('b_superiorAgent')) {
            sessionSet('b_superiorAgent', getQueryVariable('b_superiorAgent'))
        }

        const buoyTG = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find(i => i.Key === 'buoyTG') || {}
            return parseJSON(obj.Value) || {}
        })

        const state = reactive({
            commonTgBar,
            isInit: true,
            isDragging: false,
            topPosition: 0,
            leftPosition: 0,
            startPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
        })

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
                        '/mine': 'me',
                        '/quote': 'home'
                    }]
                },
                '/home': {
                    event: 'home_source',
                    param: ['home_source', 'activate']
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
                '/product': {
                    event: 'ck_trade_entrance',
                    param: ['trade_entrance', {
                        '/home': 'home',
                        '/assets': 'assets',
                        '/mine': 'me',
                        '/infodetail': 'hot_event',
                        '/economiccalendar': 'financial_event',
                        '/quote': 'trade',
                        '/productsearch': 'search',
                        '/product': 'home'
                    }]
                },
                '/deposit': {
                    event: 'ck_recharge_entrance',
                    param: ['recharge_entrance', {
                        '/mine': 'me',
                        '/assets': 'assets',
                    }]
                },
                '/authentication': {
                    event: 'kyc_initiated',
                    param: ['kyc_entrance', {
                        '/mine': 'me',
                        '/deposit': 'withdraw',
                        '/authentication': 'me'
                    }]
                },
                '/authform': {
                    event: 'kyc_write',
                    param: ['kyc_write_entrance', 'kyc_initiated']
                }
            }
            const npath = newPath.toLocaleLowerCase()
            let opath = oldPath?.toLocaleLowerCase() ?? npath
            opath = opath === '/' ? '/home' : opath
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

        watch(() => route.path, handlePathAnalytics, {
            immediate: true
        })

        watch(() => customerInfo.value, () => {
            // fcm推送
            pushUserToken(true)
        }, {
            immediate: true
        })

        // 检查系统是否在维护
        configSystem()
            .then(res => {
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

        onMounted(() => {
            // 缓存广告来源参数
            postInviteQuery()
            // 插入谷歌统计代码
            setRootVariable(localGet('invertColor'), Base.state.wpCompanyInfo.themeColor)
            try {
                if (googleAnalytics.value) {
                    var result = ''
                    const reg = /<?script[^>]*>[^<]*<\/script>/gi
                    const analyticsScript = unzip(googleAnalytics.value).match(reg)
                    for (var i in analyticsScript) result += analyticsScript[i] + '\n'
                    result = result.replace(/<\/?script>/g, '')
                    // eslint-disable-next-line no-eval
                    eval(result)
                }
            } catch (error) {

            }
            // 给body添加h5类
            document.body.classList.add('h5')
        })

        // 处理多tab互踢问题
        const login_token_connect_replace = () => {
            Dialog.alert({
                title: t('tip'),
                message: t('c.tabMessage'),
                showCancelButton: true,
                cancelButtonText: t('c.iknow'),
                confirmButtonText: t('c.againRefresh')
            }).then(() => {
                location.reload()
            })
        }

        document.documentElement.classList.add(store.state.invertColor)

        // 监听ws全局事件
        document.body.addEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
        document.body.addEventListener('GotMsg_disconnect', disconnect, false)
        document.body.addEventListener('GotMsg_login_token_connect_replace', login_token_connect_replace, false)

        window.addEventListener('message', onWindowMessage, false)
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
            document.body.removeEventListener('GotMsg_disconnect', disconnect, false)
            document.body.removeEventListener('GotMsg_login_token_connect_replace', login_token_connect_replace, false)
        })

        const handleMouseMove = (e) => {
            if (state.isDragging) {
                const event = e.targetTouches[0] || {}
                const w = e.view.outerWidth - (e.target.clientWidth / 2)
                const h = e.view.outerHeight - (e.target.clientHeight / 2)
                state.currentPosition.x = event.clientX < 0 ? 0 : event.clientX > w ? w : event.clientX
                state.currentPosition.y = event.clientY < 0 ? 0 : event.clientY > h ? h : event.clientY

                const x = state.currentPosition.x - state.startPosition.x
                const y = state.currentPosition.y - state.startPosition.y

                if (state.leftPosition + x >= 0) {
                    state.offset.x = x
                    state.leftPosition = state.leftPosition + state.offset.x
                    state.startPosition.x = state.currentPosition.x
                }
                if (state.topPosition + y >= 0) {
                    state.offset.y = y
                    state.topPosition = state.topPosition + state.offset.y
                    state.startPosition.y = state.currentPosition.y
                }
            }
        }

        const handleMouseDown = (e) => {
            state.isDragging = true
            const event = e.targetTouches[0] || {}
            if (state.isInit) {
                state.isInit = false
                state.topPosition = event.clientY - e.target.clientWidth / 2
                state.leftPosition = event.clientX - e.target.clientHeight / 2
            }
            state.startPosition.x = event.clientX
            state.startPosition.y = event.clientY
        }

        const handleMouseUp = (e) => {
            state.isDragging = false
        }

        const handleSkip = () => {
            window.open(buoyTG.value?.link)
        }

        return {
            buoyTG,
            isTGweb,
            isUniapp,
            cacheViews,
            commonServiceBar,
            handleSkip,
            handleMouseMove,
            handleMouseDown,
            handleMouseUp,
            ...toRefs(state)
        }
    },
    created () {
        window.vm = this
    }
}
</script>

<style lang="scss">
@import '~@plans/style.scss';
@import '~@plans/font/iconfont.css';
@import '~@/sass/mixin.scss';
.notice-modal {
    border-radius: 0 !important;
}
</style>

<style lang="scss" scoped>
.fab {
    position: fixed;
    z-index: 999;
    right: 16px;
    bottom: rem(150px);
    .fab-item {
        width: rem(76px);
        height: rem(76px);
        background: #fff;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,.12);
        overflow: hidden;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:nth-of-type(1) {
          margin-bottom: rem(20px)
        }
        .tg-bot {
            width: 100%;
            height: 100%;
        }
        .customer-service {
            width: 80%;
            height: auto;
        }
    }
}
</style>
