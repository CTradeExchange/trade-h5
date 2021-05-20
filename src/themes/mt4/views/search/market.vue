<template>
    <Top :back='true' :menu='false' title='' />
    <div class='category-product-list'>
        <van-cell v-for='(val,idx) in categoryProductList' :key='idx' is-link :title='val.symbolName' :to="{ path: '/contract', query: { symbolId: val.symbolId } }">
            <template #icon>
                <van-icon class='icon' name='add-o' @click.stop='addOptional(val)' />
            </template>
        </van-cell>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { addCustomerOptional } from '@/api/trade'
import { find, forOwn, differenceBy } from 'lodash'
export default {
    components: {
        Top,
    },
    setup (props) {
        const route = useRoute()
        const state = reactive({
            code: route.query.code,
            categoryShow: true,
            requesNeedParams: {},
            searchDataList: [],
            productCategoryList: [],
            categoryProductList: [],
            selfSymbolList: [],
            quoteProductMap: {}
        })
        const store = useStore()
        store.dispatch('_user/queryCustomerOptionalList')
        // debugger
        state.productCategoryList = store.getters.userProductCategory
        state.quoteProductMap = store.state._quote.productMap
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        const currentCategory = find(state.productCategoryList, ['id', state.code])
        if (currentCategory?.code_ids) {
            const productList = []
            forOwn(currentCategory.code_ids, (value) => {
                if (state.quoteProductMap[value]) {
                    productList.push(state.quoteProductMap[value])
                }
            })
            // debugger
            state.categoryProductList = differenceBy(productList, selfSymbolList.value, 'symbolId')
        }
        watch(selfSymbolList.value.length, () => {
            state.categoryProductList = differenceBy(state.categoryProductList, selfSymbolList.value, 'symbolId')
            // val && localStorage.setItem('symbolIdForChart', val.value)
        })
        const addOptional = (record) => {
            addCustomerOptional({ symbolList: [record.symbolId] }).then(res => {
                if (res.code === '0') {
                    state.searchDataList = differenceBy(state.searchDataList, [{ id: record.id }], 'id')
                    store.dispatch('_user/queryCustomerOptionalList')
                }
            })
        }
        return {
            ...toRefs(state),
            selfSymbolList,
            addOptional
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.center-align-items,
.category-product-list {
    align-items: center;
    .icon {
        margin-right: rem(20px);
        color: var(--success);
    }
    .van-cell {
        align-items: center;
    }
}

</style>
