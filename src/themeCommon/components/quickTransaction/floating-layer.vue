<template>
    <div v-if='show' :class="['parent', { 'parent-mask': showMask }]" :style='parentStyle'>
        <VueDraggableResizable
            :active='active'
            class-name='quickTransaction'
            drag-handle='#drag-handle'
            :draggable='true'
            h='auto'
            :parent='true'
            :resizable='false'
            w='auto'
            :x='x'
            :y='y'
            @dragging='onDragging'
            @dragstop='onDragstop'
        >
            <div class='module-block'>
                <!-- 下单前提示 -->
                <popover-tips v-model='showParamsInvalid' auto-close :close-time='1500' :text='paramsInvalidResult' />
                <div id='drag-handle' class='flex items-center justify-center bg-primaryAssistColor px-1 cursor-pointer drag-button'>
                    <van-icon class='icon' name='wap-nav' />
                </div>
                <div class='drag-box'>
                    <div class='direction'>
                        <button class='sell-button' @click="submitHandler('sell', 'button')">
                            {{ $t('trade.sell') }}
                        </button>
                        <div class='row flex flex-col justify-center items-center p-1'>
                            <div v-if='isQuantity' class='text-xs text-normalColor'>
                                {{ `${$t('trade.volumes')}(${$t('trade.volumeUnit')})` }}
                            </div>
                            <div v-else class='text-xs text-normalColor'>
                                {{ $t('trade.collateral') }}&nbsp;{{ product.isCryptocurrency ? '(5.0-100K)' : '(10.0-100K)' }}
                            </div>
                            <van-field
                                v-model='volume'
                                autocomplete='off'
                                format-trigger='onChange'
                                :formatter='formatter'
                                maxlength='16'
                                :placeholder='placeholder'
                                type='number'
                                @input='onInput'
                            />
                        </div>
                        <button class='buy-button' @click="submitHandler('buy', 'button')">
                            {{ $t('trade.buy') }}
                        </button>
                    </div>
                    <div class='price'>
                        <div class='sell-price' @click="submitHandler('sell', 'price')">
                            {{ product.sell_price === 'NaN' ? '--' : product.sell_price }}
                        </div>
                        <div class='buy-price' @click="submitHandler('buy', 'price')">
                            {{ product.buy_price === 'NaN' ? '--' : product.buy_price }}
                        </div>
                    </div>
                </div>
                <div class='flex items-center justify-center bg-primaryAssistColor px-1 cursor-pointer close-button' @click='close'>
                    <van-icon class='cross' name='cross' />
                </div>
            </div>
        </VueDraggableResizable>
    </div>
    <!-- 下单确认弹窗 -->
    <Trade ref='tradeRef' :calculate-num='calculateNum' :request-price='requestPrice' @callback='handleCallback' />
</template>

<script>
import { ref, reactive, toRefs, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from '@/utils/util'
import { mul, formatInputNumber, formatAmount, getDecimalNum, toFixed } from '@/utils/calculation'
import mitt from '@/utils/mitt'
import { setFloatPoint, localSetPoint } from '@planspc/hooks/tradeFloatLayer'
import VueDraggableResizable from 'vue-draggable-resizable/src'
import popoverTips from '@/components/popover-tips'
import Trade from '@/themeCommon/components/trade'
import { useAssets } from '@/hooks/assets'
export default {
    components: {
        VueDraggableResizable,
        popoverTips,
        Trade,
    },
    props: {
        // 当前模块
        module: {
            type: String,
            default: '',
        },
        // 当前产品数据
        product: {
            type: Object,
            default: () => {},
        },
        // 默认杠杆倍数
        leverage: {
            type: [String, Number],
            default: '',
        },
        // 当前信号想去数据
        signal: {
            type: Object,
            default: () => {},
        },
        /** 预计执行下单数量 */
        calculateNum: {
            type: [String, Number],
        },
    },
    setup (props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        /** 是否按量下单 */
        const isQuantity = computed(() => {
            return store.state._trade.entryType === 1
        })
        // ref
        const tradeRef = ref(null)
        // state
        const state = reactive({
            // 是否显示组件，根据缓存设置
            show: false,
            // 是否显示遮罩层
            showMask: false,
            // 是否显示组件内容
            showContent: false,
            // 当前组件是否在活动中
            active: true,
            // 父级样式
            parentStyle: {},
            // x轴位置
            x: 0,
            // y轴位置
            y: 0,
            // 手数
            volume: '',
            // 交易方向 买入-buy 卖出-sell
            submitType: '',
            // 杠杆倍数初始值
            multipleVal: 1,
            // 是否显示下单参数验证提示
            showParamsInvalid: false,
            // 下单参数验证结果
            paramsInvalidResult: '',
        })

        // 输入框范围提示
        const inputRangeTip = computed(() => {
            if (state.showMask) return ''
            const product = props.product
            const volumeRange = product.minVolume ? `${t('trade.tradeRange', { min: product.minVolume, max: product.maxVolume })}` : ''
            return volumeRange
        })
        // 用户信息
        const customerInfo = computed(() => store.state._user.customerInfo)
        // 当前账户
        const account = useAssets()

        // 下单保证金限制
        const placeholder = computed(() => {
            if (isQuantity.value) {
                if (!props.product?.minVolume || !props.product?.maxVolume) return
                return `${t('trade.range')}${props.product.minVolume} - ${props.product.maxVolume}`
            }
            if (!props.product?.singleMinAmount || !props.product?.singleMaxAmount) return
            const minDigital = props.product?.singleMinAmount?.split('.')?.[1]?.length || 0
            const maxDigital = props.product?.singleMaxAmount?.split('.')?.[1]?.length || 0
            return `${t('trade.range')}${formatAmount(props.product.singleMinAmount, minDigital)} - ${formatAmount(
                props.product.singleMaxAmount,
                maxDigital,
            )}`
        })

        // 手数输入框输入事件
        const onInput = (e) => {
            const digits = props.product?.numberDigits
            state.volume = formatInputNumber(e, digits)
        }

        // 每当组件拖动时调用
        const onDragging = debounce(
            () => {
                state.showMask = true
                document.body.classList.add('user-dragging')
            },
            200,
            true,
        )

        // 每当组件停止被拖动时调用
        const onDragstop = (x, y) => {
            state.showMask = false
            localSetPoint(x, y, props.module)
            document.body.classList.remove('user-dragging')
        }

        // 设置快捷交易面板是否显示
        const setTradeFloatLayer = (boole) => {
            state.show = boole
            if (boole) {
                setPoint()
            }
        }

        // 关闭快捷交易面板
        const close = () => {
            state.show = false
            mitt.emit('closeTradeFloatLayer')
        }

        // 验证下单数据是否异常
        const paramsInvalid = () => {
            if (!state.volume) return isQuantity.value ? t('trade.inputVolume') : t('trade.inputVolume2')
            else if (isNaN(state.volume) || Number(state.volume) <= 0) return t('trade.volumeError')
            else if (!account.value) return t('trade.nullAssets')
        }

        /** 市价单请求价格 */
        const requestPrice = computed(() => (state.direction === 'sell' ? props.product.sell_price : props.product.buy_price))

        // 下单参数
        const orderParams = () => {
            const product = props.product
            const paramsInvalidResult = paramsInvalid()
            if (paramsInvalidResult) {
                state.showParamsInvalid = true
                state.paramsInvalidResult = paramsInvalidResult
                return null
            }
            const direction = state.submitType === 'sell' ? 2 : 1
            const price_digits = product.hasOwnProperty('price_digits') ? product.price_digits : product.symbolDigits
            const p = Math.pow(10, price_digits)
            const params = {
                bizType: 1, // 业务类型。1-市价开；2-限价开
                direction, // 订单买卖方向。1-买；2-卖；
                symbolId: product.symbolId,
                accountCurrency: account.value?.currency,
                accountId: account.value?.accountId,
                requestTime: Date.now(),
                requestNum: state.volume,
                operationType: 2,
                requestPrice: mul(requestPrice.value, p),
                accountDigits: account.value?.digits,
                tradeType: product.tradeType,
                entryType: store.state._trade.entryType,
                requestPriceTarget: requestPrice.value, // 提交的报价，用于显示用
            }
            // 全仓、逐仓玩法产品设置杠杆倍数需要传crossLevelNum字段
            if ([1, 2].includes(product.tradeType) && Number(product.marginInfo?.type) === 2) {
                params.crossLevelNum = Number(state.multipleVal)
            }
            return params
        }

        // 点击买入卖出按钮
        const submitHandler = (type, btnType) => {
            if (customerInfo.value) {
                state.submitType = type
                const params = orderParams()
                if (!params) return
                tradeRef.value.open(
                    {
                        ...params,
                        volume: state.volume,
                    },
                    type,
                ) // 下单确认框
            } else {
                router.push({
                    path: '/login',
                    query: {
                        back: encodeURIComponent(route.fullPath),
                    },
                })
            }
        }

        // 下单回调
        const handleCallback = ({ res, params }) => {
            if (res.check()) {
                const data = res.data
                const localData = Object.assign({}, params, data)
                const orderId = data.orderId || data.id
                sessionStorage.setItem('order_' + orderId, JSON.stringify(localData))
                // 刷新委托列表
                store.dispatch('_trade/queryPBOOrderPage', { tradeType: params.tradeType })
                // 刷新成交记录
                store.dispatch('_trade/tradeRecordList')
                // 刷新持仓列表
                if ([1, 2].includes(props.product?.tradeType)) {
                    store.dispatch('_trade/queryPositionPage', {
                        tradeType: params.tradeType,
                        sortFieldName: 'openTime',
                        sortType: 'desc',
                    })
                }
                // 清除表单
                state.volume = ''
            }
        }

        // 设置父级样式
        const setParentStyle = () => {
            const headerNavElem = document.querySelector('.header-nav')
            const rect = headerNavElem?.getBoundingClientRect()
            if (rect) {
                state.parentStyle = {
                    top: rect.height + 'px',
                }
            } else {
                state.parentStyle = {
                    top: 0,
                }
            }
        }

        // 设置交易面板位置
        const setPoint = () => {
            nextTick(() => {
                if (state.show) {
                    const module = props.module
                    let pageElem = ''
                    // 交易页面
                    if (module === 'order') {
                        pageElem = document.querySelector('.tv-head')
                    }
                    // 信号详情页面
                    if (module === 'signalDetail') {
                        pageElem = document.querySelector('#chart-title')
                    }
                    const { x, y } = setFloatPoint(module, pageElem)
                    state.x = x
                    state.y = y
                }
            })
        }

        const formatter = (value) => {
            value = value?.replace('-', '') || ''
            const digits = account.value?.digits
            if (value === '') return ''
            if (Number(value) > 999999999) value = 999999999
            if (getDecimalNum(value) > digits) return toFixed(value, digits)
            return value
        }
        // 监听产品symbolId
        watch(
            () => props.product.symbolId,
            () => {
                if (props.product.symbolId) {
                    state.volume = ''
                }
            },
            {
                immediate: true,
            },
        )

        watch(
            () => isQuantity.value,
            () => {
                state.volume = ''
            },
            {
                immediate: true,
            },
        )

        // 监听leverage
        watch(
            () => props.leverage,
            () => {
                state.multipleVal = props.leverage
            },
            {
                immediate: true,
            },
        )

        watch(
            () => state.show,
            () => {
                if (state.show) {
                    localStorage.setItem('__FLOATING_LAYER_VISIBILITY__', state.show)
                } else {
                    localStorage.removeItem('__FLOATING_LAYER_VISIBILITY__')
                }
            },
        )

        onMounted(() => {
            setParentStyle()
            setTimeout(() => {
                state.show = localStorage.getItem('__FLOATING_LAYER_VISIBILITY__')
                setPoint()
                mitt.on('setTradeFloatLayer', setTradeFloatLayer)
                window.addEventListener('resize', setPoint, true)
            }, 800)
        })

        onBeforeUnmount(() => {
            mitt.off('setTradeFloatLayer', setTradeFloatLayer)
            window.removeEventListener('resize', setPoint, true)
        })

        return {
            ...toRefs(state),
            inputRangeTip,
            tradeRef,
            onInput,
            onDragging,
            onDragstop,
            close,
            submitHandler,
            handleCallback,
            isQuantity,
            account,
            placeholder,
            formatter,
            requestPrice
        }
    },
}
</script>

<style lang="scss" scoped>
.parent {
    width: 100vw;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 198;
    visibility: hidden;
}
.parent-mask {
    visibility: visible;
}
.quickTransaction {
    display: inline-flex;
    visibility: visible;
    border: none;
}
.module-block {
    display: flex;
    position: relative;
    border-radius: 8px;
    border: 1px solid var(--minorColor);
    &:deep {
        .popover-tips {
            min-width: auto;
        }
    }
    .drag-button {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      .close-button {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    .drag-box {
        display: flex;
        flex-direction: column;
        border-left-width: 0;
        border-right-width: 0;

        .direction {
            display: flex;
            position: relative;
            button {
                width: 72px;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
                &.sell-button {
                    background: var(--fallColor);
                }
                &.buy-button {
                    background: var(--riseColor);
                }
            }
            .row {
                position: relative;
                border-top: 1px solid var(--lineColor);
                background: var(--contentColor);
            }
            :deep {
                .van-field {
                  padding: 0;
                }
                .van-field__control {
                    width: 100%;
                    margin: 0;
                    font-size: 12px;
                    text-align: center;
                    font-weight: bold;
                    background: transparent;
                }
            }
        }
        .price {
            display: flex;
            justify-content: space-between;
            position: relative;
            .sell-price,
            .buy-price {
                flex: 1;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                height: 36px;
                color: #fff;
                cursor: pointer;
            }
            .sell-price {
                background: var(--fallColor);
            }
            .buy-price {
                background: var(--riseColor);
            }
        }
    }
}
</style>

<style lang="scss">
.user-dragging {
    user-select: none;
}
</style>
