<template>
    <div class='page-wrap'>
        <router-view />
        <div class='content-top' :style="'height: '+ contentHeight">
            <div class='quote-wrap'>
                <!-- {{ $t('trade.deal') }} -->
                <sidebarProduct />
            </div>
            <div class='middle-wrap'>
                <div class='chart-content'>
                    <chart />
                </div>
                <div class='trade-content' :style="'height: '+ tradeContentHeight">
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
                    <dealList :symbol-id='product?.symbolId' />
                </div>
            </div>
        </div>
        <div class='orders-wrap'>
            订单
            <p>
                <a href='javascript:;' @click="$router.push($route.path+'/transfer?accountId=1600&tradeType=1')">
                    划转
                </a>
            </p>
        </div>
        <assetsModule />
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import chart from './pages/chart.vue'
import { useRouter, useRoute } from 'vue-router'
import handicap from './pages/handicap.vue'
import dealList from './pages/dealList.vue'
import trade from './pages/trade.vue'
import sidebarProduct from '@planspc/components/sidebarProduct'
import assetsModule from './pages/assets.vue'
import { isEmpty } from '@/utils/util'

import { useStore } from 'vuex'
export default {
    components: {
        chart,
        handicap,
        dealList,
        trade,
        sidebarProduct,
        assetsModule,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { tradeType, symbolId } = route.query
        store.commit('_quote/Update_productActivedID', `${symbolId}_${tradeType}`)
        const product = computed(() => store.getters.productActived)

        if (isEmpty(product.value)) {
            router.push('/')
        }
        const tradeContentHeight = computed(() => {
            if (Number(product.value?.tradeType) === 5) {
                return '265px'
            } else if (Number(product.value?.tradeType) === 3) {
                return '340px'
            } else {
                return '430px'
            }
        })

        const contentHeight = computed(() => {
            if (Number(product.value?.tradeType) === 3) {
                return '785px'
            } else if (Number(product.value?.tradeType) === 5) {
                return '710px'
            } else {
                return '874px'
            }
        })
        return {
            chart,
            product,
            tradeType,
            symbolId,
            tradeContentHeight,
            contentHeight
        }
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
        max-height: 874px;
        display: flex;
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
            // height: 709px;
            display: flex;
            flex-direction: row;
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
                margin-bottom: 8px;
                height: 436px;
                overflow: hidden;

            }
            .trade-content{
                position: relative;
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
