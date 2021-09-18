<template>
    <div>
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
            <div class='personNo' @click="$router.push('/personal')">
                <img class='faceImg' :src='faceImg' />
                <div v-if='customerInfo' class='customerNo'>
                    <p>
                        {{ customerInfo.customerNo }}
                        <van-icon class='arrowIcon' name='arrow' />
                    </p>
                    <!-- <span class='status invert' :class="['status'+customerInfo.kycAuditStatus]">
                        {{ $tm('kycAuditStatus')[customerInfo.kycAuditStatus] }}
                    </span> -->
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
const faceImgDefault = require('@plans/images/face.png')
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
        return {
            ...toRefs(state),
            faceImg,
            userAccountType,
            updateShow,
            customerInfo,
            assets,
            miniAmountText,
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
        margin-top: 3px;
        padding: 3px 4px;
        color: var(--contentColor);
        font-size: rem(22px);
        line-height: 1;
        background: var(--warn);
        border-radius: 3px;
        &.status2 {
            background: var(--success);
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
