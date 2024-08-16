<template>
    <div v-if='product' class='flex justify-space-between items-center px-4 h-14 bg-contentColor'>
        <div class='flex items-center van-hairline--right pr-2' @click="$store.commit('_trade/Update_productSearchVisible', true)">
            <productIcon :symbol-key='product.symbolKey' />
            <span class='ml-3 font-bold text-xl'>
                {{ product.symbolName }}
            </span>
            <img alt='arrow' class='mx-3' :class="[productSearchVisible ? 'rotate--180 ' : 'rotate--0']" src='/images/arrow.svg' />
        </div>
        <div class='text-right min-w-30 ml-auto'>
            <p class='text-lg font-bold' :class='product?.cur_color'>
                {{
                    product?.cur_price
                        ? product.cur_price === 'NaN'
                            ? '--'
                            : parseFloat(product?.cur_price).toFixed(product.symbolDigits)
                        : '--'
                }}
            </p>

            <p :class='product?.upDownColor'>
                {{ product?.rolling_upDownWidth ? product.rolling_upDownWidth : '--' }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import productIcon from '@/components/product-icon.vue'

const store = useStore()
const productSearchVisible = computed(() => store.state._trade.productSearchVisible)
const product = computed(() => store.getters.productActived)
</script>
