<template>
    <div class='listWrap'>
        <div class='item listHead'>
            <span class='name'>
                名称
            </span>
            <span class='price'>
                最新价
            </span>
            <span class='change'>
                涨跌幅
            </span>
        </div>
        <div ref='productListEl' class='items' :style='[scrollBarWidth && { paddingRight: 0 }]'>
            <div v-for='item in props.list' :key='item.id' class='item li' @click='onClick(item)'>
                <span class='name'>
                    <i v-if='isCollect(item.tradeType,item.symbolId)' class='icon icon_zixuan2' @click.stop='addOptional(item)'></i>
                    <i v-else class='icon icon_zixuan1' @click.stop='addOptional(item)'></i>
                    {{ item.symbolCode }}
                </span>
                <span class='price'>
                    {{ productMap[item.symbolKey]?.price }}
                </span>
                <span class='change' :class='[productMap[item.symbolKey]?.upDownColor]'>
                    {{ productMap[item.symbolKey]?.upDownWidth }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, toRef } from 'vue'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import subscribeProducts from '@planspc/hooks/subscribeProducts'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

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

// 监听列表滚动，订阅/获取产品数据
const list = toRef(props, 'list')
const { productListEl, productMap } = subscribeProducts(list)
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

/** 添加自选逻辑 */
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
const isCollect = (tradeType, symbolId) => selfSymbolList.value[tradeType]?.find(el => el.symbolId === parseInt(symbolId))
const addOptional = ({ symbolId, tradeType }) => {
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

/** 监听是否存在滚动条，调整样式 */
const scrollBarWidth = ref(0)
watch(() => [props.list.length],
      async () => {
          await nextTick()
          if (productListEl && props.list.length) {
              scrollBarWidth.value = productListEl.value.offsetWidth - productListEl.value.clientWidth
          }
      },
      { immediate: true }
)
/** 监听是否存在滚动条，调整样式 */

</script>

<style lang="scss" scoped>
.listWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    color: var(--color);
    font-size: rem(30px);
    line-height: rem(32px);
    overflow: hidden;
    font-weight: 500;
    margin-top: 9px;
    .item{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        user-select: none;
        .name{
            flex: 1;
        }
        .change{
            width: 85px;
            text-align: right;
        }
    }
    .listHead{
        width: 100%;
        padding: 0 16px;
        font-size: 12px;
        color: #999999;
        line-height: 26px;
    }
    .items{
        width: 100%;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0 8px;
        .li {
            width: 100%;
            padding: 0 8px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            cursor: pointer;
            .name{
                font-weight: 400;
                color: #333333;
            }
            &:hover{
                background: #F8F8F8;
                border-radius: 4px;
            }
        }
    }

}
</style>
