<template>
    <div class='side-bar'>
        <section>
            <div>
                <ul class='nav-menu'>
                    <li v-for='(item, index) in fundProductList' :key='index' class='item'>
                        <a href='javascript:;'>
                            <currency-icon class='item-icon' :currency='item.shareTokenCode' />
                            <div class='item-text'>
                                <p class='item-tag'>
                                    CRYPTO
                                </p>
                                <p class='item-name'>
                                    {{ item.shareTokenCode }}
                                </p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFund } from '../hooks.js'
import currencyIcon from '@/components/currencyIcon.vue'

// 获取基金产品列表
const { getFundList, fundProductList } = useFund()

// 获取基金产品列表数据
const getProductList = () => {
    getFundList()
}

onMounted(() => {
    // 获取基金产品列表数据
    getProductList()
})
</script>

<style lang='scss' scoped>
@import "@/sass/mixin.scss";
.side-bar {
    width: 256px;
    height: 100%;
    background: var(--contentColor);
}
</style>
