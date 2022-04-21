<template>
    <div class='listWrap'>
        <div class='listHead'>
            <span class='name'>
                {{ $t('trade.name') }}
            </span>
            <span class='price'>
                {{ $t('trade.newPrice') }}
            </span>
            <span class='change'>
                {{ $t('trade.changePercent') }}
            </span>
        </div>
        <div ref='productListEl' class='items' :style='[scrollBarWidth && { paddingRight: 0 }]'>
            <div v-for='item in list' :key='item.id' class='item li' :class='[item.symbolKey === productActived.symbolKey && "active"]' @click='onClick(item)'>
                <i v-if='isCollect(item.tradeType,item.symbolId)' class='icon icon_hangqingliebiaoyijiazixuan' @click.stop='addOptional(item)'></i>
                <i v-else class='icon icon_hangqingliebiaoweijiazixuan' @click.stop='addOptional(item)'></i>
                <div class='box'>
                    <span class='name'>
                        {{ item.symbolName }}
                    </span>
                    <ETF v-if='productMap[item.symbolKey].etf' />
                </div>
                <span class='price' :class='[productMap[item.symbolKey]?.last_color]'>
                    {{ productMap[item.symbolKey]?.rolling_last_price || '- -' }}
                </span>
                <span class='change' :class='[productMap[item.symbolKey]?.rolling_upDownColor]'>
                    {{ productMap[item.symbolKey]?.rolling_upDownWidth || '- -' }}
                </span>
            </div>
        </div>
        <div v-if='list.length === 0' class='none-data'>
            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
        </div>
    </div>
</template>

<script setup>
import ETF from '@planspc/components/etfIcon'
import { ref, watch, nextTick, computed, toRef, defineProps } from 'vue'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import subscribeProducts from '@planspc/hooks/subscribeProducts'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { QuoteSocket } from '@/plugins/socket/socket'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const productActived = computed(() => store.getters.productActived)

// 监听列表滚动，订阅/获取产品数据
const list = toRef(props, 'list')
const { productListEl, productMap, subscribList } = subscribeProducts(list)

// 切换当前选中产品
const onClick = product => {
    store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
    router.replace({
        query: {
            ...route.query,
            symbolId: product.symbolId,
            tradeType: product.tradeType
        }
    })
}

// watch(() => subscribList.value, () => {
//     QuoteSocket.add_subscribe({ moduleId: 'productList', symbolKeys: subscribList.value })
// }, {
//     immediate: true,
//     deep: true
// })

/** 监听是否存在滚动条，调整样式 */
const scrollBarWidth = ref(0)
watch(() => [props.list.length], async () => {
    await nextTick()
    if (productListEl && props.list.length) {
        scrollBarWidth.value = productListEl.value.offsetWidth - productListEl.value.clientWidth
    }
}, { immediate: true })
/** 监听是否存在滚动条，调整样式 */

/** 添加自选逻辑 */
const customerInfo = computed(() => store.state._user.customerInfo)
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
const isCollect = (tradeType, symbolId) => selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))
const addOptional = ({ symbolId, tradeType }) => {
    if (!customerInfo.value) {
        ElMessage.warning(t('common.noLogin'))
        return router.push('/login')
    }

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
.listWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    color: var(--color);
    font-size: rem(30px);
    line-height: rem(32px);
    overflow: hidden;
    font-weight: 500;
    margin-top: 9px;
    position: relative;
    .item{
        display: flex;
        align-items: center;
        user-select: none;
        .icon {
            margin-right: 5px;
        }
        .box {
            display: inline-flex;
            flex-direction: column;
            flex: 1;
        }
        .change{
            width: 85px;
            text-align: right;
        }
    }
    .listHead{
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 16px;
        font-size: 12px;
        color: var(--minorColor);
        line-height: 26px;
        .name {
            flex: 1;
        }
        .change{
            width: 85px;
            text-align: right;
        }
    }
    .items{
        width: 100%;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        .li {
            height: 45px;
            padding: 0 8px;
            font-size: 12px;
            cursor: pointer;
            .name{
                font-weight: 400;
                color: var(--color);
            }
            &.active,
            &:hover{
                background: var(--primaryAssistColor);
                border-radius: 4px;
            }
            :deep(.etfIcon) {
                margin-top: 2px;
            }
        }
    }
    .none-data {
        display: flex;
        justify-content: center;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
}

</style>
