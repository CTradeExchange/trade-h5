<template>
    <div class='optional-top'>
        <Top :back='false' :menu='false' title=''>
            <template #right>
                <van-icon v-if='isEidt && checked.length>0' class='icon-add' name='delete-o' @click='removeOptional' />
            </template>
            <template #left>
                <van-icon class='icon-add' name='edit' @click='toggleEdit' />
            </template>
        </Top>
    </div>
    <template v-if='isEidt'>
        <van-checkbox-group v-model='checked'>
            <van-cell-group>
                <van-cell
                    v-for='(val,idx) in selfSymbolList'
                    :key='idx'
                    clickable
                    :title='val.symbolName'
                    @click='toggle(idx)'
                >
                    <template #icon>
                        <van-checkbox
                            :ref='el => checkboxRefs[idx] = el'
                            class='cats-checkbox'
                            :name='String(val.symbolId)'
                            :value='val.symbolId'
                            @click.stop
                        />
                    </template>
                    <template #right-icon>
                        <van-icon name='wap-nav' />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-checkbox-group>
    </template>
    <template v-else>
        <productListComp />
    </template>
</template>

<script>
import Top from '@m/layout/top'
import { ref, computed, onBeforeUpdate, watch } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import productListComp from '@m/modules/productList/productList.vue'
import { removeCustomerOptional } from '@/api/trade'
export default {
    components: {
        productListComp,
        Top,
    },
    setup () {
        const isEidt = ref(false)
        const checked = ref([])
        const checkboxRefs = ref([])
        const optionalSymbolList = ref([])
        const toggle = (index) => {
            checkboxRefs.value[index].toggle()
        }
        const toggleEdit = () => {
            isEidt.value = !isEidt.value
        }
        onBeforeUpdate(() => {
            checkboxRefs.value = []
        })

        const store = useStore()
        store.dispatch('_user/queryCustomerOptionalList')

        const selfSymbolList = computed(() => {
            return store.state._user.selfSymbolList
        })
        optionalSymbolList.value = [].concat(selfSymbolList)
        watch(selfSymbolList, (val) => {
            console.log('vvvvvv')
            optionalSymbolList.value = val
            const subscribList = val.map(({ symbolId }) => symbolId)
            if (subscribList.length > 0) {
                QuoteSocket.send_subscribe(subscribList)
            }
        })
        const removeOptional = (record) => {
            removeCustomerOptional({ symbolList: checked.value }).then(res => {
                if (res.code === '0') {
                    // state.searchDataList = differenceBy(state.searchDataList, [{ id: record.id }], 'id')
                    store.dispatch('_user/queryCustomerOptionalList')
                }
            })
        }
        return {
            // ...toRefs(state),
            selfSymbolList,
            optionalSymbolList,
            removeOptional,
            toggleEdit,
            toggle,
            isEidt,
            checked,
            checkboxRefs,
            // addOptional
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.optional-top {
    :deep(.top) {
        justify-content: space-between;
    }
}
.icon-add {
    font-size: rem(40px);
}
.cats-checkbox {
    margin-right: rem(16px);
}
</style>
