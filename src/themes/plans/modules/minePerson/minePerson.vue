<template>
    <div class='mineBox' :style='data.styleObj'>
        <LayoutTop :back='false' />
        <div v-if="userAccountType === 'G'" class='mineGuest'>
            <div class='faceImgBox'>
                <img class='faceImg' :src='faceImg' />
            </div>
            <div class='guestBts'>
                <button class='btn' @click="$router.push('/login')">
                    {{ $t("login.loginOrRegist") }}
                </button>
            </div>
        </div>
        <div v-else class='personInfo'>
            <div class='faceImgBox' @click="openUrl({ href: { name: 'PersonalInformation' } })">
                <img class='faceImg' :src='newUserInfo?.HeadImg || faceImg' />
            </div>
            <div class='personNo'>
                <div v-if='customerInfo' class='customerNo'>
                    <p class='text1'>
                        Hi,
                        <span v-if='customerInfo?.phone'>
                            {{ hideMobileInfo(customerInfo?.phone) }}
                        </span>
                        <span v-else-if='customerInfo?.email'>
                            {{ hideEmailInfo(customerInfo?.email) }}
                        </span>
                        <span v-else>
                            ---
                        </span>
                    </p>
                    <p class='text2'>
                        ID: {{ customerInfo?.customerNo }}
                        <i
                            class='icon_fuzhi copy-btn'
                            :data-clipboard-text='customerInfo?.customerNo'
                            @click='copyCustomerNo'
                        ></i>
                        <span v-if='!isRealTran' class='textBtn'>
                            {{
                                $t("demoAccount.account")
                            }}
                        </span>
                    </p>
                </div>
            </div>
            <div v-if='data.src' class='capitalImg'>
                <ImgComp :data='data' />
            </div>
            <fund />
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard'
import ImgComp from '../img/img'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { hideEmailInfo, hideMobileInfo, isDemoAccount } from '@/utils/util'
import { Toast } from 'vant'
import fund from './components/fund.vue'

const faceImgDefault = require('@plans/images/avatar.png')

export default {
    components: {
        ImgComp,
        fund,
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    setup () {
        const store = useStore()
        const faceImg = faceImgDefault
        const { t, tm } = useI18n({ useScope: 'global' })

        const userAccountType = computed(
            () => store.getters['_user/userAccountType']
        )
        const customerInfo = computed(() => store.state._user.customerInfo)
        const assets = computed(() => store.state._user.accountAssets)
        const miniAmountText = computed(
            () =>
                assets.value?.balance?.length +
                assets.value?.availableMargin?.length >
                25
        )

        const newUserInfo = computed(() => store.state._user.newUserInfo || {})

        // 判断是否模拟交易
        const isRealTran = computed(() => !isDemoAccount())

        const kycMap = {
            level_1: t('common.kycLevel1'),
            level_2: t('common.kycLevel2'),
            level_3: t('common.kycLevel3')
        }
        const kycStateTextMap = tm('kycStateTextMap')
        const kycStateMap = {
            0: { className: 'unverified', icon: 'icon_weirenzheng' },
            1: { className: 'unverified', icon: 'icon_weirenzheng' },
            2: { className: 'check', icon: 'icon_shenhezhong' },
            3: { className: 'fail', icon: 'icon_renzhengshibai' },
            4: { className: 'success', icon: 'icon_yirenzheng' },
            '-1': {
                className: 'custom',
                icon: {
                    level_1: 'icon_jichurenzheng',
                    level_2: 'icon_zhongjirenzheng'
                }
            }
        }

        // 赋值账号
        const copyCustomerNo = (value) => {
            var clipboard = new Clipboard('.copy-btn')
            clipboard.on('success', (e) => {
                Toast(t('common.copySuccess'))
                // 释放内存
                clipboard.destroy()
            })
        }

        return {
            faceImg,
            userAccountType,
            customerInfo,
            assets,
            miniAmountText,
            kycMap,
            kycStateTextMap,
            kycStateMap,
            hideMobileInfo,
            hideEmailInfo,
            copyCustomerNo,
            isRealTran,
            newUserInfo
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.mineBox {
    background-color: var(--bgColor)
}
.mineGuest {
    display: flex;
    flex-direction: column;
    margin-top: rem(102px);
    padding: 0 rem(30px) rem(60px);
    background: var(--contentColor);
    align-items: center;
    border-top-left-radius: rem(20px);
    border-top-right-radius: rem(20px);
    .guestBts {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin: rem(50px) rem(30px) 0;
        .btn {
            width: 100%;
            height: rem(80px);
            color: #fff;
            font-size: rem(32px);
            line-height: 1;
            background: var(--primary);
            border-radius: rem(6px);
            letter-spacing: 1px;
        }
    }
}
.headerIcon {
    height: 100%;
    display: flex;
    align-items: center;
    & > img {
        width: rem(48px);
        height: rem(48px);
        &:active {
            opacity: 0.6;
        }
    }
}
.faceImgBox {
    width: rem(150px);
    height: rem(150px);
    background: var(--contentColor);
    border-radius: 50%;
    display: flex;
    margin-top: rem(-64px);
    padding: rem(24px);
    box-sizing: border-box;
    .faceImg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
.personInfo {
    display: flex;
    flex-direction: column;
    margin-top: rem(102px);
    padding: 0 rem(30px) rem(60px);
    background: var(--contentColor);
    align-items: center;
    border-top-left-radius: rem(20px);
    border-top-right-radius: rem(20px);
}
.personNo {
    position: relative;
    text-align: center;
    .customerNo {
        display: inline-block;
        padding-top: rem(12px);
        font-size: rem(32px);
        .text1 {
            font-size: rem(30px);
            margin-bottom: rem(16px);
            color: var(--minorColor);
        }
        .text2 {
            font-size: rem(25px);
            color: var(--minorColor);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            margin-top: rem(10px);
            .copy-btn {
                font-size: rem(22px);
                margin-left: rem(10px);
            }
            .textBtn {
                font-size: rem(16px);
                margin-left: rem(32px);
                padding: rem(8px) rem(12px);
                border-radius: rem(4px);
                background-color: var(--primaryLc);
                color: var(--primary);
                white-space: nowrap;
            }
        }
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
            color: #ff9e00;
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
