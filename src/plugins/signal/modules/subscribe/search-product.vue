<template>
    <dropdown ref='dropdownRef' class='search-product'>
        <template #reference>
            <div class='product-info cursor-pointer'>
                <product-icon v-if='symbolCode' :symbol-code='symbolCode' />
                <span v-else class='empty'>
                    {{ $t('signal.subscribe.selectProduct') }}
                </span>
                <van-icon name='arrow-down' />
            </div>
        </template>
        <div class='product-content'>
            <InputComp v-model.trim='searchKeyword' class='search-input' clear :label="$t('signal.subscribe.search')">
                <template #before>
                    <svg class='svg-icon-search' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z'
                            fill='currentColor'
                        />
                    </svg>
                </template>
            </InputComp>
            <div class='product-list'>
                <div v-if='!searchKeyword' class='product-tab'>
                    <classify-list v-model='sc' :is-multiple='false' :list='productCate' :style-type='2' />
                </div>
                <div class='product-list-content'>
                    <div class='product-list-item product-list-item-th'>
                        <div class='col col-th'>
                            <span>{{ $t('signal.subscribe.productName') }}</span>
                        </div>
                        <div class='col col-th'>
                            <span>{{ $t('signal.detail.newPrice') }}</span>
                        </div>
                    </div>
                    <div class='product-list-wrap'>
                        <div v-for='item in productList' :key='item.value' class='product-list-item' @click='handleChange(item)'>
                            <div class='col col-th'>
                                <product-icon class='signal-block-symbol' :symbol-code='item.value' />
                            </div>
                            <div class='col col-th'>
                                <product-price :symbol-code='item.value' />
                            </div>
                        </div>
                        <none-data v-if='productList.length === 0' :description="$t('signal.subscribe.searchEmpty')" />
                    </div>
                </div>
            </div>
        </div>
    </dropdown>
</template>

<script>
import { computed, reactive, watch, toRefs, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import dropdown from '@/plugins/signal/components/dropdown'
import classifyList from '@/plugins/signal/components/classify-list.vue'
import InputComp from '@/components/form/input'
import { QuoteSocket } from '@/plugins/socket/socket'
import productIcon from '@/plugins/signal/components/product-icon.vue'
import productPrice from '@/plugins/signal/components/product-price.vue'
import noneData from '@/plugins/signal/components/none-data.vue'

export default {
    components: {
        InputComp,
        dropdown,
        classifyList,
        productIcon,
        productPrice,
        noneData,
    },
    props: {
        // 产品code
        symbolCode: String,
    },
    emits: ['on-change'],
    setup (props, { emit }) {
        const store = useStore()
        const dropdownRef = ref(null) // 下拉框
        const moduleId = 'subscribeSearchProduct_' + Date.now()
        let unSubscribe = () => {}
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 当前选择类型
            sc: 'hot',
            searchKeyword: '', // 搜索关键词
        })
        // 产品类型列表
        const productCate = computed(() => {
            const arr = [
                {
                    name: t('signal.common.hot'),
                    value: 'hot',
                },
            ]
            store.state._signal.config.product.forEach((item) => {
                arr.push({
                    ...item,
                })
            })
            return arr
        })

        // 产品列表
        const productList = computed(() => {
            return store.state._signal.config.productAllList.filter((item) => {
                const product = store.getters['_signal/getSignalProduct'](item.value)
                if (state.searchKeyword) {
                    const keyword = state.searchKeyword.toUpperCase()
                    // 匹配代号和名称
                    if (
                        product?.symbolCode &&
                        (product?.symbolCode.indexOf(keyword) !== -1 || product?.symbolName.indexOf(keyword) !== -1)
                    ) {
                        return true
                    } else {
                        return false
                    }
                }
                // 是否热门
                const isHot = !state.sc || state.sc === 'hot'
                if ((isHot && item.isHot) || (!isHot && state.sc === item.sc)) {
                    return true
                } else {
                    return false
                }
            })
        })

        // 订阅行情
        watch(
            [() => productList.value, () => store.state._quote.symbolCodeMap],
            (val) => {
                // 等行情加载完了再订阅
                if (Object.keys(val[1]).length === 0) return
                const symbolKeyAll = []
                val[0].forEach((item) => {
                    const symbolKey = store.getters['_signal/getSignalSymbolKey'](item.value)
                    if (symbolKey) symbolKeyAll.push(symbolKey)
                })
                if (symbolKeyAll.length === 0) return
                unSubscribe = QuoteSocket.add_subscribe({
                    moduleId,
                    symbolKeys: symbolKeyAll,
                })
            },
            { immediate: true },
        )

        // 切换产品
        const handleChange = (item) => {
            emit('on-change', item.value)
            dropdownRef.value.handleVisible(false)
            state.searchKeyword = ''
        }

        onUnmounted(() => {
            unSubscribe()
        })

        return {
            ...toRefs(state),
            productCate,
            productList,
            handleChange,
            dropdownRef,
        }
    },
}
</script>

<style lang="scss" scoped>
.search-product {
    &.dropdown-active {
        .van-icon-arrow-down {
            margin-top: 2px;
            transform: rotate(180deg);
        }
    }
    .product-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        height: 48px;
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: 5px;
        position: relative;
        .van-icon-arrow-down {
            transition: 0.15s;
        }
        .empty {
            color: var(--placeholdColor);
        }
        :deep {
            .symbol-name {
                .icon img {
                    width: 24px;
                    height: 24px;
                }
                .symbol-code {
                    font-weight: bold;
                }
            }
        }
    }
    .product-content {
        padding: 15px 15px 0;
        .search-input {
            width: 100%;
            height: 40px;
            font-size: 14px;
            padding-right: 0;
            position: relative;
            display: flex;
            align-items: center;
            &::after {
                content: none;
            }
            :deep {
                .input {
                    border: 1px solid var(--lineColor);
                    border-radius: 3px;
                    padding: 0 30px;
                    flex: 1;
                    &:hover,
                    &:focus {
                        border-color: var(--primary);
                    }
                }
                .svg-icon-search {
                    color: var(--color);
                    position: absolute;
                    margin-left: 8px;
                    width: 14px;
                    height: 14px;
                }
                .van-icon-clear {
                    position: absolute;
                    right: 8px;
                }
            }
        }
        .product-tab {
            padding-top: 8px;
        }
        .product-list {
            height: 240px;
            display: flex;
            flex-direction: column;
            .product-list-content {
                flex: 1;
                margin: 0 -15px;
                overflow: hidden;
                .product-list-wrap {
                    height: 160px;
                    overflow: auto;
                    @include scroll-bar-vertical;
                    :deep {
                        .van-empty {
                            padding: 0;
                        }
                    }
                }
                .product-list-item {
                    cursor: pointer;
                    padding: 0 15px;
                    display: flex;
                    align-items: center;
                    height: 40px;
                    &:not(.product-list-item-th):hover {
                        background-color: var(--bgColor);
                    }
                    .col {
                        flex: 1;
                        font-size: 13px;
                        &:last-child {
                            text-align: right;
                        }
                    }
                    &.product-list-item-th {
                        .col {
                            color: var(--minorColor);
                        }
                    }
                }
            }
        }
    }
    :deep {
        .classify-list {
            padding-bottom: 10px;
            justify-content: space-between;
            .item {
                margin-right: 0;
            }
        }
    }
}
</style>
