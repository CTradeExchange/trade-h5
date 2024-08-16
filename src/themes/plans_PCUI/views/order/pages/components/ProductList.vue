<template>
    <div class='listWrap'>
        <van-row v-if='showListHead === true' class='listHead' gutter='2'>
            <van-col span='9'>
                <div class='flex items-center' @click="sortHandler('symbolName')">
                    <span className='mr-1'>
                        {{ $t('trade.name') }}
                    </span>
                    <span class='cursor-pointer'>
                        <SortIcon name='symbolName' :sort-field='sortField' :sort-type='sortType' />
                    </span>
                </div>
            </van-col>
            <van-col span='8'>
                <div class='flex justify-end items-center' @click="sortHandler('rolling_last_price')">
                    <span className='mr-1'>
                        {{ $t('trade.newCustomValue') }}
                    </span>
                    <span class='cursor-pointer'>
                        <SortIcon name='rolling_last_price' :sort-field='sortField' :sort-type='sortType' />
                    </span>
                </div>
            </van-col>
            <van-col span='7'>
                <div
                    class='flex justify-end items-center'
                    :style='[scrollBarWidth && { marginRight: `${scrollBarWidth}px` }]'
                    @click="sortHandler('rolling_upDownWidth')"
                >
                    <span className='mr-1'>
                        {{ $t('trade.changeCustomValue') }}
                    </span>
                    <span class='cursor-pointer'>
                        <SortIcon name='rolling_upDownWidth' :sort-field='sortField' :sort-type='sortType' />
                    </span>
                </div>
            </van-col>
        </van-row>
        <slot name='tHead'></slot>
        <div ref='productListEl' class='items' :style='[scrollBarWidth && { paddingRight: 0 }]'>
            <van-row
                v-for='(item, index) in list'
                :key='item.id'
                class='item li'
                :class="[item.symbolKey === productActived.symbolKey && 'active']"
                :gutter='2'
                @click='onClick(item)'
            >
                <van-col span='9'>
                    <div class='flex-1 flex items-center break-all'>
                        <div class='w-8'>
                            <product-icon :symbol-key='item.symbolKey' />
                        </div>
                        <span :id="index === 0 ? 'first-element-driver' : ''" class='name mx-1 truncate'>
                            {{ item.symbolName }}
                        </span>
                        <ETF v-if='productMap[item.symbolKey].etf' />
                    </div>
                </van-col>
                <van-col span='8'>
                    <div class='flex justify-end' :class='[productMap[item.symbolKey]?.last_color]'>
                        {{ productMap[item.symbolKey]?.rolling_last_price || '- -' }}
                    </div>
                </van-col>
                <van-col span='7'>
                    <div class='flex justify-end' :class='[productMap[item.symbolKey]?.rolling_upDownColor]'>
                        {{ productMap[item.symbolKey]?.rolling_upDownWidth || '- -' }}
                        <i
                            v-if='isCollect(item.tradeType, item.symbolId)'
                            class='icon icon_hangqingliebiaoyijiazixuan'
                            @click.stop='addOptional(item)'
                        ></i>
                        <i v-else class='icon icon_hangqingliebiaoweijiazixuan' @click.stop='addOptional(item)'></i>
                    </div>
                </van-col>
            </van-row>
        </div>
    </div>
</template>

<script setup>
import ETF from '@planspc/components/etfIcon'
import { ref, watch, nextTick, computed, defineEmits, defineProps, inject, toRef } from 'vue'
import { useStore } from 'vuex'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import subscribeProducts from '@planspc/hooks/subscribeProducts'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
// import { QuoteSocket } from '@/plugins/socket/socket'
import SortIcon from '@planspc/components/sortIcon.vue'
import { sortFieldFn, sortTypeFn, sortFunc } from '@planspc/hooks/useProduct'
import { isEmpty, localGet } from '@/utils/util'
import productIcon from '@/components/product-icon.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    list: {
        type: Array,
        default: () => [],
    },
    // 显示头部
    showListHead: {
        type: Boolean,
        default: true,
    },
    /** 是否是自选弹窗 */
    isAddChoose: {
        type: Boolean,
    },
})
const productMap = computed(() => store.state._quote.productMap)
const productActived = computed(() => store.getters.productActived)

const sortField = sortFieldFn()
const sortType = sortTypeFn()
// 点击排序
const sortHandler = (field) => {
    sortFunc(field)
}

const isReLoadProductSearch = inject('isReLoadProductSearch', null)

// 监听列表滚动，订阅/获取产品数据
const list = toRef(props, 'list')
const { productListEl } = subscribeProducts(list)

// 切换当前选中产品
const emit = defineEmits(['item-click'])
const onClick = (product) => {
    if (props.isAddChoose) {
        addOptional(product)
        return
    }
    store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
    router.replace({
        query: {
            ...route.query,
            name: product.symbolName.replace(/ /g, '_'),
            symbolId: product.symbolId,
            tradeType: product.tradeType,
        },
    })
    emit('item-click', product)
}

// watch(() => subscribList.value, () => {
//     QuoteSocket.add_subscribe({ moduleId: 'productList', symbolKeys: subscribList.value })
// }, {
//     immediate: true,
//     deep: true
// })

/** 监听是否存在滚动条，调整样式 */
const scrollBarWidth = ref(0)
watch(
    () => [props.list.length],
    async () => {
        await nextTick()
        if (productListEl && props.list.length) {
            scrollBarWidth.value = productListEl.value.offsetWidth - productListEl.value.clientWidth
        }
    },
    { immediate: true },
)
/** 监听是否存在滚动条，调整样式 */

/** 添加自选逻辑 */
const customerInfo = computed(() => store.state._user.customerInfo)
const selfSymbolList = computed(() => store.state._user.selfSymbolList)
const localSelfSymbolList = computed(() => store.state._user.localSelfSymbolList)

/* 添加自选逻辑 标星状态 */
const isCollect = (tradeType, symbolId) => {
    if (isEmpty(customerInfo.value)) {
        const newId = parseInt(symbolId) + '_' + tradeType
        if (localSelfSymbolList.value) {
            if (localSelfSymbolList.value.find((el) => el === newId)) {
                return true
            } else {
                return false
            }
        }
    } else {
        return selfSymbolList.value[tradeType]?.find((el) => el.symbolId === parseInt(symbolId))
    }
}

/** 添加自选逻辑 */
const addOptional = (product) => {
    const { symbolId, tradeType } = product
    if (!customerInfo.value) {
        // ElMessage.warning(t('common.noLogin'))
        // return router.push('/login')
        // 未登录 缓存到本地
        var localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
        // console.log(localSelfSymbolList, '获取本地缓存数据')
        const newId = symbolId + '_' + tradeType
        if (localSelfSymbolList.find((el) => el === newId)) {
            localSelfSymbolList.map((it, index) => {
                if (it === newId) {
                    localSelfSymbolList.splice(index, 1)
                    !props.isAddChoose && ElMessage.success(t('trade.removeOptionalOk'))
                }
            })
        } else {
            localSelfSymbolList.push(newId)
            !props.isAddChoose && ElMessage.success(t('trade.addOptionalOk'))
        }
        store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
        isReLoadProductSearch && isReLoadProductSearch(true, symbolId)
    } else {
        // 存在这个对象的时候，则是取消收藏
        if (isCollect(tradeType, symbolId)) {
            for (const key in selfSymbolList.value) {
                selfSymbolList.value[key].forEach((el, index) => {
                    if (symbolId === el.symbolId || symbolId === el.id) {
                        selfSymbolList.value[key].splice(index, 1)
                    }
                })
            }
            store.commit('_user/Update_selfSymbolList', selfSymbolList.value)
            removeCustomerOptional({ symbolList: [symbolId], tradeType })
                .then((res) => {
                    if (res.check()) {
                        !props.isAddChoose && ElMessage.success(t('trade.removeOptionalOk'))
                    }
                })
                .catch((err) => {})
        } else {
            if (Object.keys(selfSymbolList.value).length) {
                // 记录的不是空对象的自选列表数据
                selfSymbolList.value[tradeType].push(product)
                store.commit('_user/Update_selfSymbolList', selfSymbolList.value)
            } else {
                // 记录是空对象,所以要组成一个新的对象结构
                const obj = {}
                obj[tradeType] = [product]
                store.commit('_user/Update_selfSymbolList', obj)
            }
            addCustomerOptional({ symbolList: [symbolId], tradeType })
                .then((res) => {
                    if (res.check()) {
                        // 手动修改optional值
                        store.commit('_user/Update_optional', 1)
                        !props.isAddChoose && ElMessage.success(t('trade.addOptionalOk'))
                    }
                })
                .catch((err) => {})
        }
    }
}
</script>

<style lang="scss" scoped>
.listWrap {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    margin-top: 9px;
    overflow: hidden;
    color: var(--color);
    font-weight: 500;
    font-size: rem(30px);
    line-height: rem(32px);
    .item {
        padding: 0 8px;
        display: flex;
        align-items: center;
        user-select: none;
        .icon {
            margin-left: 5px;
        }
        .box {
            display: inline-flex;
            flex: 1;
            flex-direction: column;
        }
        .change {
            width: 120px;
            text-align: right;
        }
    }
    .listHead {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0 8px;
        color: var(--minorColor);
        font-size: 12px;
        line-height: 26px;
        .name {
            flex: 1;
            cursor: pointer;
        }
        .price {
            cursor: pointer;
        }
        .change {
            width: 120px;
            text-align: right;
            cursor: pointer;
        }
    }
    .items {
        flex: 1;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .li {
            font-size: 12px;
            cursor: pointer;
            padding: 8px;
            .name {
                color: var(--color);
                font-weight: 400;
            }
            &.active,
            &:hover {
                background: var(--primaryAssistColor);
                border-radius: 4px;
            }
            :deep(.etfIcon) {
                margin-top: 2px;
            }
        }
    }
}
</style>
