<template>
    <div class='listWrap'>
        <div class='item listHead'>
            <span class='cell name'>
                {{ $t('trade.name') }}
            </span>
            <span class='cell price'>
                {{ $t('trade.newPrice') }}
            </span>
            <span class='cell upDownAmount'>
                {{ $t('trade.changePrice') }}
            </span>
            <span class='cell upDownWidth'>
                {{ $t('trade.upDownWidth') }}
            </span>
            <span class='cell highPrice'>
                {{ $t('trade.highPrice') }}
            </span>
            <span class='cell lowPrice'>
                {{ $t('trade.lowPrice') }}
            </span>
            <span class='cell btns'>
                {{ $t('trade.operating') }}
            </span>
        </div>
        <div ref='productListEl' class='items' :style='[scrollBarWidth && { paddingRight: 0 }]'>
            <div v-for='item in props.list' :key='item.id' class='item li'>
                <span class='name'>
                    <i v-if='isCollect(item.tradeType,item.symbolId)' class='icon icon_zixuan2 star' @click.stop='addOptional(item)'></i>
                    <i v-else class='icon icon_zixuan1 star' @click.stop='addOptional(item)'></i>
                    {{ item.symbolCode }}
                </span>
                <span class='price'>
                    {{ getVal(item.symbolKey, 'price') }}
                </span>
                <span class='upDownAmount'>
                    {{ getVal(item.symbolKey, 'upDownAmount') }}
                </span>
                <span class='upDownWidth' :class='[productMap[item.symbolKey]?.upDownColor]'>
                    {{ getVal(item.symbolKey, 'upDownWidth') }}
                </span>
                <span class='highPrice'>
                    {{ getVal(item.symbolKey, 'high_price') }}
                </span>
                <span class='lowPrice'>
                    {{ getVal(item.symbolKey, 'low_price') }}
                </span>
                <div class='btns'>
                    <span class='btn' @click='gotoOrder(item)'>
                        {{ $t('trade.buy') }}
                    </span>
                    <span class='btn' @click='gotoOrder(item)'>
                        {{ $t('trade.sell') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, toRef, unref } from 'vue'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import subscribeProducts from '@planspc/hooks/subscribeProducts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const store = useStore()
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    tradeType: {
        type: String,
        default: ''
    }
})

// 监听列表滚动，订阅/获取产品数据
const list = toRef(props, 'list')
const { productListEl, productMap } = subscribeProducts(list)

const getVal = (symbolKey, key) => unref(productMap)[symbolKey] && unref(productMap)[symbolKey]?.[key] || '- -'

// 切换当前选中产品
const gotoOrder = product => {
    router.push({
        name: 'Order',
        query: {
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
@import '~@/sass/mixin.scss';
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
    margin: 30px 0;
    max-height: 500px;
    .name,
    .price,
    .upDownAmount,
    .upDownWidth,
    .highPrice,
    .lowPrice,
    .change{
        flex: 0 0 163px;
        @include ellipsis();
    }
    .btns{
        text-align: right;
        flex: 0 0 180px;
    }
    .star{
        cursor: pointer;
        margin-right: 10px;
    }
    .item{
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        user-select: none;
    }
    .listHead{
        width: 100%;
        padding: 0 20px;
        font-size: 14px;
        color: #999999;
        line-height: 16px;
        margin-bottom: 17px;
    }
    .items{
        width: 100%;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0 20px;
        .li {
            width: 100%;
            height: 64px;
            line-height: 64px;
            font-size: 14px;
            border-top: 1px solid var(--assistColor);
            &:last-child{
                border-bottom: 1px solid var(--assistColor);
            }
            .name{
                font-weight: 400;
                color: #333333;
            }
            &:hover{
                background: #F8F8F8;
                border-radius: 4px;
            }
        }
        .btns{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            .btn{
                width: 80px;
                color: #fff;
                height: 32px;
                line-height: 32px;
                background: #EF5350;
                border-radius: 4px;
                text-align: center;
                font-size: 16px;
                font-weight: 400;
                cursor: pointer;
                &:last-child{
                    margin-left: 20px;
                }
            }
        }
    }

}
</style>
