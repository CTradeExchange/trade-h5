<template>
    <div class='watch-list'>
        <div class='head'>
            <h5>{{ $t('trade.watchlist') }}</h5>
            <van-button
                class='icon-add'
                icon='plus'
                size='mini'
                type='primary'
                @click='handlePlus'
            >
                {{ $t('trade.addSymbol') }}
            </van-button>
        </div>
        <el-scrollbar class='quickTransaction-scroll'>
            <div class='content'>
                <van-empty
                    v-if='selfSymbolList.length === 0'
                    :description="$t('common.noData')"
                    image='/images/empty.png'
                />
                <div
                    v-for='(item, index) in formatSelfSymbolList'
                    v-else
                    :key='item.id'
                >
                    <ProductList
                        :list='item.list'
                        :show-list-head='(index === 0)'
                    >
                        <template #tHead>
                            <div class='watch-title'>
                                {{ item.title }}
                            </div>
                        </template>
                    </ProductList>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { computed, unref, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import mitt from '@/utils/mitt'
import ProductList from '../ProductList'
import useProduct from '@planspc/hooks/useProduct'
import useOptional from '@/hooks/home/useOptional'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        ProductList
    },
    setup () {
        const store = useStore()
        let unSubscribe = () => {}
        const productMap = computed(() => store.state._quote.productMap)
        const product = computed(() => store.getters.productActived)
        // 玩法类型
        const tradeType = computed(() => String(unref(product)?.tradeType))
        // 获取板块列表
        const { categoryList, sortList, sortType, sortField } = useProduct({
            tradeType,
            categoryType: '0',
            sortEnabled: true,
            isSelfSymbol: false, // 不显示自选
        })

        const { selfSymbolList, addOptional } = useOptional()
        // 是否已经自选过的产品
        const isChoose = computed(() => {
            return selfSymbolList.value?.find(item => item.includes(product.value.symbolKey))
        })

        const formatSelfSymbolList = computed(() => {
            if (!categoryList.value.length) return []
            // 自选列表
            const productMapVal = unref(productMap)
            const selfSymbol = unref(selfSymbolList)
            return categoryList.value.map((item, index) => {
                const { listByUser = [] } = item
                const allList = listByUser.map((sitem) => `${sitem}_${unref(tradeType)}`)
                const list = []
                selfSymbol.forEach((sitem) => {
                    if (allList.indexOf(sitem) > -1 && productMapVal[sitem]?.symbolName) {
                        list.push(productMapVal[sitem])
                    }
                })
                return {
                    ...item,
                    list: sortList(list, unref(sortType), unref(sortField)), // 有效列表
                }
            })
        })

        watch(() => selfSymbolList.value, (newVal) => {
            unSubscribe = QuoteSocket.add_subscribe24H({ moduleId: 'watchListSelfSymbollist', symbolKeys: newVal })
        }, { immediate: true })

        // 当前品种在自选列表里面则需要展示
        const isShowDetail = computed(() => {
            return selfSymbolList.value.indexOf(product.value.symbolKey) !== -1
        })

        // 添加自选
        const handlePlus = () => {
            mitt.emit('addChoose', true)
        }

        onBeforeUnmount(() => {
            unSubscribe()
        })

        return {
            categoryList,
            selfSymbolList,
            formatSelfSymbolList,
            handlePlus,
            sortType,
            sortField,
            isShowDetail,
            addOptional,
            isChoose,
            product,
            tradeType
        }
    }
}
</script>

<style lang="scss" scoped>
.watch-list {
    height: 100%;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    background: var(--contentColor);
    .head {
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--lineColor);
        h5 {
            font-size: 20px;
        }
        .van-button--default {
            background: var(--assistColor);
            border-color: var(--assistColor);
            color: var(--normalColor);
        }
        .icon-add {
            font-size: 12px;
            white-space: nowrap;
            :deep {
                .van-icon {
                    line-height: normal;
                    margin-bottom: 2px;
                }
            }
        }
    }
    .content {
        flex: 1;
        overflow: auto;
    }
}
.watch-title {
    align-items: center;
    display: flex;
    height: 30px;
    justify-content: space-between;
    margin-top: 6px;
    min-width: 0;
    padding: 0 8px;
    color: var(--minorColor);
    font-size: 12px;
    border-bottom: 1px solid var(--lineColor);
}
</style>
