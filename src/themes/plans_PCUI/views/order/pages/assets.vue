<template>
    <section v-if='$store.state._user.customerInfo' class='assetsModule'>
        <h2 class='tradeTypeName'>
            {{ tradeTypeNames[tradeType] }}
        </h2>
        <!-- 合约全仓 -->
        <div v-if="tradeType==='1'" class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.balance') }}({{ accountTradeType1.currency }})</p>
                <p class='amount'>
                    {{ accountTradeType1.balance }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.jingzhi') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.netWorth || '--' }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.marginLevel') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.marginRadio }}%
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.freeMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.availableMargin || '--' }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.originalMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType1?.occupyMargin || '--' }}
                </p>
            </div>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
        <!-- 合约逐仓 -->
        <div v-else-if="tradeType==='2'" class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.freeMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType2?.availableMargin || '--' }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.allOriginalMargin') }}</p>
                <p class='amount'>
                    {{ accountTradeType2?.occupyMargin || '--' }}
                </p>
            </div>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
        <!-- 杠杆全仓 -->
        <div v-else-if="tradeType==='3'" class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})</p>
                <p class='amount'>
                    {{ assetsInfo.totalBalance }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.netAssets') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.totalNetAssets }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('assets.totalLoan') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.totalLiabilitiesPrincipal }}
                </p>
            </div>
            <div class='assetItem'>
                <p>{{ $t('trade.swap_2') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.totalInterest }}
                </p>
            </div>
            <div class='assetItem riskRate'>
                <p>{{ $t('assets.riskLevel') }}</p>
                <p class='amount'>
                    {{ assetsInfo?.closeProportion }}
                </p>
            </div>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.loan') }}
            </van-button>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.repayment') }}
            </van-button>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
        <!-- 现货撮合 -->
        <div v-else-if="tradeType==='5'" class='rightActions'>
            <div class='assetItem'>
                <p>{{ $t('assets.totalAssets') }}({{ assetsInfo?.currency }})</p>
                <p class='amount'>
                    {{ assetsInfo.totalBalance }}
                </p>
            </div>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.desposit') }}
            </van-button>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.withdraw') }}
            </van-button>
            <van-button class='btn' type='primary' @click="$router.push($route.path+'/transfer?tradeType='+tradeType)">
                {{ $t('trade.transfer') }}
            </van-button>
        </div>
    </section>
</template>

<script>
import { reactive, computed, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MsgSocket } from '@/plugins/socket/socket'
import { isEmpty } from '@/utils/util'
export default {
    setup () {
        const store = useStore()
        const route = useRoute()
        const { t, tm } = useI18n({ useScope: 'global' })
        const tradeTypeNames = tm('tradeType')
        const { tradeType } = route.query

        // 3,5,9玩法资产
        const assetsInfo = computed(() => (store.state._user.assetsInfo[tradeType] || {}))

        // 合约全仓资产
        const accountTradeType1 = computed(() => {
            const accountAssets = store.state._user.accountAssets['1']
            const account = store.state._user.customerInfo?.accountList?.find(el => el.tradeType === parseInt(tradeType))
            return Object.assign({}, account, accountAssets)
        })

        // 合约逐仓资产
        const accountTradeType2 = computed(() => store.state._user.accountAssets['2'])
        const customerInfo = computed(() => store.state._user.customerInfo)

        watch(
            () => tradeType,
            newval => {
                if (!isEmpty(customerInfo.value)) {
                    // 订阅资产数据
                    MsgSocket.subscribedListAdd(function () {
                        MsgSocket.subscribeAsset(tradeType)
                    })
                    // store.dispatch('_user/queryCustomerAssetsInfo', { tradeType })
                }
            },
            { immediate: true }
        )

        onUnmounted(() => {
            MsgSocket.cancelSubscribeAsset()
        })

        return {
            tradeType,
            tradeTypeNames,
            assetsInfo,
            accountTradeType1,
            accountTradeType2,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsModule{
    margin-top: 8px;
    height: 60px;
    background: var(--contentColor);
    color: var(--color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    .tradeTypeName{
        line-height: 60px;
        font-size: 16px;
    }
    .rightActions{
        display: flex;
    }
    .assetItem{
        padding-right: 60px;
        line-height: 1.2;
        color: var(--minorColor);
        font-size: 12px;
        .amount{
            color: var(--color);
            font-size: 14px;
        }
    }
    .riskRate{
        .amount{
            color: var(--success);
        }
    }
    .btn{
        height: 32px;
        line-height: 32px;
        background: var(--primaryAssistColor);
        color: var(--primary);
        border: transparent;
        margin-left: 10px;
        min-width: 80px;
    }
}
</style>
