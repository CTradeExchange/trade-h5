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
                        最新公告
                    </div>
                    <div class='pop-content'>
                        <div class='public-list'>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
                                </div>
                            </div>
                            <div class='item'>
                                <div class='item-tit'>
                                    数字货币及交易对上新
                                </div>
                                <div class='item-time'>
                                    2022.4.12  12:00:00
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
import { localGet, getQueryVariable, sessionSet, unzip } from '@/utils/util'
import Base from '@/store/modules/base'
import { setRootVariable } from '@plans/colorVariables'
import onWindowMessage from '@/plugins/onWindowMessage/onMessage'
import { configSystem } from '@/api/base'

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
        const state = reactive({
            publicShow: false
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
            getPublicData()
        })

        const getPublicData = () => {
            state.publicShow = true
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

        return {
            cacheViews,
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
.public-pop{
    border-radius: rem(10px);

    .pop-top{
        line-height: rem(120px);
        font-size: rem(36px);
        padding-left: rem(30px);
    }

    .van-popup__close-icon{
        right: rem(20px);
        top: rem(20px);
    }

    .pop-content{
        padding: rem(0px) rem(30px) rem(20px) rem(30px);
        max-height: 80%;
        overflow: auto;
    }

    .public-list{
        margin: 0 rem(0px);

        .item{
            margin: rem(15px) rem(0px) rem(25px) rem(0px);

            .item-tit{
                font-size: rem(28px);
                color: var(--color);
                margin-bottom: rem(10px);
            }
            .item-time{
                font-size: rem(24px);
                color: var(--minorColor);
            }
        }
    }

}
</style>
