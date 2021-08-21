<template>
    <div class='assetsInfoWrapper fullPageWrapper'>
        <layoutTop>
            <div>{{ $route.query.currency }}</div>
        </layoutTop>
        <div v-if='account' class='totalAsset'>
            <div class='leftInfo'>
                <p>{{ $t('assets.totalAssets') }}</p>
                <p class='totalAmount'>
                    {{ account.balance }}
                </p>
            </div>
            <div class='rightInfo'>
                <!-- <van-button class='takeMoneyBtn' type='primary' @click="$router.push({ name:'WithdrawCoin' })">
                    {{ $t('coinRecord.take') }}
                </van-button> -->
            </div>
        </div>

        <ul class='assetInfoUl'>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('trade.free') }}</p>
                    <p class='value'>
                        {{ account.available }}
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('assets.frozen') }}</p>
                    <p class='value'>
                        {{ account.frozen }}
                    </p>
                </div>
            </li>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('trade.loan') }}</p>
                    <p class='value'>
                        {{ account.liabilitiesPrincipal }}
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('trade.swap_2') }}</p>
                    <p class='value'>
                        {{ account.interest }}
                    </p>
                </div>
            </li>
            <li class='item'>
                <div class='hd'>
                    <p>{{ $t('assets.maxLoan') }}</p>
                    <p class='value'>
                        {{ account.availableLoan }}
                    </p>
                </div>
                <div class='ft'>
                    <p>{{ $t('withdrawCoin.can') }}</p>
                    <p class='value'>
                        {{ account.withdrawAmount }}
                    </p>
                </div>
            </li>
        </ul>
        <div class='footerBtn'>
            <van-button v-if='Number(tradeType) === 3' block @click='toLoan'>
                {{ $t('trade.loan') }}
            </van-button>
            <van-button block :class="{ 'full': Number(tradeType) === 9 }" @click='toReturnMoney'>
                {{ $t('trade.repayment') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {

    props: ['product'],
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            returnMoneyVisible: false,
            loanVisible: false,
            list: Array(3).fill(),
            tradeType: route.query.tradeType
        })
        const accountList = computed(() => store.state._user.customerInfo?.accountList || [])

        const account = computed(() => {
            return accountList.value.find(item => item.tradeType === Number(state.tradeType) && item.currency === route.query.currency)
        })

        store.dispatch('_user/queryAccountAssetsInfo', {
            tradeType: route.query.tradeType,
            accountId: parseInt(route.query.accountId)
        })

        const toLoan = () => {
            router.push({
                path: '/loan',
                query: {
                    currency: route.query.currency,
                    accountId: parseInt(route.query.accountId),
                    tradeType: route.query.tradeType
                }
            })
        }

        const toReturnMoney = () => {
            router.push({
                path: '/returnMoney',
                query: {
                    currency: route.query.currency,
                    accountId: parseInt(route.query.accountId),
                    tradeType: route.query.tradeType
                }
            })
        }

        return {
            ...toRefs(state),
            accountList,
            account,
            toLoan,
            toReturnMoney
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    .van-button {
        width: 45%;
        height: rem(80px);
        //margin: rem(20px);
        margin-bottom: rem(20px);
        color: #FFF;
        font-size: rem(30px);
        background: var(--primary);
        &.full {
            width: 100%;
            margin: rem(20px);
        }
    }
}
</style>
