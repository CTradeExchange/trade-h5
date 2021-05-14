<template>
    <Top :back='true' :menu='false' title='' />
    <van-search v-model='value' placeholder='请输入搜索关键词' @search='onSearch' />
    <div class='search-result'>
        <van-cell v-for='(item,index) in searchDataList' :key='index' class='center-align-items' icon='location-o' :title='item.name'>
            <template #icon>
                <van-icon class='icon' name='add-o' @click='addOptional(item)' />
            </template>
        </van-cell>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { getSymbolList } from '@/api/trade'
import { addCustomerOptional } from '@/api/user'
import { isEmpty } from '@/utils/util'
import { toRefs, reactive, computed, onBeforeMount } from 'vue'
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
            requesNeedParams: {},
            searchDataList: []
        })
        const store = useStore()
        const customInfo = computed(() => store.state._user.customerInfo)
        onBeforeMount(() => {
            // const params = {}
            // getSymbolList(params).then(res => {

            // }).catch(err => {

            // })
        })
        const addOptional = (record) => {
            addCustomerOptional([{}])
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
                    if (code === '0' && Array.isArray(data)) {
                        state.searchDataList = data
                    }
                    // [{"sourceId":"USDJPY_Group","priftCurrency":"USD","name":"现货黄金","id":1,"class":"com.cats.config.api.vo.open.OpenSymbolVo","baseCurrency":"USD","status":1}]
                }).catch(err => {

                })
            }
            // console.log('onSearch---', state.value)
        }
        store.dispatch('_user/queryCustomerOptionalList')
        return {
            ...toRefs(state),
            onSearch,
            addOptional
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.center-align-items {
    align-items: center;
    .icon {
        color: var(--primary);
    }
}
</style>
