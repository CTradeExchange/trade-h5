<template>
    <div ref='chartWrap' class='chartWrap'>
        <tv v-if='initialValue' ref='tv' :initial-value='initialValue' @symbolChanged='symbolChanged'>
            <template #default='{ setSymbol,resolutionList, setResolution }'>
                <Top>
                    <template #right>
                        <div class='btn-wrap'>
                            <div class='btn'>
                                <van-popover
                                    v-model:show='showProductPopover'
                                    :actions='filterProductList'
                                    class='tv-product-popover'
                                    overlay
                                    @select='setSymbol'
                                >
                                    <template #reference>
                                        <van-button class='btn' type='primary'>
                                            <van-icon name='points' size='25' />
                                        </van-button>
                                    </template>
                                </van-popover>
                            </div>

                            <div class='btn'>
                                <van-popover
                                    v-model:show='showResolutionPopover'
                                    :actions='resolutionList'
                                    class='tv-resolution-popover'
                                    overlay
                                    @select='e => setResolution(e.value)'
                                >
                                    <template #reference>
                                        <van-button class='btn' type='primary'>
                                            <van-icon name='clock-o' size='25' />
                                        </van-button>
                                    </template>
                                </van-popover>
                            </div>
                            <div class='btn' @click='gotoOrder'>
                                <i class='icon icon_xindingdan'></i>
                            </div>
                        </div>
                    </template>
                </Top>
            </template>
        </tv>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import tv from '@/components/tradingview/tv'
import { Popover } from 'vant'
import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import { useRouter, useRoute } from 'vue-router'

export default {
    components: {
        tv,
        Top,
        [Popover.name]: Popover
    },
    data () {
        return {
            // height: 0,
            // width: 0,
            showProductPopover: false,
            showResolutionPopover: false,
        }
    },
    mounted () {
        // const chartWrap = this.$refs.chartWrap
        // this.height = chartWrap.clientHeight - 100
        // this.width = chartWrap.clientWidth
        console.log('chart mounted')
    },
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        // const productList = computed(() => store.state._quote.productList)
        const productList = computed(() => store.state._quote.productList)

        // 订阅产品
        const subscribList = productList.value.map(({ symbolId }) => symbolId)
        store.dispatch('_quote/querySymbolBaseInfoList', subscribList)
        QuoteSocket.send_subscribe(subscribList)

        const filterProductList = computed(
            () => productList.value
                .slice(0, 10)
                .filter(e => e.symbolName)
                .map(e => ({
                    text: e.symbolName,
                    value: e.symbolId,
                    description: e.symbolName,
                    digits: e.symbolDigits
                }))
        )

        const initialValue = computed(() => {
            if (!filterProductList.value.length) {
                return null
            }
            const symbolId = localStorage.getItem('symbolIdForChart')
            if (symbolId) {
                const target = filterProductList.value.find(e => e.value + '' === symbolId)
                if (target) {
                    return target
                }
            }
            return filterProductList.value[0]
        })

        watch(initialValue, (val) => {
            val && localStorage.setItem('symbolIdForChart', val.value)
        })

        const gotoOrder = () => {
            router.push({
                name: 'Order',
                query: {
                    ...route.query,
                    symbolId: localStorage.getItem('symbolIdForChart') || this.initialValue.value
                },
            })
        }

        return {
            filterProductList,
            initialValue,
            gotoOrder
        }
    },
    methods: {
        symbolChanged (id) {
            localStorage.setItem('symbolIdForChart', id)
        },

    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.chartWrap {
    flex: 1;
    margin-bottom: rem(100px);
}
</style>

<style lang="scss">
.tv-product-popover {
    .van-popover__action {
        width: auto;
    }
}
.tv-resolution-popover {
    .van-popover__action {
        width: auto;
    }
}
.btn-wrap {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    .btn {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        padding: 0 10px;
        background: var(--primary);
        border: 0;
        .van-button {
            padding: 0;
        }
        i {
            align-self: center;
            font-size: 22px;
        }
    }
}

</style>
