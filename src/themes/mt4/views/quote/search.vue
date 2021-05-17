<template>
    <Top :back='true' :menu='false' title='' />
    <van-search v-model='value' placeholder='请输入搜索关键词' @cancel='onCancel' @search='onSearch' @update:model-value='onUpdatedSearchValue' />
    <div v-show='categoryShow' class='category-list'>
        <van-cell v-for='(v,i) in productCategoryList' :key='i' is-link :title='v.title' @click='showPopup(v.id)' />
    </div>
    <div class='search-result'>
        <van-cell v-for='(item,index) in searchDataList' :key='index' class='center-align-items' icon='location-o' :title='item.name'>
            <template #icon>
                <van-icon class='icon' name='add-o' @click='addSearchOptional(item)' />
            </template>
        </van-cell>
    </div>

    <van-popup v-model:show='show' closeable position='right' :style="{ height: '100%',width:'100%' }">
        <div class='category-product-list'>
            <van-cell v-for='(val,idx) in categoryProductList' :key='idx' is-link :title='val.symbolName' :to="{ path: '/contract', query: { symbolId: val.symbolId } }">
                <template #icon>
                    <van-icon class='icon' name='add-o' @click.stop='addOptional(val)' />
                </template>
            </van-cell>
        </div>
    </van-popup>
</template>

<script>
import Top from '@m/layout/top'
import { getSymbolList, addCustomerOptional } from '@/api/trade'
// import { addCustomerOptional } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { find, forOwn, differenceBy } from 'lodash'
import { toRefs, reactive, computed, onBeforeMount, ref } from 'vue'
import {
    useStore
} from 'vuex'
export default {
    components: {
        Top,
    },
    setup (props) {
        const state = reactive({
            value: '',
            // show: ref(false),
            categoryShow: true,
            requesNeedParams: {},
            searchDataList: [],
            productCategoryList: [],
            categoryProductList: [],
            selfSymbolList: [],
            quoteProductMap: {}
        })

        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        state.productCategoryList = store.getters.userProductCategory
        state.quoteProductMap = store.state._quote.productMap
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        // onBeforeMount(() => {
        //     // const params = {}
        //     // getSymbolList(params).then(res => {

        //     // }).catch(err => {

        //     // })
        // })

        const show = ref(false)
        const showPopup = (id) => {
            const currentCategory = find(state.productCategoryList, ['id', id])
            if (currentCategory?.code_ids) {
                const productList = []
                forOwn(currentCategory.code_ids, (value, key) => {
                    if (state.quoteProductMap[value]) {
                        productList.push(state.quoteProductMap[value])
                    }
                })
                // debugger
                state.categoryProductList = differenceBy(productList, selfSymbolList.value, 'symbolId')
            }
            show.value = true
        }
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
            addCustomerOptional({ symbolList: [{ symbolCode: record.code, symbolName: record.name, symbolId: record.id }] }).then(res => {
                if (res.code === '0') {
                    state.categoryProductList = differenceBy(state.categoryProductList, [{ symbolId: record.symbolId }], 'symbolId')
                    store.dispatch('_user/queryCustomerOptionalList')
                }
            })
        }
        const onSearch = (val) => {
            state.value = val

            // const registerData = sessionStorage.getItem('RegisterData')
            if (!isEmpty(customInfo)) {
                // const { companyId, customerGroupId } = JSON.parse(registerData).data
                const params = {
                    companyId: customInfo.value.companyId,
                    customerGroupId: customInfo.value.customerGroupId,
                    name: state.value
                }
                getSymbolList(params).then(res => {
                    const { data, code } = res
                    debugger
                    if (code === '0' && Array.isArray(data)) {
                        state.searchDataList = differenceBy(data, selfSymbolList.value.map(el => ({
                            id: el.symbolId,
                            code: el.symbolCode,
                            name: el.symbolName
                        })), 'id')
                    }
                    // [{"sourceId":"USDJPY_Group","priftCurrency":"USD","name":"现货黄金","id":1,"class":"com.cats.config.api.vo.open.OpenSymbolVo","baseCurrency":"USD","status":1}]
                }).catch(err => {

                })
            }
            // console.log('onSearch---', state.value)
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
            showPopup,
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
