<template>
    <!-- <router-view v-slot='{ Component, route }'>
        <keep-alive>
            <component :is='Component' v-if='route.meta.keepAlive' :key='route.fullPath' />
        </keep-alive>
        <component :is='Component' v-if='!route.meta.keepAlive' :key='route.fullPath' />
    </router-view> -->
    <Suspense>
        <template #default>
            <router-view v-slot='{ Component, route }'>
                <!-- <transition mode='out-in' :name="route.meta.transition || 'fade'"> -->
                <keep-alive :include='cacheViews'>
                    <component :is='Component' :key='route.meta.usePathKey ? route.path : undefined' />
                </keep-alive>
                <!-- </transition> -->

                <!-- 公告弹窗 -->
                <van-popup
                    v-model:show='publicShow'
                    class='public-pop'
                    closeable
                    position='center'
                    :style="{ height: '60%',width: '80%' }"
                >
                    <div class='pop-top'>
                        {{ $t('notice.poptitle') }}
                    </div>
                    <div class='pop-content'>
                        <div class='public-list'>
                            <div v-for='(item,index) in noticeData' :key='index' class='item' @click='goNoticeDetail(item.id)'>
                                <div class='item-tit'>
                                    {{ item.title }}
                                </div>
                                <div class='item-time'>
                                    {{ formatTime(item.pubTime) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </van-popup>
            </router-view>
        </template>
        <template #fallback>
            Loading...
        </template>
    </Suspense>
    <Notice />
    <!-- <router-view />  -->
</template>

<script>
import Notice from '@plans/components/notice'
import { useStore } from 'vuex'
import { computed, onMounted, onUnmounted, ref, reactive, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, Popup } from 'vant'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
import { localGet, getQueryVariable, sessionSet, unzip, getCookie, setCookie } from '@/utils/util'
import Base from '@/store/modules/base'
import { setRootVariable } from '@plans/colorVariables'
import onWindowMessage from '@/plugins/onWindowMessage/onMessage'
import { configSystem } from '@/api/base'
import { getNoticeList } from '@/api/user'

export default {
    components: {
        Notice
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const cacheViews = computed(() => store.state.cacheViews)
        const googleAnalytics = computed(() => store.state._base.wpCompanyInfo.googleAnalytics)
        const tipTextCountDown = ref(t('confirm') + '(3s)')
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const _storeState = computed(() => store.state)
        const state = reactive({
            publicShow: false,
            lang: getCookie('lang') || 'zh-CN',
            noticePubTime: getCookie('pubTimeUpdate'),
            currentNt: 1,
            noticeData: []
        })
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

        // 检查系统是否在维护
        configSystem()
            .then(res => {
                // "exception":[11,13,16,360,362,387,388,1,2,9,10]
                // "domain:"["cats-trade.com"]
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
            setRootVariable(localGet('invertColor'), Base.state.wpCompanyInfo.themeColor)
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
            // getNoticeData()
        })

        const getPublicData = (val) => {
            state.publicShow = val
        }

        // 获取公告列表
        const getNoticeData = () => {
            console.log(state.noticePubTime)
            getNoticeList({
                current: state.currentNt,
                // pubTimeFrom: '',
                // pubTimeTo: '',
                lang: state.lang,
                size: 10,
                companyId: customInfo.value.companyId,
                customerNo: customInfo.value.customerNo
            }).then(res => {
                console.log(res)
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.noticeData = res.data.records
                        getPublicData(true)
                        console.log(state.noticeData[0].pubTime)
                        setCookie('pubTimeUpdate', state.noticeData[0].pubTime)
                    }
                }
            }).catch(err => {
                state.errorTip = t('c.loadError')
            })
        }

        const goNoticeDetail = (id) => {
            router.push({
                path: '/noticeDetail',
                query: {
                    id: id
                }
            })
        }

        document.documentElement.classList.add(store.state.invertColor)

        // 监听ws全局事件
        document.body.addEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
        document.body.addEventListener('GotMsg_disconnect', disconnect, false)
        window.addEventListener('message', onWindowMessage, false)
        onUnmounted(() => {
            document.body.removeEventListener('GotMsg_UserForceLogoutRet', kickOut, false)
            document.body.removeEventListener('GotMsg_disconnect', disconnect, false)
        })

        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        return {
            cacheViews,
            customInfo,
            _storeState,
            goNoticeDetail,
            formatTime,
            getNoticeData,
            getPublicData,
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

</style>

<style lang="scss" scoped >
@import '~@/sass/mixin.scss';
.public-pop {
    border-radius: rem(10px);
    .pop-top {
        padding-left: rem(30px);
        font-size: rem(36px);
        line-height: rem(120px);
    }
    .van-popup__close-icon {
        top: rem(20px);
        right: rem(20px);
    }
    .pop-content {
        max-height: 80%;
        padding: 0 rem(30px) rem(20px) rem(30px);
        overflow: auto;
    }
    .public-list {
        margin: 0;
        .item {
            margin: rem(15px) 0 rem(25px) 0;
            .item-tit {
                margin-bottom: rem(10px);
                color: var(--color);
                font-size: rem(28px);
            }
            .item-time {
                color: var(--minorColor);
                font-size: rem(24px);
            }
        }
    }
}
</style>
