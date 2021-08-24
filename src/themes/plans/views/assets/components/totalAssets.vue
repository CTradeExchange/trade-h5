<template>
    <div class='totalAssets'>
        <div class='totalAssetsBlock'>
            <div class='totalAssetsInfo'>
                <p class='label'>
                    <span> {{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})</span>
                    <span class='tag'>
                        100%低风险
                    </span>
                </p>
                <p class='totalAmount'>
                    {{ assetsInfo?.totalBalance }}
                </p>
            </div>
        </div>
        <ul class='assetList'>
            <li class='item'>
                <p class='muted'>
                    {{ $t('assets.netAssets') }}
                </p>
                <p>{{ assetsInfo.totalNetAssets }}</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('assets.totalLoan') }}
                </p>
                <p>{{ assetsInfo.totalLiabilitiesPrincipal }}</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    {{ $t('trade.swap_2') }}
                </p>
                <p>{{ assetsInfo.totalInterest }}</p>
            </li>
        </ul>

        <div v-if='Number(tradeType) === 3' class='btns'>
            <van-button
                hairline
                size='mini'
                @click='toDesposit'
            >
                {{ $t('trade.desposit') }}
            </van-button>
            <van-button
                hairline
                size='mini'
                @click='toWirhdraw'
            >
                {{ $t('trade.withdraw') }}
            </van-button>
            <van-button
                hairline
                size='mini'
                to='/transfer'
            >
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
    </div>
</template>

<script>
import { computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
    components: {
    },
    setup () {
        const store = useStore()
        const router = useRouter()
        const assetsInfo = computed(() => store.state._user.assetsInfo)
        const tradeType = computed(() => store.state._quote.curTradeType)
        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(tradeType.value)))

        // 跳转充值页面
        const toDesposit = () => {
            if (accountList.value.length > 1) {
                router.push({
                    path: '/despositAccount',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        tradeType: tradeType.value
                    }
                })
            } else {
                router.push({
                    path: '/desposit',
                    query: {
                        accountId: assetsInfo.value.accountId,
                        currency: assetsInfo.value.currency,
                        tradeType: tradeType.value
                    }
                })
            }
        }

        // 跳转提现页面
        const toWirhdraw = () => {
            router.push({
                path: '/withdrawAccount',
                query: {
                    accountId: assetsInfo.value.accountId,
                    tradeType: tradeType.value
                }
            })
        }

        return {
            assetsInfo,
            tradeType,
            toDesposit,
            toWirhdraw
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAssets {
    padding: rem(10px) rem(30px) rem(30px) rem(30px);
    background: var(--contentColor);
    border-radius: 4px;
}
.totalAssetsBlock {
    margin-bottom: rem(60px);
}
.totalAssetsInfo {
    font-size: rem(28px);
    .label {
        display: flex;
        justify-content: space-between;
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        .tag {
            width: rem(140px);
            height: rem(40px);
            color: var(--success);
            font-size: rem(20px);
            line-height: rem(40px);
            text-align: center;
            border: 1px solid var(--success);
            border-radius: rem(6px);
        }
    }
    .totalAmount {
        margin-top: rem(10px);
        color: var(--color);
        font-size: rem(50px);
    }
}
.assetList {
    display: flex;
    flex-flow: row wrap;
    grid-template-columns: auto auto auto;
    align-content: flex-start;
    justify-content: space-around;
    font-size: rem(34px);
    line-height: 1.5;
    .item {
        flex: 50% 1;
        margin-bottom: rem(30px);
    }
    .muted {
        font-size: rem(24px);
    }
}
.btns {
    display: flex;
    .van-button {
        display: block;
        width: 50%;
        height: rem(60px);
        margin-left: rem(30px);
        color: var(--primary);
        font-size: rem(24px);
        line-height: rem(60px);
        background: var(--primaryAssistColor);
        border-color: var(--primaryAssistColor);
        border-radius: rem(6px);
    }
}
</style>
