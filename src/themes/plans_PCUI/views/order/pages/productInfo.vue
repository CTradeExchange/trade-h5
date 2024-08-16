<template>
    <div class='symbol-info border-bottom'>
        <div class='flex'>
            <div
                class='item symbol-name py-2 px-4 product-search-popup-trigger'
                :class="[productSearchVisible ? 'bg-primaryAssistColor' : '']"
            >
                <popover
                    placement='right'
                    :text="isOptional ? $t('trade.cancelToOptional') : $t('trade.addToOptional')"
                >
                    <template #reference>
                        <van-icon
                            class='cursor-pointer mr-2'
                            :color="isOptional ? 'var(--focusColor)' : 'var(--color)'"
                            :name="isOptional ? 'star' : 'star-o'"
                            size='20'
                            @click.stop='addOptional'
                        />
                    </template>
                </popover>
                <div class='search-symbol flex items-center h-full' @click='handleProductSearch'>
                    <div class='symbol-icon'>
                        <ProductIcon :symbol-key='`${product.symbolId}_${product.tradeType}`' />
                    </div>
                    <div class='symbol-name-head'>
                        <p class='name'>
                            <span>{{ product?.symbolName }}</span>
                        </p>
                    </div>
                    <img alt='arrow' :class="[productSearchVisible ? 'rotate--180 ' : 'rotate-0']" src='/images/arrow.svg' />
                </div>
                <popover placement='right' :text="$t('trade.contractRules')">
                    <template #reference>
                        <i
                            v-if='[1, 2].includes(product?.tradeType)'
                            class='icon icon_heyuexiangqing cursor-pointer text-lg ml-3'
                            @click='$router.push(contractRoute)'
                        ></i>
                    </template>
                </popover>
            </div>
            <div class='flex flex-col justify-center ml-3 mr-5 min-w-25 text-left'>
                <p class='text-lg font-bold' :class='product?.cur_color'>
                    <PriceColor v-if="$store.state._quote.quoteListType === 'block'" :product='product' type='cur' />
                    <template v-else>
                        <span>
                            {{
                                product?.cur_price
                                    ? product.cur_price === 'NaN'
                                        ? '--'
                                        : parseFloat(product?.cur_price).toFixed(product.symbolDigits)
                                    : '--'
                            }}
                        </span>
                    </template>
                </p>

                <p>
                    <span class='mr-2' :class='product?.upDownColor'>
                        {{ product?.upDownAmount ? (product.upDownAmount === 'NaN' ? '--' : product.upDownAmount) : '--' }}
                    </span>

                    <span :class='product?.upDownColor'>
                        {{
                            product?.rolling_upDownWidth
                                ? product.rolling_upDownWidth === 'NaN'
                                    ? '--'
                                    : product.rolling_upDownWidth
                                : '--'
                        }}
                    </span>
                </p>
            </div>
        </div>
        <el-scrollbar ref='scrollbarRef' always>
            <div class='flex items-center relative h-full'>
                <template v-if='product.isCryptocurrency'>
                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('common.24hHigh') }}
                        </p>
                        <p>
                            {{ product?.rolling_high_price || '--' }}
                        </p>
                    </div>
                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('common.24hLow') }}
                        </p>
                        <p>
                            {{ product?.rolling_low_price || '--' }}
                        </p>
                    </div>
                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('common.24hNumber') }}({{ product.baseCurrency }})
                        </p>
                        <p>
                            {{ product?.rolling_transactions_number ? formatAmount(product.rolling_transactions_number) : '--' }}
                        </p>
                    </div>
                    <!-- <div class='item ohlc'>
                            <p class='muted'>
                                {{ $t('common.24hAmount') }}({{ product.profitCurrency }})
                            </p>
                            <p>
                                {{ product?.rolling_amount ? formatAmount(product.rolling_amount) : '--' }}
                            </p>
                        </div> -->
                </template>
                <template v-else>
                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('trade.todayOpen') }}
                        </p>
                        <p>
                            {{ product?.open_price || '--' }}
                        </p>
                    </div>

                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('trade.yesterdayClosed') }}
                        </p>
                        <p>
                            {{ product?.yesterday_close_price || '--' }}
                        </p>
                    </div>
                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('trade.high') }}
                        </p>
                        <p>
                            {{ product?.high_price || '--' }}
                        </p>
                    </div>
                    <div class='item ohlc'>
                        <p class='muted'>
                            {{ $t('trade.low') }}
                        </p>
                        <p>
                            {{ product?.low_price || '--' }}
                        </p>
                    </div>
                </template>
            </div>
        </el-scrollbar>
        <div v-if='product.etf' class='item ohlc'>
            <p>
                <span class='muted'>
                    {{ $t('fundInfo.realtimeJZ') }}({{ product.fundCurrency }})
                </span>
                {{ product.currentNav || '--' }}
            </p>
            <p>
                <span class='muted'>
                    {{ $t('fundInfo.premiumRate') }}({{ product.fundCurrency }})
                </span>
                {{ product.premiumRate || '--' }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { isEmpty, localGet } from '@/utils/util'
import { formatAmount } from '@/utils/calculation'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import PriceColor from '@/themeCommon/components/priceColor.vue'
import { toast } from 'vue3-toastify'
import ProductIcon from '@/components/product-icon.vue'

const store = useStore()
const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

const isOptional = ref(false)
const optionalLoading = ref(null)

// 产品信息
const product = computed(() => store.getters.productActived)
const customerInfo = computed(() => store.state._user.customerInfo)
const productSearchVisible = computed(() => store.state._trade.productSearchVisible)

const handleProductSearch = () => {
    store.commit('_trade/Update_productSearchVisible', !productSearchVisible.value)
}

const isSelfSymbol = computed({
    get: () => {
        if (isEmpty(customerInfo.value)) {
            const newId = parseInt(product.value.symbolId) + '_' + product.value.tradeType
            if (localGet('selfSymbolListStorage')) {
                if (JSON.parse(localGet('selfSymbolListStorage')).find((el) => el === newId)) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } else if (product.value) {
            return store.getters.userSelfSymbolList[product.value.tradeType]?.find(
                (id) => parseInt(id) === parseInt(product.value.symbolId),
            )
        } else {
            return false
        }
    },
    set: (val) => {
        isOptional.value = val
    },
})

const includeSymbol = computed(() =>
    store.state._user.localSelfSymbolList.find((el) => el === parseInt(product.value.symbolId) + '_' + product.value.tradeType),
)

watch(
    () => isSelfSymbol.value,
    (val) => {
        isOptional.value = !!val
    },
    { immediate: true },
)

watch(
    () => includeSymbol.value,
    (val) => {
        isOptional.value = !!val
    },
    { immediate: true },
)

// 合约属性路由
const contractRoute = computed(() => `${route.path}/contract?symbolId=${product.value?.symbolId}&tradeType=${product.value?.tradeType}`)

// 添加自选
const addOptional = () => {
    if (isEmpty(customerInfo.value)) {
        // 未登录 缓存到本地
        var localSelfSymbolList = localGet('selfSymbolListStorage') ? JSON.parse(localGet('selfSymbolListStorage')) : []
        const newId = parseInt(product.value.symbolId) + '_' + product.value.tradeType
        if (localSelfSymbolList.find((el) => el === newId)) {
            localSelfSymbolList.map((it, index) => {
                if (it === newId) {
                    localSelfSymbolList.splice(index, 1)
                    isSelfSymbol.value = false
                    toast.success(t('trade.removeOptionalOk'), {
                        autoClose: 1500,
                    })
                    isOptional.value = false
                }
            })
        } else {
            localSelfSymbolList.push(newId)
            isSelfSymbol.value = true
            isOptional.value = true
            toast.success(t('trade.addOptionalOk'), {
                autoClose: 1500,
            })
        }
        store.dispatch('_user/queryLocalCustomerOptionalList', localSelfSymbolList)
    } else {
        if (optionalLoading.value) return
        optionalLoading.value = true
        if (isSelfSymbol.value) {
            removeCustomerOptional({
                symbolList: [product.value.symbolId],
                tradeType: product.value.tradeType,
            })
                .then((res) => {
                    if (res.check()) {
                        isSelfSymbol.value = false
                        store.dispatch('_user/queryCustomerOptionalList').finally(() => {
                            optionalLoading.value = false
                        })
                        toast.success(t('trade.removeOptionalOk'), {
                            autoClose: 1500,
                        })
                    }
                })
                .catch((err) => {
                    optionalLoading.value = false
                })
        } else {
            addCustomerOptional({
                symbolList: [product.value.symbolId],
                tradeType: product.value.tradeType,
            })
                .then((res) => {
                    if (res.check()) {
                        isSelfSymbol.value = true
                        // 手动修改optional值
                        store.commit('_user/Update_optional', 1)
                        store.dispatch('_user/queryCustomerOptionalList').finally(() => {
                            optionalLoading.value = false
                        })
                        toast.success(t('trade.addOptionalOk'), {
                            autoClose: 1500,
                        })
                    }
                })
                .catch((err) => {
                    optionalLoading.value = false
                })
        }
    }
}
</script>

<style lang="scss" scoped>
.symbol-info {
    background-color: var(--contentColor);
    display: flex;
    align-items: center;
    line-height: normal;
    .scroll-button {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40px;
        height: 100%;
        border: unset;
        border-radius: 0;
        z-index: 99;
        color: var(--text-superlight);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;

        &:nth-of-type(1) {
            left: 0;
            background: linear-gradient(to left, transparent, var(--contentColor) 40%);
        }

        &:last-of-type {
            justify-content: flex-end;
            right: 0;
            background: linear-gradient(to right, transparent, var(--contentColor) 40%);
        }
    }
    :deep .el-scrollbar__view {
        height: 100%;
    }

    .item {
        &.ohlc {
            flex: 0 1 80px;
            margin-right: 20px;
        }
        .etfTip {
            width: 400px;
            padding: 10px;
        }
        &.symbol-name {
            flex: none;
            display: flex;
            align-items: center;
            &:hover {
                background-color: var(--primaryAssistColor);
            }
            .search-symbol {
                padding: 6px 0 6px 6px;
                cursor: pointer;
                .el-input__icon {
                    margin-right: 6px;
                }
            }
            .symbol-name-head {
                display: flex;
                align-items: flex-start;
                white-space: nowrap;
            }
            .symbol-icon {
                flex: none;
                margin-right: 4px;
                align-self: center;
                .icon {
                    display: flex;
                    align-items: center;
                    img {
                        width: 24px;
                        height: 24px;
                        border: 1px solid #fff;
                        border-radius: 100%;
                        &:last-child {
                            margin-left: -10px;
                        }
                    }
                }
            }
        }
        .name {
            display: flex;
            align-items: center;
            font-weight: bold;
            span {
                font-size: 22px;
                margin-right: 10px;
            }
        }
        .last-price {
            font-size: 22px;
            line-height: 28px;
            font-weight: bold;
        }
        .code {
            color: var(--minorColor);
        }
        &.range,
        &.ohlc {
            color: var(--mainColor);
            font-size: 16px;
            line-height: normal;
            white-space: nowrap;
        }
        .muted {
            font-size: 12px;
            line-height: 24px;
        }
    }

    @media screen and (max-width: 1450px) {
        .item {
            margin-right: 8px;
            .name {
                span {
                    font-size: 16px;
                }
            }
            .last-price {
                font-size: 20px;
            }
            &.symbol-name {
                .symbol-icon {
                    .icon {
                        img {
                            width: 22px;
                            height: 22px;
                        }
                    }
                }
            }
        }
    }
}
</style>
