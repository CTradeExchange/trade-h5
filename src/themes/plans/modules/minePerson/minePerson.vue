<template>
    <div :style='data.styleObj'>
        <div v-if="userAccountType==='G'" class='mineGuest'>
            <img class='faceImg' :src='faceImg' />
            <div class='guestBts'>
                <button class='btn' @click="$router.push('/login')">
                    {{ $t('cRoute.login') }}
                </button>
                <button class='btn' @click="$router.push('/register')">
                    {{ $t('cRoute.register') }}
                </button>
            </div>
        </div>
        <div v-else class='personInfo'>
            <div class='personNo'>
                <img class='faceImg' :src='faceImg' @click="$router.push('/personal')" />
                <div v-if='customerInfo' class='customerNo'>
                    <p @click="$router.push('/personal')">
                        {{ customerInfo.customerNo }}
                        <van-icon class='arrowIcon' name='arrow' />
                    </p>
                    <span v-if='Number(customerInfo.kycStatus) !== 0' class='status' :class='kycStateMap[customerInfo.kycStatus].className' @click="$router.push('/authentication')">
                        <span class='icon' :class='customerInfo.kycStatus === -1 ? kycStateMap[customerInfo.kycStatus].icon[customerInfo.kycRemark] : kycStateMap[customerInfo.kycStatus].icon'>
                        </span>

                        <span v-if='customerInfo.kycStatus === -1'>
                            {{ kycMap[customerInfo.kycRemark] }}
                        </span>
                        <span v-else>
                            {{ customerInfo.kycRemark }}
                        </span>

                        <!-- {{ $tm('kycAuditStatus')[customerInfo.kycAuditStatus] }}  :class="['status'+customerInfo.kycAuditStatus]" -->
                    </span>
                </div>
            </div>
            <div v-if='data.src' class='capitalImg'>
                <!-- <img alt='' src='/images/minePlace.png' /> -->
                <ImgComp :data='data' />
            </div>
        </div>
        <Fund v-if='fundVis' :show='fundVis' @update:show='updateShow' />
    </div>
</template>

<script>
import Fund from '@plans/components/fund'
import ImgComp from '../img/img'
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const faceImgDefault = require('@plans/images/face.png')
const h5Preview = process.env.VUE_APP_h5Preview
export default {
    components: {
        Fund,
        ImgComp,
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const faceImg = props.data.faceImg || faceImgDefault
        const adImg = props.src
        const userAccountType = computed(() => store.getters['_user/userAccountType'])
        const customerInfo = computed(() => store.state._user.customerInfo)
        const assets = computed(() => store.state._user.accountAssets)
        const miniAmountText = computed(() => assets.value?.balance?.length + assets.value?.availableMargin?.length > 25)
        const state = reactive({ fundVis: false })
        const updateShow = (val) => {
            state.fundVis = val
        }
        const kycMap = {
            level_1: t('common.kycLevel1'),
            level_2: t('common.kycLevel2'),
        }
        const kycStateMap = {
            '0': { className: 'unverified', icon: 'icon_weirenzheng' },
            '1': { className: 'unverified', icon: 'icon_weirenzheng' },
            '2': { className: 'check', icon: 'icon_shenhezhong' },
            '3': { className: 'fail', icon: 'icon_renzhengshibai' },
            '4': { className: 'success', icon: 'icon_yirenzheng' },
            '-1': {
                className: 'custom',
                icon: {
                    'level_1': 'icon_jichurenzheng',
                    'level_2': 'icon_zhongjirenzheng',
                }
            }
        }

        return {
            ...toRefs(state),
            faceImg,
            userAccountType,
            updateShow,
            customerInfo,
            assets,
            miniAmountText,
            kycMap,
            kycStateMap
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mineGuest {
    padding: rem(40px) 0 rem(30px);
    background: var(--contentColor);
    .faceImg {
        display: block;
        width: rem(110px);
        height: rem(110px);
        margin: 0 auto;
    }
    .guestBts {
        display: flex;
        justify-content: space-between;
        margin: rem(50px) rem(20px) 0;
        .btn {
            width: 45%;
            height: rem(80px);
            color: #FFF;
            font-size: rem(34px);
            line-height: 1;
            background: var(--primary);
            border-radius: rem(40px);
        }
    }
}
.personInfo {
    padding: rem(40px);
    color: var(--color);
    background: var(--contentColor);
}
.personNo {
    position: relative;
    height: rem(110px);
    padding-left: rem(130px);
    .faceImg {
        position: absolute;
        top: 0;
        left: 0;
        width: rem(110px);
        height: rem(110px);
    }
    .customerNo {
        display: inline-block;
        padding-top: rem(15px);
        font-size: rem(32px);
    }
    .arrowIcon {
        color: var(--minorColor);
        vertical-align: 0;
    }
    .status {
        display: inline-block;
        height: rem(40px);
        margin-top: 3px;
        padding: 0 rem(20px) 0 rem(6px);
        color: var(--color);
        font-size: rem(20px);
        line-height: rem(40px);
        background: var(--bgColor);
        border-radius: rem(20px);
        &.unverified {
            color: var(--minorColor);
        }
        &.check {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
        &.success {
            color: #FF9E00;
            background: rgba(255, 158, 0, 0.08);
        }
        &.fail {
            color: var(--fallColor);
            background: rgba(239, 83, 83, 0.08);
        }
        &.custom {
            color: var(--success);
            background: rgba(38, 166, 154, 0.08);
        }
        .icon {
            margin-right: rem(8px);
        }
    }
}
.capitalImg {
    margin-top: rem(30px);
    text-align: center;
    background: var(--assistColor);
    img {
        width: 100%;
    }
}
</style>
