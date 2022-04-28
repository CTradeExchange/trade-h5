<template>
    <el-popover
        ref='popover'
        placement='bottom'
        trigger='hover'
        :width='170'
    >
        <template #reference>
            <i class='icon icon_shezhi' :title='$t("header.set")'></i>
        </template>
        <div class='settingDrapdown'>
            <ul class='list'>
                <li v-if='customInfo' class='item' @click='handRoutTo("/setLoginPwd")'>
                    {{ Number(customInfo.loginPassStatus) === 1 ? $t("forgot.setPwd") : $t('login.modifyLoginPwd') }}
                </li>
                <li v-if='customInfo' class='item' @click='handRoutTo("/setFundPwd")'>
                    {{ Number(customInfo.assertPassStatus) === 1 ? $t("forgot.setFundPwd") : $t('forgot.resetFundPwd') }}
                </li>
                <li v-if='customInfo' class='item' @click='handRoutTo("/bindMobile")'>
                    {{ customInfo.phone ? $t("setting.replacePhone") : $t('setting.bindPhone') }}
                </li>
                <li v-if='customInfo' class='item' @click='handRoutTo("/bindEmail")'>
                    {{ customInfo.email ? $t("setting.replaceEmail") : $t('setting.bindEmail') }}
                </li>
                <li class='item flexBetween'>
                    <span>{{ $t('setting.chartColor') }}</span>
                    <van-icon class='arrowIcon' name='arrow' />
                    <div class='subDrapdown'>
                        <ul class='list'>
                            <li
                                v-for='(item,i) in chartColorAction'
                                :key='i'
                                class='item flexBetween'
                                :class='{ active:Number(item.val)===Number(chartColorActive) }'
                                @click='changeChartColor(item)'
                            >
                                <span>{{ item.name }}</span>
                                <van-icon v-show='Number(item.val)===Number(chartColorActive)' name='success' />
                            </li>
                        </ul>
                    </div>
                </li>
                <li class='item' @click='logoutHandler'>
                    {{ $t('quitLogin') }}
                </li>
            </ul>
        </div>
    </el-popover>
</template>

<script>
import { reactive, ref, computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { localGet, localSet, isEmpty } from '@/utils/util'
import { colors, setRootVariable } from '@planspc/colorVariables'
import { MsgSocket } from '@/plugins/socket/socket'
import { useRouter, useRoute } from 'vue-router'

export default {
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const popover = ref(null)
        const customInfo = computed(() => store.state._user.customerInfo)
        const chartColorAction = [
            { val: '1', name: t('common.redDown') },
            { val: '2', name: t('common.redUp') },
        ]
        const state = reactive({
            chartColorActive: JSON.parse(localGet('chartConfig'))?.chartColorType || 1
        })

        // 设置涨跌颜色
        const changeChartColor = item => {
            const locChartConfig = JSON.parse(localGet('chartConfig'))
            if (isEmpty(locChartConfig)) {
                localSet('chartConfig', JSON.stringify({
                    'chartColorType': item.val
                }))
            } else {
                locChartConfig['chartColorType'] = item.val
                localSet('chartConfig', JSON.stringify(locChartConfig))
            }

            state.chartColorActive = item.val

            const { riseColor, fallColor } = colors.common
            if (parseInt(item.val) === 1) {
                document.body.style.setProperty('--riseColor', riseColor)
                document.body.style.setProperty('--fallColor', fallColor)
            } else {
                document.body.style.setProperty('--riseColor', fallColor)
                document.body.style.setProperty('--fallColor', riseColor)
            }
            setRootVariable()
            const event = new CustomEvent('Launch_chartColor', { detail: item.val })
            document.body.dispatchEvent(event)
        }
        // 退出登录
        const logoutHandler = () => {
            MsgSocket.logout()
            Promise.resolve().then(() => {
                return store.dispatch('_user/logout')
            }).then(() => {
                return router.push({ name: 'Login' })
            }).then(() => {
                location.reload()
            })
        }

        // 路由跳转
        const handRoutTo = (path) => {
            popover.value.hide()
            router.push(route.path + path)
        }

        return {
            customInfo,
            popover,
            chartColorAction,
            changeChartColor,
            logoutHandler,
            handRoutTo,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.icon {
    font-size: 16px;
    color: #D6DAE1;
    cursor: pointer;
}
.settingDrapdown{
    font-size: 14px;
    .item{
        position: relative;
        padding: 0 10px 0 17px;
        height: 40px;
        color: var(--color);
        border-radius: 5px;
        line-height: 40px;
        cursor: pointer;
        .arrowIcon{
            float: right;
            display: none;
        }
        &:hover, &.active{
            color: var(--primary);
            .arrowIcon,.subDrapdown{
                display: block;
            }
        }
    }
    .flexBetween{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .subDrapdown{
        display: none;
        position: absolute;
        border-radius: 5px;
        background: var(--contentColor);
        padding: 8px;
        color: var(--color);
        right: 100%;
        top: 0;
        width: 150%;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }
}
</style>
