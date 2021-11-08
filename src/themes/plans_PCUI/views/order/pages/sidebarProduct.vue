<template>
    <div class='sidebarProduct'>
        <search
            :trade-type='tradeType'
            @onInput='onInput'
            @onSearch='onSearch'
        >
            <template v-if='searching' #default>
                <ProductList :list='searchList' />
            </template>
            <!-- 搜索结果 -->
            <template v-else #default>
                <TopTab
                    v-model='categoryType'
                    :list='categoryList'
                />
                <ProductList :list='productList' />
            </template>
        </search>
    </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useStore } from 'vuex'
import useProduct from '@planspc/hooks/useProduct'
import search from './components/search'
import TopTab from './components/topTab'
import ProductList from './components/ProductList'

const store = useStore()
const productActived = computed(() => store.getters.productActived)
// 玩法类型
const tradeType = computed(() => String(unref(productActived).tradeType))
// 板块类型
const categoryType = ref(0)
// 获取板块列表和所选板块的产品列表
const { categoryList, productList } = useProduct({
    tradeType, categoryType
})

const searching = ref(false)
const searchList = ref([])
const onSearch = (result) => {
    searchList.value = result.map(e => ({
        ...e,
        symbolId: e.id,
        symbolKey: unref(tradeType) + '_' + e.id,
        tradeType: unref(tradeType),
        symbolCode: e.code
    }))
}
const onInput = (val) => {
    searching.value = !!val
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.sidebarProduct {
    width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
    background: var(--contentColor);
    border-radius: 10px;
    padding: 16px 0;
    .margin {
        margin-top: rem(30px);
    }
}
</style>
