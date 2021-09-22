<template>
    <div class='totalAssets'>
        <div class='totalAssetsBlock'>
            <div class='totalAssetsInfo'>
                <div class='label'>
                    <div class='left'>
                        <span class='total'>
                            {{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})
                        </span>
                        <span v-if='Number(tradeType) !== 5' class='tag'>
                            {{ $t('assets.riskLevel') }} {{ assetsInfo?.closeProportion }}
                        </span>
                    </div>
                    <i class='icon_zijinmingxi2' @click="$router.push({ name:'Record',query:{ tradeType:tradeType, accountId:assetsInfo.accountId } })"></i>
                </div>
                <div class='totalAmount'>
                    {{ assetsInfo?.totalBalance }}
                </div>
            </div>
        </div>
        <ul v-if='Number(tradeType) !== 5' class='assetList'>
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

        <div v-if='[3,5].includes(Number(tradeType))' class='btns'>
            <van-button
                hairline
                size='mini'
                @click='toDesposit'
            >
                {{ $t('trade.loan') }}
            </van-button>
            <van-button
                hairline
                size='mini'
                @click='toWirhdraw'
            >
                {{ $t('trade.repayment') }}
            </van-button>
            <van-button
                hairline
                size='mini'
                @click='toTransfer'
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
        // 获取玩法列表
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)
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

        // 跳转划转记录
        const toTransfer = () => {
            router.push({
                path: '/transfer',
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
            toTransfer,
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
        align-items: center;
        justify-content: space-between;
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
        .tag {
            height: rem(40px);
            margin-left: rem(10px);
            padding: rem(5px) rem(10px);
            color: var(--success);
            font-size: rem(20px);
            line-height: rem(40px);
            text-align: center;
            border: 1px solid var(--success);
            border-radius: rem(6px);
        }
    }
    .icon_zijinmingxi2 {
        color: var(--color);
        font-size: rem(32px);
    }
    .totalAmount {
        margin-top: rem(20px);
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
    height: rem(65px);
    :deep(.van-button) {
        display: block;
        width: 50%;
        height: 100%;
        margin-right: rem(20px);
        color: var(--primary);
        font-size: rem(28px);
        line-height: rem(70px);
        background: var(--primaryAssistColor);
        border: none;
        border-color: var(--primaryAssistColor);
        border-radius: rem(6px);
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
