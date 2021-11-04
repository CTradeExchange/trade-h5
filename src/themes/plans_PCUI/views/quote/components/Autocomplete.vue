<template>
    <!-- <el-input v-model='searchValue' class='search-input' clearable placeholder='请输入关键字搜索' @input='onSearch'>
        <template #prefix>
            <el-icon class='el-input__icon'>
                <Search />
            </el-icon>
        </template>
    </el-input> -->
    <div class='search-input'>
        <el-autocomplete
            v-model='state'
            :fetch-suggestions='querySearch'
            placeholder='请输入关键字搜索'
            popper-class='quote-autocomplete'
            @select='gotoOrder'
        >
            <template #prefix>
                <el-icon class='el-input__icon'>
                    <Search />
                </el-icon>
            </template>
            <template #default='{ item }'>
                <div class='item'>
                    <span class='label'>
                        {{ item.name }}
                    </span>
                    <span class='star' @click.stop='addOptional(item)'>
                        <i v-if='isCollect(props.tradeType,item.id)' class='icon icon_zixuan2'></i>
                        <i v-else class='icon icon_zixuan1'></i>
                    </span>
                </div>
            </template>
        </el-autocomplete>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElAutocomplete, ElIcon, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional, getSymbolList } from '@/api/trade'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/util'

const router = useRouter()
const store = useStore()
const { t } = useI18n({ useScope: 'global' })

const props = defineProps({
    tradeType: {
        type: String,
        default: ''
    }
})

const state = ref('')
// 搜索
const querySearch = (queryString, cb) => {
    if (!queryString) {
        return cb([])
    }
    debounce(getSymbolList({ name: queryString, customerGroupId: store.getters.customerGroupId, tradeType: props.tradeType }).then(res => {
        if (res.check()) {
            cb(res.data)
        }
    }))
}
const gotoOrder = (product) => {
    router.push({
        name: 'Order',
        query: {
            symbolId: product.id,
            tradeType: props.tradeType
        }
    })
}

/** 添加自选逻辑 */
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
const isCollect = (tradeType, symbolId) => selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))

const addOptional = ({ id: symbolId, tradeType = props.tradeType }) => {
    if (isCollect(tradeType, symbolId)) {
        removeCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
            if (res.check()) {
                store.dispatch('_user/queryCustomerOptionalList')
                ElMessage.success(t('trade.removeOptionalOk'))
            }
        }).catch(err => {
        })
    } else {
        addCustomerOptional({ symbolList: [symbolId], tradeType }).then(res => {
            if (res.check()) {
                // 手动修改optional值
                store.commit('_user/Update_optional', 1)
                store.dispatch('_user/queryCustomerOptionalList')
                ElMessage.success(t('trade.addOptionalOk'))
            }
        }).catch(err => {
        })
    }
}
/** 添加自选逻辑 */

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search-input{
    flex: 0 0 220px;
    height: 40px;
    :deep{
        .el-autocomplete{
            display: flex;
            width: 100%;
            height: 100%;
        }
    }
}

</style>

<style lang="scss">
.quote-autocomplete{
    color: red;
    .item{
         display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
}
</style>
