<template>
    <span v-if='product.buy_color' class='price'>
        <template v-if="type==='buy' && product.buy_price_diff">
            <i :class='[product.buy_color, buyColorBlack]'>
                {{ product.buy_price_diff[0] || '- -' }}
            </i>
            <i v-if='product.buy_price_diff[1] && product.buy_price' :class='[product.buy_color]'>
                {{ product.buy_price_diff[1] || '- -' }}
            </i>
        </template>
        <template v-else-if="type==='sell' && product.sell_price_diff">
            <i :class='[product.sell_color, sellColorBlack ]'>
                {{ product.sell_price_diff[0] || '- -' }}
            </i>
            <i v-if='product.sell_price_diff[1] && product.sell_price' :class='[product.sell_color]'>
                {{ product.sell_price_diff[1] || '- -' }}
            </i>
        </template>
        <template v-else-if="type==='cur' && product.cur_price_diff">
            <i :class='[product.cur_color, curColorBlack ]'>
                {{ product.cur_price_diff[0] || '- -' }}
            </i>
            <i v-if='product.cur_price_diff[1] && product.cur_price' :class='[product.cur_color]'>
                {{ product.cur_price_diff[1] || '- -' }}
            </i>
        </template>
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    product: {
        type: Object,
        default: () => ({})
    },
    type: {
        type: String,
        default: 'buy'
    }
})

const buyColorBlack = computed(() => {
    const product = props.product
    const buyColor = product.buy_color
    const isBlack = !product.buy_price_highlight && product?.buy_price_diff[1] && ['riseColor', 'fallColor'].includes(buyColor)
    return isBlack && 'blackColor'
})
const sellColorBlack = computed(() => {
    const product = props.product
    const sellColor = product.sell_color
    const isBlack = !product.sell_price_highlight && product?.sell_price_diff[1] && ['riseColor', 'fallColor'].includes(sellColor)
    return isBlack && 'blackColor'
})
const curColorBlack = computed(() => {
    const product = props.product
    const curColor = product.cur_color
    const isBlack = !product.cur_price_highlight && product?.cur_price_diff[1] && ['riseColor', 'fallColor'].includes(curColor)
    return isBlack && 'blackColor'
})
</script>

<style lang="scss" scoped>
.blackColor {
  color: var(--color) !important;
}
</style>
