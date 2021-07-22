<template>
    <div class='assetsInfoWrapper fullPageWrapper'>
        <layoutTop>
            <div>USDT</div>
        </layoutTop>
        <div class='totalAsset'>
            <div class='leftInfo'>
                <p>{{ $t('assets.totalAssets') }}</p>
                <p class='totalAmount'>
                    223423.12
                </p>
            </div>
            <div class='rightInfo'>
                <van-button class='takeMoneyBtn' type='primary' @click="$router.push({ name:'WithdrawCoin' })">
                    {{ $t('coinRecord.take') }}
                </van-button>
            </div>
        </div>

        <ul class='assetInfoUl'>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('trade.free') }}</p>
                    <p class='value'>
                        100000.000
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('assets.frozen') }}</p>
                    <p class='value'>
                        100000.000
                    </p>
                </div>
            </li>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('trade.loan') }}</p>
                    <p class='value'>
                        100000.000
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('trade.swap_2') }}</p>
                    <p class='value'>
                        100000.000
                    </p>
                </div>
            </li>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('assets.maxLoan') }}</p>
                    <p class='value'>
                        100000.000
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('withdrawCoin.can') }}</p>
                    <p class='value'>
                        100000.000
                    </p>
                </div>
            </li>
        </ul>
        <div class='footerBtn'>
            <van-button block type='primary' @click='returnMoneyVisible=true'>
                {{ $t('route.returnMoney') }}
            </van-button>
        </div>
        <ReturnMoney v-model='returnMoneyVisible' />
    </div>
</template>

<script>
import ReturnMoney from './components/returnMoney.vue'
import { reactive, toRefs } from '@vue/reactivity'
// import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
        ReturnMoney
    },
    props: ['product'],
    setup () {
        const store = useStore()
        const state = reactive({
            returnMoneyVisible: false,
            list: Array(3).fill()
        })
        store.dispatch('_user/queryAccountAssetsInfo')
        return {
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAsset {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: rem(20px);
    padding: rem(30px);
    color: var(--minorColor);
    line-height: 1.5;
    background: var(--contentColor);
    border-radius: 4px;
    .totalAmount {
        color: var(--color);
        font-size: rem(50px);
    }
    .takeMoneyBtn {
        height: rem(48px);
        color: var(--primary);
        --van-button-primary-background-color: var(--primaryAssistColor);
        --van-button-primary-border-color: var(--primaryAssistColor);
    }
}
.assetInfoUl {
    margin: rem(20px);
    background: var(--contentColor);
    border-radius: 4px;
    .item {
        display: flex;
        justify-content: space-between;
        padding: rem(30px);
        color: var(--normalColor);
        font-size: rem(24px);
        line-height: 1.4;
        border-bottom: 1px solid var(--lineColor);
        &:last-child {
            border-bottom: 0;
        }
        .ft {
            text-align: right;
        }
        .value {
            color: var(--minorColor);
            font-size: rem(30px);
        }
    }
}
.footerBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>
