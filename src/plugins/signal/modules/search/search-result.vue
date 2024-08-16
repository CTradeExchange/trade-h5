<template>
    <div class='search_products'>
        <div v-for='item in list' :key='item.id' class='product_item' @click='openProduct(item.id)'>
            <span class='symbol-code'>
                <product-icon :symbol-key='`${item.id}_${tradeType}`' />
                <span v-for='(childName,index) in item.name' :key='index' :class="{ 'activeText':isSearchText(childName) }">
                    {{ childName }}
                </span>
            </span>
            <button v-if='customerInfo' v-preventReClick class='collect-icon' @click.stop='addOptional(item)'>
                <i
                    :class="item.isSelfSymbol ? (isPC ? 'icon_hangqingliebiaoyijiazixuan': 'icon_zixuan2'): 'icon_zixuan11'"
                ></i>
            </button>
            <p v-if='item.etf'>
                <ETF />
            </p>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import ETF from '@plans/components/etfIcon'
import productIcon from '@/components/product-icon.vue'

export default {
    name: 'ProductSearch',
    components: {
        ETF,
        productIcon
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        tradeType: [String, Number],
        searchKey: [String]
    },
    emits: ['on-search', 'click'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const router = useRouter()
        const store = useStore()
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 自选股
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)

        const isSearchText = (val) => {
            if (props.searchKey.indexOf(val) !== -1) {
                return true
            } else {
                return false
            }
        }

        const openProduct = (symbolId) => {
            emit('click')
            router.push(`/${window.isPC ? 'order' : 'product'}?symbolId=${symbolId}&tradeType=${props.tradeType}`)
        }
        // 添加自选
        const addOptional = (item) => {
            if (item.isSelfSymbol) {
                removeCustomerOptional({ symbolList: [item.id], tradeType: props.tradeType }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.removeOptionalOk'))
                        for (const key in selfSymbolList.value) {
                            selfSymbolList.value[key].forEach((el, index) => {
                                if (item.id === el.symbolId || item.id === el.id) {
                                    selfSymbolList.value[key].splice(index, 1)
                                }
                            }
                            )
                        }
                        emit('on-search')
                    }
                }).catch(err => {
                })
            } else {
                addCustomerOptional({ symbolList: [item.id], tradeType: props.tradeType }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        selfSymbolList.value[props.tradeType].push(item)
                        emit('on-search')
                        Toast(t('trade.addOptionalOk'))
                    }
                })
            }
        }

        return {
            isPC: window.isPC,
            customerInfo,
            addOptional,
            openProduct,
            isSearchText
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
:deep(.van-cell) {
    background-color: var(--bgColor) !important;
}
.quoteWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    // margin-top: rem(90px);
    //padding-bottom: rem(100px);
    overflow: auto;
    padding-top: rem(128px);
    background: var(--bgColor);
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
    .search_box {
        position: absolute;
        top: rem(134px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        background: var(--contentColor);
        overflow: auto;
        &.top {
            //top: rem(100px);
        }
        .search_input {
            .van-field {
                border-radius: 3px;
            }
            :deep(.van-cell) {
                padding-left: 0;
            }
            :deep(.van-search__action) {
                padding: 0 rem(40px);
            }
        }
        .search_label {
            display: inline-block;
            color: #333;
        }
        .search_products {
            background: var(--contentColor);
            .product_item {
                cursor: pointer;
                width: 100%;
                height: rem(116px);
                padding: rem(40px) rem(20px);
                border-bottom: 1px solid var(--lineColor);
                display: flex;
                align-items: center;
                &:hover {
                    background: var(--primaryAssistColor);
                }
                .symbol-code {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                .collect-icon {
                    background: none;
                }
                .icon_zixuan2 {
                    color: var(--primary);
                    animation: heartBeat 1.3s ease-in-out forwards;
                }
                .activeText {
                    color: var(--primary);
                }
                &:deep {
                    .img-group {
                        margin-right: rem(16px);
                    }
                }
            }
        }
    }
}
.tradeNav {
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    //padding-bottom: rem(10px);
    background-color: var(--contentColor);
    //border-bottom: solid 4px var(--lineColor);
    .van-tab {
        background: yellow !important;
    }
    .tradeSortNav {
        padding-right: rem(64px) !important;
    }
    i {
        position: relative;
        right: rem(40px);
        bottom: rem(60px);
        float: right;
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    .item {
        width: rem(210px);
        text-align: right;
        &:first-child {
            flex: 1;
            text-align: left;
        }
        &:nth-child(2) {
            width: rem(210px);
            text-align: left;
        }
    }
}
</style>
