<template>
    <div class='page-wrap'>
        <Top back />
        <p class='header'>
            {{ $t('cRoute.commonSetting') }}
        </p>
        <van-cell-group class='cellGroup'>
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
                :title='$t("common.dark")'
            >
                <template #right-icon>
                    <van-switch v-model='themeVal' size='24px' @change='colorSelect' />
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
        </van-cell-group>
    </div>
    <van-popup
        v-model:show='langShow'
        class='custom-popup'
        position='bottom'
        round
    >
        <div class='popup-wrap'>
            <div
                v-for='(item, index) in supportLanguages'
                :key='index'
                class='popup-item'
                @click='langSelect(item)'
            >
                <span class='label'>
                    {{ item.name }}
                </span>
                <img alt='' class='lang-icon' :src="'/images/country_icon/'+ item.val + '.png'" />
            </div>
        </div>
    </van-popup>

    <van-popup
        v-model:show='colorShow'
        class='custom-popup'
        position='bottom'
        round
    >
        <div class='popup-wrap'>
            <div
                v-for='(item, index) in chartAction'
                :key='index'
                class='popup-item'
                @click='upDownColorSelect(item)'
            >
                <span class='label'>
                    {{ item.name }}
                </span>
                <img alt='' class='color-icon' :src="'/images/'+ item.imgName + '.png'" />
            </div>
        </div>
    </van-popup>
</template>

<script>
import Top from '@/components/top'
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
        const { t, locale } = useI18n({ useScope: 'global' })
        const store = useStore()
        const state = reactive({
            themeVal: localGet('invertColor') === 'night',
            langShow: false,
            colorShow: false,
            chartVal: JSON.parse(localGet('chartConfig'))?.chartColorType || 1,
            lang: getCookie('lang') || store.state._base.wpCompanyInfo.language,
        })

        const chartAction = [
            { val: 1, name: t('common.redDown'), imgName: 'redDown' },
            { val: 2, name: t('common.redUp'), imgName: 'redUp' },
        ]

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

        return {
            supportLanguages,
            langSelect,
            colorSelect,
            chartAction,
            upDownColorSelect,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-popup{
    max-height: 80%;
    background: var(--bgColor);
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
        .lang-icon{
            width: rem(72px);
            height: rem(48px)
        }
        .label{
            font-size: rem(32px);
        }
        .color-icon{
            width: rem(40px)
        }
    }
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.page-wrap{
    .header{
        background: var(--contentColor);
        font-size: rem(48px);
        font-weight: bold;
        padding-left: rem(30px);
        padding-bottom: rem(30px);
    }
    .cellGroup{
        .cellItem {
            font-size: rem(32px);
            font-weight: bold;
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
            .lang-icon{
                width: rem(70px);
                margin-right: rem(20px);
            }
            .right-arrow{
                margin-top: -2px;
            }
            .updown-icon{
               width: rem(40px);
               margin-right: rem(20px);
            }
        }
    }
}
</style>
