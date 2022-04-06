<template>
    <LayoutTop :custom-back='true' :menu='false' :title='$t("route.mine")' @back='back' />
    <div class='page-wrap'>
        <p class='header'>
            {{ $t('cRoute.commonSetting') }}
        </p>
        <van-cell-group :border='false' class='cellGroup'>
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
                v-if='inviteVis'
                class='cellItem'
                is-link
                :title='$t("common.invite")'
                to='/invite'
            />
        </van-cell-group>
    </div>

    <van-popup
        v-model:show='colorShow'
        class='custom-popup'
        position='bottom'
        round
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('common.chartColor') }}
            </div>
            <i class='icon_guanbi' @click='colorShow=false'></i>
        </div>
        <div class='popup-wrap'>
            <van-radio-group v-model='chartVal' @change='colorShow = false'>
                <van-cell-group :border='false' inset>
                    <van-cell
                        class='popup-item'
                        clickable
                        @click='upDownColorSelect("1")'
                    >
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
                    <van-cell
                        class='popup-item'
                        clickable
                        @click='upDownColorSelect("2")'
                    >
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
import i18n, { loadLocaleMessages } from '@/themeCommon/i18n/i18n.js'
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
        const companyId = computed(() => customInfo.value.companyId)

        const inviteVis = computed(() => {
            return (location.href.includes('uat') && companyId.value === 1) || (location.href.includes('pre') && companyId.value === 360) || (companyId.value === 11)
        })

        // 设置红涨绿跌颜色
        const upDownColorSelect = (chartObj) => {
            const curTheme = localGet('invertColor')
            state.chartVal = chartObj
            const locChartConfig = JSON.parse(localGet('chartConfig'))
            if (isEmpty(locChartConfig)) {
                localSet('chartConfig', JSON.stringify({
                    'chartColorType': chartObj
                }))
            } else {
                locChartConfig['chartColorType'] = chartObj
                localSet('chartConfig', JSON.stringify(locChartConfig))
            }
            const themeColors = sessionStorage.getItem('themeColors')
            if (!isEmpty(themeColors)) {
                const { riseColor, fallColor } = JSON.parse(themeColors)[curTheme]
                if (chartObj === 1) {
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
            return router.replace('/')
        }

        return {
            supportLanguages,
            upDownColorSelect,
            back,
            inviteVis,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-popup {
    --van-cell-group-inset-padding: 0;
    --van-cell-group-background-color: var(--bgColor);
    --van-cell-group-inset-border-radius: 0;
    .popup-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: rem(20px);
        padding: 0 rem(30px);
        line-height: rem(130px);
        background: var(--contentColor);
        border-radius: rem(10px);
        &:last-child {
            margin-bottom: 0;
        }
        .left {
            .label {
                font-size: rem(32px);
                vertical-align: middle;
            }
            .color-icon {
                width: rem(40px);
            }
            .icon {
                margin-left: -3px;
                font-size: rem(50px);
                vertical-align: middle;
            }
            .color-red {
                color: #B72122;
            }
            .color-green {
                color: #2B70AE;
            }
        }
        .van-radio {
            .van-radio__icon--checked {
                .van-icon {
                    line-height: normal;
                }
            }
        }
        &::after {
            border-bottom: none;
        }
    }
}
.lang-popup {
    .popup-wrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0 0 rem(25px);
        .lang-item {
            box-sizing: content-box;
            margin-right: rem(20px);
            margin-bottom: rem(42px);
            padding: rem(8px) rem(8px) rem(2px) rem(8px);
            border: rem(4px) solid transparent;
            .lang-icon {
                width: rem(120px);
                height: rem(120px);
            }
            &.active {
                border: rem(4px) solid var(--primary);
                border-radius: 50%;
            }
        }
    }
}

</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.custom-popup {
    :deep(.van-radio-group) {
        background: chocolate;
    }
}
.page-wrap {
    padding-top: rem(110px);
    .header {
        padding-bottom: rem(30px);
        padding-left: rem(30px);
        font-size: rem(48px);
        background: var(--contentColor);
    }
    .cellGroup {
        .cellItem {
            //background: none;
            display: flex;
            align-items: center;
            height: rem(120px);
            font-size: rem(32px);
            line-height: rem(120px);
            background: var(--contentColor);
            border-top: solid rem(10px) var(--bgColor);
            //margin-top: rem(10px);
            &::after {
                border: none;
            }
            :deep(.van-cell__title) {
                color: var(--color);
            }
            .lang-icon {
                width: rem(56px);
                margin-right: rem(20px);
            }
            .right-arrow {
                margin-top: -2px;
                color: var(--minorColor);
            }
            .updown-icon {
                width: rem(40px);
                margin-right: rem(20px);
            }
        }
    }
}
</style>
