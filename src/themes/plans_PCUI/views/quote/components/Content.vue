<template>
    <div class='content'>
        <div class='header'>
            <PlansType v-model='tradeType' />
            <Autocomplete :trade-type='tradeType' />
        </div>
        <CategoryList v-model='categoryType' :list='categoryList' />
        <ProductList :list='productList' :trade-type='tradeType' />
    </div>
</template>

<script setup>
import { ref, watch, unref } from 'vue'
import PlansType from './PlansType'
import useProduct from '@plans/hooks/useProduct'
import ProductList from './ProductList'
import CategoryList from './CategoryList'
import Autocomplete from './Autocomplete'
const tradeType = ref('')

// 获取板块列表和所选板块的产品列表
const categoryType = ref('0')
const { categoryList, productList } = useProduct({
    tradeType, categoryType
})
watch(() => unref(tradeType), () => {
    categoryType.value = '0'
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.content{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    background: var(--contentColor);
    .header{
        position: relative;
        flex: 0 0 56px;
        line-height: 56px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 20px;
        &::after{
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 100%;
            height: 2px;
            background-color: var(--lineColor);
            z-index: var(--el-index-normal);
        }

    }
}
</style>
