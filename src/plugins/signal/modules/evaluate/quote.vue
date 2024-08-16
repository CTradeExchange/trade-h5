<template>
    <div class='quote'>
        <div v-if='isPC' class='title'>
            <h3>
                <span> {{ $t('signal.valuable.evaluateDetailTitle') }}</span>
            </h3>
        </div>
        <div class='list'>
            <div class='li'>
                <product-icon :symbol-code='symbolCode' />
            </div>
            <template v-if='product?.symbolCode'>
                <div class='li' :class='product?.cur_color'>
                    <van-icon name='down' />
                    <PriceColor
                        class='cur_price'
                        :product='product'
                        type='cur'
                    />
                </div>
                <div class='li' :class='product?.upDownColor'>
                    {{ product.upDownAmount }}
                </div>
                <div class='li' :class='product?.upDownColor'>
                    {{ product.upDownWidth }}
                </div>
                <div class='li'>
                    <i class='icon_tubiao' @click='handleTrade'></i>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { computed, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import productIcon from '@/plugins/signal/components/product-icon'
import { QuoteSocket } from '@/plugins/socket/socket'
import PriceColor from '@planspc/components/priceColor.vue'
import useSignal from '@/plugins/signal/hooks/signal'

export default {
    components: {
        productIcon,
        PriceColor
    },
    props: {
        symbolCode: String
    },
    setup (props) {
        const store = useStore()

        const { jumpTrade } = useSignal()

        const moduleId = 'SignalEvaluateDetail'
        let unSubscribe = () => {}

        // 产品信息
        const product = computed(() => {
            return store.getters['_signal/getSignalProduct'](props.symbolCode)
        })

        // 获取产品详情数据
        watch(() => product.value.symbolId, () => {
            const { symbolId, tradeType } = product.value
            store.dispatch('_quote/querySymbolInfo', { symbolId, tradeType })
        })

        watch([() => product.value, store.state._quote.symbolCodeMap], (val) => {
            if (val[0] && val[0].symbolKey && val[1] && Object.keys(val[1]).length) {
                unSubscribe = QuoteSocket.add_subscribe({
                    moduleId,
                    symbolKeys: [val[0].symbolKey]
                })
            }
        }, { immediate: true })

        onUnmounted(() => {
            unSubscribe()
        })

        // 去交易
        const handleTrade = () => {
            jumpTrade(props.symbolCode)
        }

        return {
            product,
            handleTrade,
            isPC: window.isPC
        }
    }
}
</script>

<style lang="scss" scoped>
.quote {
    text-align: center;
    .title {
        padding-top: 30px;
        h3 {
            font-size: 24px;
            display: inline-flex;
            align-items: center;
            span {
                margin-left: 4px;
            }
        }
        @media screen and (max-width: 768px) {
            padding-top: 0;
            h3 {
                font-size: 18px;
            }
        }
    }
    .list {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        @media screen and (max-width: 768px) {
            padding: 0 0 10px;
        }
        .li {
            margin-right: 12px;
            display: flex;
            align-items: center;
            font-size: 18px;
            @media screen and (max-width: 768px) {
                font-size: 16px;
                &:first-child {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-bottom: 15px;
                }
            }
            i {
                line-height: normal;
            }
            .icon_tubiao {
                cursor: pointer;
            }
            &.riseColor {
                i.van-icon-down {
                    transform: rotate(180deg);
                }
            }
        }
    }
}
</style>
