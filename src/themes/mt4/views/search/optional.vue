<template>
    <div class='optional-top'>
        <Top :back='true' :menu='false' title=''>
            <template #right>
                <van-icon class='icon-edit' name='edit' @click='toggleEdit' />
                <van-icon v-if='isEidt && checked.length>0' class='icon-delete' name='delete-o' @click='removeOptional' />
            </template>
            <template #center>
                <div class='van-button-group'>
                    <van-button class='van-action-bar-button van-action-bar-button--first' :class='quoteMode===1 ? "van-button--primary" : "van-button--default"' plain size='small' @click='switchQuoteMode(1)'>
                        简单
                    </van-button>
                    <van-button class='van-action-bar-button van-action-bar-button--last' :class='quoteMode===2 ? "van-button--primary" : "van-button--default"' plain size='small' @click='switchQuoteMode(2)'>
                        高级的
                    </van-button>
                </div>
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
        const quoteMode = computed(() => store.state.quoteMode)
        // 切换行情列表模式
        const switchQuoteMode = (mode) => {
            if ((mode === 1 && quoteMode.value === 1) || (mode === 2 && quoteMode.value === 2)) {
                return
            }
            store.commit('Update_quoteMode', mode)
        }
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
            switchQuoteMode,
            quoteMode
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
.icon-edit,
.icon-delete {
    font-size: rem(40px);
}
.icon-delete {
    margin-left: rem(20px);
}
.cats-checkbox {
    margin-right: rem(16px);
}
.van-button-group {
    display: flex;
    justify-content: center;
    :deep(.van-action-bar-button) {
        flex: none;
        width: rem(148px);
        height: rem(48px);
        font-size: rem(24px);
    }
}
</style>
