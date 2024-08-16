<template>
    <van-popup class='product-search-popup' :duration='0' :overlay='false' :show='productSearchVisible'>
        <productSearch />
    </van-popup>
</template>

<script setup>
import productSearch from './index'
import { useStore } from 'vuex'
import { computed } from 'vue'
const store = useStore()
const productSearchVisible = computed(() => store.state._trade.productSearchVisible)
</script>

<style lang="scss">
.product-search-popup {
    position: absolute;
    left: -1px;
    top: 60px;
    transform: none;
    height: calc(100vh - 138px);
    min-height: 300px;
    width: 350px;
    animation: unset;
    border-radius: 0;
    box-shadow: unset;
    background-color: var(--contentColor);
    border: 1px solid var(--lineColor);
    z-index: 10 !important;
}
</style>
