<template>
    <Top :back='true' :menu='false' title='' />
    <van-search v-model='value' :placeholder="$t('search.keywords')" @cancel='onCancel' @search='onSearch' @update:model-value='onUpdatedSearchValue' />
    <div v-show='categoryShow' class='category-list'>
        <van-cell v-for='(v,i) in productCategoryList' :key='i' is-link :title='v.title' :to="{ path: '/market', query: { code: v.id } }" />
    </div>
    <div class='search-result'>
        <van-cell v-for='(item,index) in searchDataList' :key='index' class='center-align-items' icon='location-o' :title='item.name'>
            <template #icon>
                <van-icon class='icon' name='add-o' @click='addSearchOptional(item)' />
            </template>
        </van-cell>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { getSymbolList, addCustomerOptional } from '@/api/trade'
// import { addCustomerOptional } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { differenceBy } from 'lodash'
import { toRefs, reactive, computed, ref, watch } from 'vue'
import {
    useStore
} from 'vuex'
export default {
    components: {
        Top,
    },
    setup () {
        const state = reactive({
            value: '',
            // show: ref(false),
            categoryShow: true,
            requesNeedParams: {},
            searchDataList: [],
            productCategoryList: [],
            selfSymbolList: [],
        })

        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        const productMap = computed(() => store.state._quote.productMap)
        state.productCategoryList = store.getters.userProductCategory
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)

        const show = ref(false)
        const onUpdatedSearchValue = (value) => {
            state.categoryShow = !value
        }
        const onCancel = () => {
            state.categoryShow = true
        }
        const addOptional = (record) => {
            addCustomerOptional({ symbolList: [{ symbolCode: record.symbolCode, symbolName: record.symbolName, symbolId: record.symbolId }] }).then(res => {
                if (res.code === '0') {
                    state.searchDataList = differenceBy(state.searchDataList, [{ id: record.id }], 'id')
                    store.dispatch('_user/queryCustomerOptionalList')
                }
            })
        }
        const addSearchOptional = (record) => {
            store.dispatch('_user/addCustomerOptionals', [record.id])
        }
        watch(
            () => selfSymbolList.value.length,
            () => {
                state.searchDataList = differenceBy(state.searchDataList, selfSymbolList.value.map(el => ({
                    id: el.symbolId,
                    code: el.symbolCode,
                    name: el.symbolName
                })), 'id')
            }
        )
        const onSearch = (val) => {
            state.value = val
            if (!isEmpty(customInfo)) {
                const params = {
                    companyId: customInfo.value.companyId,
                    customerGroupId: customInfo.value.customerGroupId,
                    name: state.value
                }
                getSymbolList(params).then(res => {
                    const { data, code } = res
                    if (code === '0' && Array.isArray(data)) {
                        state.searchDataList = differenceBy(data.filter(el => productMap.value[el.id]), selfSymbolList.value.map(el => ({
                            id: el.symbolId,
                            code: el.symbolCode,
                            name: el.symbolName
                        })), 'id')
                    }
                }).catch(err => {

                })
            }
        }

        /**
         * store.getters.userProductCategory 板块分类
         * store.state._quote  行情产品数据
         */
        return {
            ...toRefs(state),
            onSearch,
            onCancel,
            addOptional,
            addSearchOptional,
            show,
            selfSymbolList,
            onUpdatedSearchValue,
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
