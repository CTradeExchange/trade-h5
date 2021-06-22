<template>
    <div class='product-item' @click='toPositionDetail(data)'>
        <!-- {{ data.direction }} -->
        <div class='item'>
            <div class='cell'>
                <div class='th'>
                    <div class='name'>
                        {{ data.symbolName }}
                    </div>
                    <div class='lot'>
                        {{ data.symbolName }}
                    </div>
                </div>
            </div>
            <div class='cell'>
                <div class='price'>
                    <div>
                        <div class='price_item'>
                            <span class='title' :class="Number(data.direction) === 1 ? 'riseColor' : 'fallColor'">
                                {{ Number(data.direction) === 1 ? $t('trade.buy') :$t('trade.sell') }}
                            </span><span>
                                {{ positionVolume }} {{ $t('trade.volumeUnit') }}
                            </span>
                        </div>
                        <div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.pendingPrice') }}
                            </span>
                            <span class='grayColor'>
                                {{ Number(data.direction) === 1 ? product.buy_price : product.sell_price }}
                            </span>
                        </div>
                    </div><div>
                        <div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.expired') }}
                            </span>
                            <span class=''>
                                {{ Number(data.expireType) === 1 ? $t('trade.expireType1'): $t('trade.expireType2') }}
                            </span>
                        </div><div class='price_item'>
                            <span class='title'>
                                {{ $t('trade.currentPrice') }}
                            </span><span class=''>
                                {{ Number(data.direction) === 1 ? product.sell_price : product.buy_price }}
                            </span>
                        </div>
                    </div>
                </div><div class='ft'>
                    <div class='bd'>
                        <i class='icon_icon_chart hidden'></i>
                    </div>
                    <van-button
                        color='#477fd3'
                        hairline
                        plain
                        size='mini'
                        type='default'
                        @click.stop='handleClose'
                    >
                        {{ $t('cancel') }}
                    </van-button>
                </div>
            </div>
        </div>
    </div>

    <DialogClosePosition v-if='cpVis' :data='data' :show='cpVis' @update:show='updateShow' />
</template>

<script>
import { Toast } from 'vant'
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { minus } from '@/utils/calculation'
import DialogClosePosition from '@c/components/dialogClosePosition'
import { closePboOrder } from '@/api/trade'
export default {
    components: {
        DialogClosePosition
    },
    props: ['data'],
    setup ({ data }) {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            show: false,
            loading: false,
            cur: {},
            cpVis: false
        })
        const customerInfo = computed(() => store.state._user.customerInfo)
        const positionList = computed(() => store.state._trade.positionList)
        const product = computed(() => store.state._quote.productMap[data.symbolId])
        const positionVolume = computed(() => minus(data.openVolume, data.closeVolume))

        const toPositionDetail = (item) => {
            store.commit('_quote/Update_productActivedID', item.symbolId)
            router.push({ path: '/pendingDetail', query: { symbolId: item.symbolId, id: item.id } })
        }

        // 取消订单
        const handleClose = () => {
            state.show = false
            // bizType 0-默认初始值；1-市价开；2-市价平；3-止损平仓单；4-止盈平仓单；5-爆仓强平单；6-到期平仓单；7-销户平仓单；8-手动强平单；9-延时订单；10-限价预埋单；11-停损预埋单；
            const params = {
                pboId: state.cur.id,
                bizType: state.cur.bizType
            }
            closePboOrder(params).then(res => {
                if (res.check()) {
                    Toast('删除成功')
                    store.dispatch('_trade/queryPBOOrderPage')
                }
            }).catch(err => {
                console.log(err)
            })

            // router.push({ name: 'Order', query: { symbolId: state.cur.symbolId } })
        }

        const updateShow = (val) => {
            state.cpVis = val
        }

        return {
            ...toRefs(state),
            positionList,
            customerInfo,
            product,
            positionVolume,
            toPositionDetail,
            updateShow,
            handleClose
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.product-item {
    .item {
        position: relative;
        margin-bottom: rem(20px);
        padding: rem(20px) rem(30px) 0;
        overflow: hidden;
        background: #FFF;
        border-radius: rem(10px);
        .cell {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            width: 100%;
            margin-bottom: rem(20px);
            color: #999;
            font-size: rem(20px);
            line-height: 1.45;
            .th {
                flex: 1;
            }
            &:last-child {
                align-items: flex-end;
            }
            .bd {
                position: relative;
                top: rem(4px);
                display: inline-block;
                margin-right: rem(20px);
                text-align: center;
            }
            .price {
                flex: 1;
                .price_item {
                    display: inline-block;
                    width: rem(220px);
                    span {
                        padding: 0 rem(4px);
                    }
                    .title {
                        margin-right: rem(4px);
                        padding: 0;
                    }
                }
            }
            .ft {
                text-align: right;
                vertical-align: middle;
                .van-button {
                    vertical-align: middle;
                    background: rgb(243, 248, 255);
                    border-color: rgb(243, 248, 255);
                }
            }
            .amount {
                padding-right: rem(6px);
                font-weight: 600;
                font-size: rem(34px);
            }
            .currency {
                position: relative;
                top: rem(6px);
            }
            .warn {
                color: #333;
                background-color: #FFA700;
            }
            .name {
                display: inline-block;
                max-width: rem(360px);
                color: #333;
                font-size: rem(28px);
                line-height: rem(38px);
                vertical-align: bottom;
            }
            .lot {
                display: inline-block;
                margin-left: 0.5em;
                vertical-align: bottom;
            }
            .time {
                color: #999;
                font-size: rem(20px);
            }
        }
        .icon_icon_chart {
            display: inline-block;
            width: rem(52px);
            height: rem(46px);
            font-size: rem(30px);
            font-style: normal;
            line-height: rem(46px);
            text-align: center;
            border-radius: rem(6px);
            &.hidden {
                color: #477FD3;
                background-color: #F3F8FF;
            }
        }
        .van-button {
            border-radius: rem(6px);
            &__text {
                color: #477FD3;
            }
            &--mini {
                min-width: rem(124px);
                height: rem(48px);
                padding: 0 rem(10px);
                font-size: rem(24px);
                line-height: rem(48px);
            }
        }
    }
}
</style>
