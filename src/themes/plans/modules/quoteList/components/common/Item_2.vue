<template>
    <div v-if='props.showTitle' class='van-hairline--bottom row title'>
        <span class='th'>
            {{ $t("trade.nameCode") }}
        </span>
        <span class='th textRight'>
        </span>
        <span class='th textRight'>
            {{ $t("trade.positionLastPrice") }}
        </span>
    </div>
    <productListComp
        ref='listBodyEl'
        class='listBody'
        :product-list='props.productList'
    >
        <template #default='{ product, open }'>
            <div class='row product of-1px-bottom' @click='open'>
                <div class='val'>
                    <span
                        class='symbolName'
                        :class="[
                            getLen(product.symbolName) > 10 && 'small',
                            getLen(product.symbolName) > 15 && 'mini',
                        ]"
                    >
                        {{ product.symbolName }}
                    </span>
                    <span class='symbolCode'>
                        {{ product.symbolCode }}
                    </span>
                </div>
                <span class='val'>
                    <klineSvg :data='!h5Preview ? product?.kline_list: productKlineList' :height='30' :product='product' :width='90' />
                </span>

                <template v-if='product.cur_price'>
                    <div
                        class='val textRight'
                        :class='["whiteColor","digits" + product.price_digits]'
                    >
                        <span
                            class='txt'
                            :style='{ background: styleColor[product.upDownColor] }'
                        >
                            {{ formatPrice(product.cur_price) }}
                        </span>
                        <span
                            class='upDownWidth'
                            :class="[
                                product.upDownColor,
                                'digits' + product.price_digits,
                            ]"
                        >
                            {{ product.upDownWidth || "- -" }}
                        </span>
                    </div>
                </template>
                <template v-else>
                    <span class='val'>
                        - -
                    </span>
                </template>
            </div>
        </template>
    </productListComp>
</template>

<script setup>
import { computed, watch, ref, onMounted, unref } from 'vue'
import productListComp from '@plans/modules/productList/productList.vue'
import { getLen, debounce } from '@/utils/util'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import klineSvg from '@plans/components/klineSvg.vue'
import { getScreenList } from '@/utils/dom'
import { productKlineList } from '../dataConfig'

const store = useStore()
const props = defineProps({
    productList: {
        type: Object,
        default: null,
    },
    showTitle: {
        type: Boolean,
        default: true,
    },
    shouldFresh: {
        type: Boolean,
        default: false,
    }
})
const styleColor = computed(() => store._state.data.style || {})
const formatPrice = (val) => {
    return !isNaN(val * 1) ? val : '- -'
}
const h5Preview = process.env.VUE_APP_h5Preview
const listBodyEl = ref(null)

const subscribeTrendData = () => {
    const subscribeTrendLines = debounce(() => {
        const list = getScreenList(unref(listBodyEl).$el, '.row', props.productList)
        const subscribList = list.map(item => {
            return {
                symbol_id: item.symbolId,
                trade_type: item.tradeType,
                trade_mode: item.dealMode,
                kline_type: 4,
                query_kline_num: 50,
                kline_timestamp_end: Math.round(new Date().getTime() / 1000).toString()
            }
        })
        subscribList.length && QuoteSocket.batchGetKlineData(subscribList)
    })

    watch(() => props.shouldFresh, (val) => {
        if (val) {
            subscribeTrendLines()
        }
    })
    unref(listBodyEl) && unref(listBodyEl).$el.addEventListener('scroll', subscribeTrendLines, false)

    subscribeTrendLines()
}

if (!h5Preview) {
    onMounted(() => {
        subscribeTrendData()
    })
}

</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";

.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    padding: 0 rem(30px);
    background-color: var(--contentColor);
    &.title {
        color: var(--minorColor);
        font-size: rem(20px);
        height: rem(60px);
        line-height: rem(60px);
    }
    &.product {
        height: rem(116px);
        line-height: rem(116px);
    }
    .th:nth-child(1),
    .val:nth-child(1) {
        flex: 1;
    }
    .th:nth-child(2),
    .val:nth-child(2) {
        flex: 0 0 rem(210px);
    }
    .th:nth-child(3),
    .val:nth-child(3) {
        flex: 0 0 rem(210px);
    }

    .val:nth-child(1) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        @include ellipsis();
        color: var(--color);
        font-weight: 400;
        font-size: rem(30px);
        &.small {
            font-size: rem(26px);
        }
        &.mini {
            font-size: rem(22px);
        }

        .symbolName {
            line-height: rem(45px);
        }
        .symbolCode {
            line-height: rem(26px);
            color: var(--minorColor);
            font-size: rem(22px);
        }
    }

    .val:nth-child(2),
    .val:nth-child(3) {
        font-size: rem(30px);
    }
    .val:nth-child(2){
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .val:nth-child(3) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        .txt {
            line-height: rem(45px);
            padding: rem(5px) rem(10px);
            border-radius: rem(10px);
        }
        .upDownWidth {
            margin-top: rem(6px);
            line-height: rem(26px);
            font-size: rem(24px);
        }
    }
}

.digits11,
.digits12,
.digits13 {
    font-size: rem(26px);
}
.digits14,
.digits15,
.digits16 {
    font-size: rem(22px);
}

.textRight {
    text-align: right;
}

.listBody{
    flex: 1;
    overflow-y: auto;
}

.whiteColor{
    color: #fff;
}

</style>
