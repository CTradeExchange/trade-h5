<template>
    <div ref='wrapper' class='menuList' :style='props.data.styleObj'>
        <van-cell-group :border='false' class='cellGroup'>
            <template v-for='(item, index) in state.list'>
                <van-cell
                    v-if='!item.hide'
                    :key='index'
                    class='cellItem'
                    :is-link='item.isLink'
                    :title='item.title'
                    @click="item.click ? item.click() : item.dataKey=='helpCenter' ? visitHelpCenter() : openUrl(item)"
                >
                    <template #icon>
                        <img
                            v-if='item.icon'
                            alt=''
                            :class="['icon' ,item.href.name]"
                            height='20'
                            :src='item.icon'
                            width='20'
                        />
                    </template>
                    <template #label>
                        <span v-if='item.describe'>
                            {{ item.describe }}
                        </span>
                    </template>
                    <template #value>
                        <van-tag v-if='item.value' round :type='item.valueStyle'>
                            <span v-if='!h5Preview && item.dataKey'>
                                {{ $store.getters[item.dataKey] }}
                            </span>
                            <span v-else-if='item.value'>
                                {{ item.value }}
                            </span>
                        </van-tag>
                    </template>
                </van-cell>
            </template>
            <!-- <jwt-btn>
                <van-cell
                    class='cellItem'
                    is-link
                    :title="$t('cRoute.helpCenter')"
                >
                    <template #icon>
                        <img
                            alt=''
                            class='icon'
                            height='20'
                            src='./assets/help.png'
                            width='20'
                        />
                    </template>
                </van-cell>
            </jwt-btn> -->
            <van-cell v-if='state.isDemoTran' class='cellItem' is-link :title="$t('common.quitLogin')" @click='loginOut'>
                <template #icon>
                    <img class='icon' height='20' src='../../images/logout.png' width='20' />
                </template>
            </van-cell>
            <!-- <SwichAccount :slot-fn='slotFn'>
                <van-cell class='cellItem' is-link :title=" isDemoTran ? $t('demoAccount.demo') : $t('demoAccount.real') " @click.stop='handleSwich'>
                    <template #icon>
                        <img class='icon' height='20' :src='isDemoTran ? transformRealIcon : transformDemoIcon' width='20' />
                    </template>
                </van-cell>
            </SwichAccount> -->
        </van-cell-group>
        <slot></slot>
    </div>
</template>

<script setup>
import { Dialog } from 'vant'
import { isDemoAccount } from '@/utils/util'
import { reactive, defineProps, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import {
    msgIcon,
    kycIocn,
    securityIcon,
    commonSettingIcon,
    transformRealIcon,
    transformDemoIcon,
    customerServiceIcon,
    helpCenter,
    personalIcon,
    myRaceIcon
} from './assets'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { MsgSocket } from '@/plugins/socket/socket'

const { proxy } = getCurrentInstance()
const router = useRouter()
const store = useStore()
const { t, locale } = useI18n({ useScope: 'global' })
const props = defineProps({
    data: {
        type: Object,
        default: () => ({
            href: '',
            src: '',
            target: '',
        })
    },

})
const state = reactive({
    transformRealIcon,
    transformDemoIcon,
    slotFn: null,
    placeholder: '',
    fccInfoFlow: {},
    isDemoTran: isDemoAccount(),
    list: [
        // {
        //     dataKey: null,
        //     describe: '',
        //     href: { name: 'PersonalInformation' },
        //     icon: personalIcon,
        //     isLink: true,
        //     title: this.$t('cRoute.personalInformation'),
        //     value: '',
        //     valueStyle: 'none'
        // },
        // {
        //     dataKey: null,
        //     describe: '',
        //     href: { name: 'MyRace' },
        //     icon: myRaceIcon,
        //     isLink: true,
        //     title: this.$t('competition.myRace'),
        //     value: '',
        //     valueStyle: 'none',
        // },
        {
            dataKey: null,
            describe: '',
            href: { name: 'Msg' },
            icon: msgIcon,
            isLink: true,
            title: t('cRoute.msg'),
            value: '',
            valueStyle: 'none'
        },
        // {
        //     dataKey: null,
        //     describe: '',
        //     href: { name: 'Authentication' },
        //     icon: kycIocn,
        //     isLink: true,
        //     title: this.$t('cRoute.regKyc'),
        //     value: '',
        //     valueStyle: 'none',
        //     hide: isDemoAccount()
        // },
        {
            dataKey: null,
            describe: '',
            href: { name: 'SecuritySetting' },
            icon: securityIcon,
            isLink: true,
            title: t('cRoute.securitySetting'),
            value: '',
            valueStyle: 'none',
            hide: isDemoAccount()
        },
        {
            dataKey: null,
            describe: '',
            href: { name: 'CommonSetting' },
            icon: commonSettingIcon,
            isLink: true,
            title: t('cRoute.commonSetting'),
            value: '',
            valueStyle: 'none'
        },
        {
            dataKey: null,
            describe: '',
            icon: customerServiceIcon,
            isLink: true,
            title: t('cRoute.customerService'),
            value: '',
            valueStyle: 'none',
            href: { name: 'service' },
            params: { type: 'page' },
            click: () => {
                proxy.openPasstoAIChat()
            }
        },
        {
            dataKey: 'helpCenter',
            describe: '',
            href: { name: 'helpCenter' },
            icon: helpCenter,
            isLink: true,
            title: t('cRoute.helpCenter'),
            value: '',
            valueStyle: 'none',
            params: { type: 'page' },
        },
    ]
})

const loginOut = () => {
    Dialog.confirm({
        confirmButtonText: t('common.sure'),
        cancelButtonText: t('common.cancel'),
        title: t('common.tip'),
        message: t('setting.logoutConfirm')
    })
        .then(() => {
            // 退出登录
            MsgSocket.logout()
            MsgSocket.ws && MsgSocket.ws.close()
            return store.dispatch('_user/logout')
        })
        .then(() => {
            return router.push('/')
        })
        .then(() => {
            location.reload()
        })
}
const visitHelpCenter = () => {
    window.open(locale.value == 'zh-CN' ? 'https://help.headline.net/zh-cn/' : 'https://help.headline.net/en-us/', '_blank')
}

</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.title {
    padding: 10px 20px;
    font-size: 14px;
    line-height: 1;
    vertical-align: middle;
}
.icon {
    display: inline-block;
    width: rem(40px);
    height: rem(40px);
    margin-right: rem(24px);
    vertical-align: middle;
    &.PersonalInformation{
        width:rem(38px);
        height: rem(32px);
    }
    &.MyRace{
        width:rem(38px);
        height: rem(35px);
    }
}
.cellGroup {
    padding: 0 rem(30px) rem(30px);
    .cellItem {
        display: flex;
        align-items: center;
        height: rem(95px);
        font-size: rem(26px);
        line-height: rem(120px);
        background: var(--cellBg);
        margin-bottom: rem(10px);
        border-radius: rem(15px);
        &::after {
            border: none;
        }
        :deep(.van-icon-arrow) {
            margin-top: -2px;
        }
        :deep(.van-cell__title) {
            color: var(--primaryText);
        }
        :deep(.van-cell__value) {
            flex: none;
        }
    }
}
:deep(.van-tag--none) {
    color: #969799;
}
:deep(.van-cell__label:empty) {
    display: none;
}
</style>
