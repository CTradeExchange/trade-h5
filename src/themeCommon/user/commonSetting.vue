<template>
    <LayoutTop :back='true' :menu='false' :title='$t("route.mine")' />
    <div class='page-wrap'>
        <p class='header'>
            {{ $t('cRoute.commonSetting') }}
        </p>
        <van-cell-group :border='false' class='cellGroup'>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.lang")'
                @click='langShow=true'
            >
                <template #right-icon>
                    <img alt='' class='lang-icon' :src="'/images/country_icon/'+ lang + '.png'" />
                    <van-icon class='right-arrow' name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='Number(chartVal) === 1 ? $t("common.redDown") : $t("common.redUp")'
                @click='colorShow=true'
            >
                <template #right-icon>
                    <img alt='' class='updown-icon' :src='Number(chartVal) === 1 ? "/images/redDown.png" : "/images/redUp.png"' />
                    <van-icon class='right-arrow' name='arrow' />
                </template>
            </van-cell>
            <van-cell
                class='cellItem'
                is-link
                :title='$t("common.dark")'
            >
                <template #right-icon>
                    <van-switch v-model='themeVal' :active-color='$style.success' size='24px' @change='colorSelect' />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
    <van-popup
        v-model:show='langShow'
        class='custom-popup lang-popup'
        position='bottom'
        round
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.lang') }}
            </div>
            <i class='icon_guanbi' @click='langShow=false'></i>
        </div>
        <div class='popup-wrap'>
            <div
                v-for='(item, index) in supportLanguages'
                :key='index'
                class='lang-item'
                :class='{ active: lang === item.val }'
                @click='langSelect(item)'
            >
                <img alt='' class='lang-icon' :src="'/images/country_icon/'+ item.val + '.png?555'" />
            </div>
        </div>
    </van-popup>

    <van-popup
        v-model:show='colorShow'
        class='custom-popup'
        position='bottom'
        round
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.lang') }}
            </div>
            <i class='icon_guanbi' @click='langShow=false'></i>
        </div>
        <div class='popup-wrap'>
            <van-radio-group v-model='chartVal' @change='colorShow = false'>
                <van-cell-group inset>
                    <van-cell class='popup-item' clickable @click="chartVal = '1'">
                        <template #title>
                            <div class='left'>
                                <span class='label'>
                                    {{ $t('common.up') }}
                                </span>
                                <i class='icon icon_lvzhang color-green'></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span class='label'>
                                    {{ $t('common.down') }}
                                </span>
                                <i class='icon icon_hongdie color-red'></i>
                            </div>
                        </template>
                        <template #right-icon>
                            <van-radio name='1' />
                        </template>
                    </van-cell>
                    <van-cell class='popup-item' clickable @click="chartVal = '2'">
                        <template #title>
                            <div class='left'>
                                <span class='label'>
                                    {{ $t('common.up') }}
                                </span>
                                <i class='icon icon_hongzhang color-red'></i>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span class='label'>
                                    {{ $t('common.down') }}
                                </span>
                                <i class='icon icon_lvdie color-green'></i>
                            </div>
                        </template>
                        <template #right-icon>
                            <van-radio name='2' />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </div>
    </van-popup>
</template>

<script>
import Top from '@/components/top'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { setCookie, getCookie, isEmpty, localGet, localSet } from '@/utils/util'
import { changeLang } from '@/api/base'
import { useI18n } from 'vue-i18n'
import Colors, { setRootVariable } from '@plans/colorVariables'
import i18n, { loadLocaleMessages } from '@plans/i18n/i18n.js'
import { onBeforeMount, computed, reactive, toRefs, onUnmounted } from 'vue'
export default {
    components: { Top },
    setup (props, context) {
        const router = useRouter()
        const { t, locale } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            themeVal: localGet('invertColor') === 'night',
            langShow: false,
            colorShow: false,
            chartVal: JSON.parse(localGet('chartConfig'))?.chartColorType.toString() || '1',
            lang: getCookie('lang') || store.state._base.wpCompanyInfo.language,
        })

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const supportLanguages = computed(() => store.state.supportLanguages)

        // 选择语言
        const langSelect = (action) => {
            state.loading = true
            new Promise((resolve, reject) => {
                if (customInfo.value) {
                    return changeLang(action.val).then(res => {
                        return res.check() ? resolve() : reject()
                    })
                } else {
                    resolve()
                }
            }).then(() => {
                state.loading = false
                state.langVisible = false
                state.lang = action.val

                // 替换URL
                const str = location.pathname
                const firstSlash = str.indexOf('/') + 1
                const twoSlash = str.indexOf('/', firstSlash) // 第二个斜杠下标
                const pathTemp = str.substring(twoSlash).substring(1, str.length)
                location.pathname = action.val + '/' + pathTemp

                loadLocaleMessages(i18n, action.val).then(() => {
                    locale.value = action.val // change!
                    store.commit('del_cacheViews', 'Home')
                    store.commit('del_cacheViews', 'Layout')
                })

                setCookie('lang', action.val, 'y10')
            }).catch(err => (state.loading = false))
        }

        // 选择颜色
        const colorSelect = (action) => {
            const themeColor = action ? 'night' : 'light'
            // 设置全局变量
            store.commit('Update_invertColor', themeColor)
            setRootVariable(themeColor)
            state.colorVisible = false

            let themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                themeColors = JSON.parse(themeColors)

                document.body.style.setProperty('--color', themeColors[themeColor].color)
                document.body.style.setProperty('--contentColor', themeColors[themeColor].contentColor)
                document.body.style.setProperty('--primaryAssistColor', themeColors[themeColor].primaryAssistColor)
                document.body.style.setProperty('--bgColor', themeColors[themeColor].bgColor)
                document.body.style.setProperty('--normalColor', themeColors[themeColor].normalColor)
                document.body.style.setProperty('--minorColor', themeColors[themeColor].minorColor)
                document.body.style.setProperty('--lineColor', themeColors[themeColor].lineColor)
                document.body.style.setProperty('--assistColor', themeColors[themeColor].assistColor)
                document.body.style.setProperty('--placeholdColor', themeColors[themeColor].placeholdColor)
            }
        }

        // 设置红涨绿跌颜色
        const upDownColorSelect = (chartObj) => {
            state.chartVal = chartObj.val
            const locChartConfig = JSON.parse(localGet('chartConfig'))
            if (isEmpty(locChartConfig)) {
                localSet('chartConfig', JSON.stringify({
                    'chartColorType': chartObj.val
                }))
            } else {
                locChartConfig['chartColorType'] = chartObj.val
                localSet('chartConfig', JSON.stringify(locChartConfig))
            }
            const themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                const { riseColor, fallColor } = JSON.parse(themeColors)?.common
                if (chartObj.val === 1) {
                    document.body.style.setProperty('--riseColor', riseColor)
                    document.body.style.setProperty('--fallColor', fallColor)
                } else {
                    document.body.style.setProperty('--riseColor', fallColor)
                    document.body.style.setProperty('--fallColor', riseColor)
                }
            }

            setRootVariable()
            state.colorShow = false
        }

        const back = () => {
            return router.replace('/mine')
        }

        return {
            supportLanguages,
            langSelect,
            colorSelect,
            upDownColorSelect,
            back,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-popup{
    --van-cell-group-inset-padding: 0;
    --van-cell-group-background-color: var(--bgColor);
    .popup-wrap{
        :deep(.van-radio-group){
            .van-cell-group--inset{
                margin: 0;
            }

        }
    }
    .popup-item{
        padding: 0 rem(30px);
        display: flex;
        align-items: center;
        margin-bottom: rem(10px);
        line-height:rem(130px);
        justify-content: space-between;
        background: var(--contentColor);
        &:last-child{
            margin-bottom: 0;
        }
        .left{
            .label{
                font-size: rem(32px);
                vertical-align: middle;
            }
            .color-icon{
                width: rem(40px)
            }
            .icon{
                font-size: rem(50px);
                margin-left:-3px;
                vertical-align: middle;
            }
            .color-red{
                color: var(--warn);
            }
            .color-green{
                color: var(--success);
            }

        }
        :deep(.van-checkbox){
            .van-icon{
                border-radius: 50%;
            }
        }
    }
}
.lang-popup{
    .popup-wrap{
        padding: 0 0 0 rem(40px);
        display: flex;
        flex-wrap: wrap;
        .lang-item{
            box-sizing: content-box;
            padding: rem(8px) rem(8px) rem(2px) rem(8px);
            margin-right: rem(42px);
            margin-bottom: rem(42px);
            border: rem(4px) solid transparent;
            .lang-icon{
                width: rem(120px);
                height: rem(120px)
            }
            &.active{
                border: rem(4px) solid var(--primary);
                border-radius: 50%;

            }
        }
    }

}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap{
    padding-top: rem(110px);
    .header{
        background: var(--contentColor);
        font-size: rem(48px);
        padding-left: rem(30px);
        padding-bottom: rem(30px);
    }
    .cellGroup{
        .cellItem {
            font-size: rem(32px);
            line-height: rem(120px);
            height: rem(120px);
            background: var(--contentColor);
            border-top: solid rem(10px) var(--bgColor);
            //background: none;
            display: flex;
            align-items: center;
            //margin-top: rem(10px);
            &::after{
                border: none;
            }
            :deep(.van-cell__title){
                color: var(--color);
            }
            .lang-icon{
                width: rem(56px);
                margin-right: rem(20px);
            }
            .right-arrow{
                margin-top: -2px;
                color: var(--minorColor);
            }
            .updown-icon{
               width: rem(40px);
               margin-right: rem(20px);
            }
        }
    }
}
</style>
