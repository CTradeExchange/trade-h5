<template>
    <div class='page-wrap'>
        <router-view />
        <div class='content-top'>
            <div class='quote-wrap'>
                {{ $t('trade.deal') }}
            </div>
            <div class='middle-wrap'>
                <div class='chart-content'>
                    <chart />
                </div>
                <div class='trade-content'>
                    <trade />
                </div>
            </div>
            <div v-if='Number(tradeType) === 5' class='right-wrap'>
                <!-- 盘口报价 -->
                <div class='handicap-content'>
                    <handicap :product='product' />
                </div>
                <!-- 实时成交记录 -->
                <div class='deal-content'>
                    <dealList :symbol-id='product.symbolId' />
                </div>
            </div>
        </div>
        <div class='orders-wrap'>
            订单
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import chart from './pages/chart.vue'
import { useRouter, useRoute } from 'vue-router'
import handicap from './pages/handicap.vue'
import dealList from './pages/dealList.vue'
import trade from './pages/trade.vue'

import { useStore } from 'vuex'
export default {
    components: {
        chart,
        handicap,
        dealList,
        trade
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const { tradeType, symbolId } = route.query
        store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        const product = computed(() => store.getters.productActived)
        return { chart, product, tradeType, symbolId }
    },
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.page-wrap {
    font-size: 14px;
    padding:  8px;
    background: var(--bgColor);

    .content-top {
        min-height: 710px;
        display: flex;
        //justify-content: space-evenly;
        justify-content: space-between;

        >div {
            margin-right: 8px;
            border-radius: 10px;
            background: var(--contentColor);
            &:last-child{
                margin-right: 0;
            }
        }

        .quote-wrap {
            width: 360px;
        }

        .middle-wrap {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: var(--bgColor);
            >div{
                 border-radius: 10px;
                 background: var(--contentColor);
            }
            .chart-content{
                //padding: 10px;
            }
            .trade-content{
                position: relative;
                margin-top: 8px;
                height: 458px;
                padding: 5px 16px 20px 16px;
            }
        }

        .right-wrap {

            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 280px;
            background: var(--bgColor);
            >div{
                border-radius: 10px;
                background: var(--contentColor);
            }
            .handicap-content{
                padding: 10px 0 8px 16px;
                height: 368px;

            }
            .deal-content{
                padding: 10px 16px 10px 16px;
                height: 333px;
                overflow:hidden
            }
        }
    }
    .orders-wrap{
        margin-top: 8px;
        min-height: 300px;
        background: var(--contentColor);
        }
}
</style>
