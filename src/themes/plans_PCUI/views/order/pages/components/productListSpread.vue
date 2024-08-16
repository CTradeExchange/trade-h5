<template>
    <div class='listWrap'>
        <div v-if='showListHead === true' class='listHead' :style='[scrollBarWidth && { paddingRight: "20px" }]'>
            <span class='name'>
                {{ $t('trade.name') }}/{{ $t('contract.spread') }}
                <popover placement='bottom' :text="[$t('trade.spreadIntro1'), $t('trade.spreadIntro2')]">
                    <template #reference>
                        <van-icon class='questionIcon' name='question-o' />
                    </template>
                </popover>
            </span>
            <span class='sellPrice'>
                {{ $t('trade.sellPrice') }}
            </span>
            <span class='buyPrice'>
                {{ $t('trade.buyPrice') }}
            </span>
        </div>
        <slot name='tHead'></slot>
        <div ref='productListEl' class='items' :style='[scrollBarWidth && { paddingRight: 0 }]'>
            <div
                v-for='(item, index) in productList'
                :key='item.id'
                class='item li'
                :class='[item.symbolKey === productActived.symbolKey && "active"]'
                @click='onClick(item)'
            >
                <!-- <i v-if='isCollect(item.tradeType,item.symbolId)' class='icon icon_hangqingliebiaoyijiazixuan' @click.stop='addOptional(item)'></i>
                <i v-else class='icon icon_hangqingliebiaoweijiazixuan' @click.stop='addOptional(item)'></i> -->
                <div class='box'>
                    <span :id="index === 0 ? 'first-element-driver' : ''" class='name'>
                        {{ item.symbolName }}
                    </span>
                    <ETF v-if='productMap[item.symbolKey].etf' />
                    <span class='spread muted'>
                        {{ $t('contract.spread') }}:
                        {{ item.spread_text }}
                    </span>
                </div>
                <p class='price sellPrice' :class="['num'+item.sell_price?.length]">
                    <PriceColor :product='item' type='sell' />
                </p>
                <p class='buyPrice' :class="['num'+item.buy_price?.length]">
                    <PriceColor :product='item' type='buy' />
                </p>
            </div>
        </div>
        <div ref='popoverRef'></div>
    </div>
</template>

<script setup>
import ETF from '@planspc/components/etfIcon'
import { ref, watch, nextTick, computed, defineProps, defineEmits, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import subscribeProducts from '@planspc/hooks/subscribeProducts'
import { useRouter, useRoute } from 'vue-router'
import PriceColor from '@/themeCommon/components/priceColor.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const popoverRef = ref(null)
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    categoryType: {
        type: String,
        default: '0'
    },
    // 显示头部
    showListHead: {
        type: Boolean,
        default: true,
    }
})
const productList = computed(() => {
    // 按照后台产品顺序排序
    const list = props.list.slice(0)
    if (props.categoryType > 0) {
        list.sort((a, b) => {
            return a.sortNum - b.sortNum
        })
    }

    return list
})
const productMap = computed(() => store.state._quote.productMap)
const productActived = computed(() => store.getters.productActived)

// 监听列表滚动，订阅/获取产品数据
const { productListEl } = subscribeProducts(productList)

// 切换当前选中产品
const emit = defineEmits(['item-click'])
const onClick = product => {
    store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
    router.replace({
        query: {
            ...route.query,
            name: product.symbolName.replace(/ /g, '_'),
            symbolId: product.symbolId,
            tradeType: product.tradeType
        }
    })
    emit('item-click', product)
}

// watch(() => subscribList.value, () => {
//     QuoteSocket.add_subscribe({ moduleId: 'productList', symbolKeys: subscribList.value })
// }, {
//     immediate: true,
//     deep: true
// })

/** 监听是否存在滚动条，调整样式 */
const scrollBarWidth = ref(0)
watch(() => [props.list.length], async () => {
    await nextTick()
    if (productListEl && props.list.length) {
        scrollBarWidth.value = productListEl.value.offsetWidth - productListEl.value.clientWidth
    }
}, { immediate: true })
/** 监听是否存在滚动条，调整样式 */

// 定时检查产品列表的报价时间，800ms之前的报价显示黑色
const checkTickTime = () => {
    const curTime = Date.now()
    const diffTime = 800
    props.list.forEach(el => {
        const tick_time = el.tick_time
        if (curTime - tick_time > diffTime) {
            store.commit('_quote/Update_priceHighlight', el)
        }
    })
}
const intervalTimer = setInterval(checkTickTime, 50)

onBeforeUnmount(() => {
    clearInterval(intervalTimer)
})
</script>

<style lang="scss" scoped>
.listWrap {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    margin-top: 9px;
    overflow: hidden;
    color: var(--color);
    font-size: rem(30px);
    line-height: rem(32px);
    .item {
        display: flex;
        align-items: center;
        user-select: none;
        .icon {
            margin-right: 5px;
        }
        .sellPrice {
            flex: 1;
            text-align: right;
            padding-bottom: 16px;
        }
        .buyPrice {
            width: 85px;
            text-align: right;
            line-height: 20px;
            padding-bottom: 16px;
        }
        .spread {
            display: block;
            padding-top: 2px;
            font-weight: normal;
            line-height: 20px;
            font-size: 12px;
            line-height: 14px;
        }
    }
    .listHead {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 8px;
        color: var(--minorColor);
        font-size: 12px;
        line-height: 26px;
        .name {
            flex: 1;
        }
        .buyPrice {
            width: 85px;
            text-align: right;
        }
        .questionIcon {
            font-weight: normal;
            font-size: rem(32px);
            vertical-align: -1px;
            cursor: pointer;
        }
    }
    .items {
        flex: 1;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .li {
            height: 50px;
            padding: 0 8px;
            font-size: 12px;
            cursor: pointer;
            .name {
                color: var(--color);
                font-weight: 400;
                font-size: 12px;
                line-height: 20px;
                white-space: pre;
            }
            .sellPrice,
            .buyPrice {
                font-size: 12px;
                line-height: 20px;
                &.num10 {
                    font-size: 12px;
                }
                &.num12 {
                    font-size: 12px;
                }
            }
            .spread {
                font-weight: normal;
                font-size: 12px;
            }
            .box {
                max-width: 40%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &.active,
            &:hover {
                background: var(--primaryAssistColor);
                border-radius: 4px;
            }
            :deep(.etfIcon) {
                margin-top: 2px;
            }
        }
    }
}

</style>
