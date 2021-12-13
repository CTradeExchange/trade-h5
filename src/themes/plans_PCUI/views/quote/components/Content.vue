<template>
    <div class='content'>
        <div class='header'>
            <PlansType v-model='tradeType' />
            <Autocomplete :trade-type='tradeType' />
        </div>
        <CategoryList v-model='categoryType' :list='computedCategoryList' />
        <ProductList v-if='tradeType' :list='productList' :trade-type='tradeType' />
    </div>
</template>

<script setup>
import { ref, watch, unref, computed } from 'vue'
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

const computedCategoryList = computed((el) => {
    const list = [...unref(categoryList)]
    list.forEach(el => {
        if (el.id === 'selfSymbol') {
            el.slot = {
                label: <div>
                            <span class="icon iconfont icon_lansezixuan"></span>
                            <span>
                                {el.title}
                            </span>
                        </div>
            }
        }
    })
    return list
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
    border-radius: 10px;
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
            height: 3px;
            background-color: var(--assistColor);
            z-index: var(--el-index-normal);
        }
    }
    .icon_lansezixuan{
        margin-right: 5px;
        font-size: 14px;
    }
}
</style>
