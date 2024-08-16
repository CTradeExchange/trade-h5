<template>
    <div class='tradeDataInfo'>
        <div class='action-content'>
            <van-tabs class='page-tabs'>
                <van-tab :name='1'>
                    <template #title>
                        <div class='trading-list-item-type'>
                            <span>{{ $t('signal.subscribe.realTimeSignal') }}</span>
                        </div>
                    </template>
                    <div class='text-base font-bold px-3 py-4 bg-contentColor'>
                        {{ `${symbolName} ${$t('signal.signal')}` }}
                    </div>
                    <div class='real-signal-list'>
                        <SignalList
                            :extra-props='params'
                            :item-type='4'
                            scenes='productDetail'
                            :show-thead='true'
                            signal-type='indicator'
                            @subscribe-signal='subscribeSignalHandle'
                        />
                    </div>
                </van-tab>
                <van-tab :name='2'>
                    <template #title>
                        <div class='trading-list-item-type'>
                            <span>{{ $t('signal.subscribe.mineSignal') }}</span>
                        </div>
                    </template>
                    <SignalMine scenes='productDetail' @manageMySignals='manageMySignals' @subscribe-signal='subscribeSignalHandle' />
                </van-tab>

                <van-tab :name='3'>
                    <template #title>
                        <div class='trading-list-item-type'>
                            <span>{{ $t('headLineHome.orderBook') }}</span>
                        </div>
                    </template>
                    <div class='bg-contentColor'>
                        <template v-if='product?.enableDepthTrade === 2'>
                            <div class='text-base font-bold px-3 py-4 bg-contentColor'>
                                {{ $t('trade.handicap') }}
                            </div>
                            <MobileHandicop :show-pending='false' :symbol-id='symbolid' />
                        </template>
                        <div class='text-base font-bold px-3 py-4 bg-contentColor'>
                            {{ $t('headLineHome.marketHistory') }}
                        </div>
                        <MarketHistory :symbol-id='symbolid' />
                    </div>
                </van-tab>
            </van-tabs>
        </div>

        <div class='action-footer'>
            <div class='action-footer-box'>
                <van-button block class='tradingBuy' size='normal' @click="confirmHandle('buy')">
                    <svg height='9.856' viewBox='0 0 15.704 9.856' width='15.704' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='m529-488.59v5.67l-2.113-2.109-5.326 5.319-2.924-2.921-3.9 3.9-1.444-1.448 5.341-5.341 2.924 2.924 3.882-3.882-2.113-2.109z'
                            fill='#fff'
                            transform='translate(-513.3 488.59)'
                        />
                    </svg>
                    <span class='action-text'>
                        {{ $t('trade.long') }}
                    </span>
                </van-button>

                <van-button block class='tradingSell' size='normal' @click="confirmHandle('sell')">
                    <svg height='9.856' viewBox='0 0 15.704 9.856' width='15.704' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='m0 0v5.67l2.113-2.11 5.326 5.32 2.924-2.921 3.9 3.9 1.437-1.451-5.337-5.341-2.924 2.924-3.882-3.882 2.113-2.109z'
                            fill='#fff'
                            transform='matrix(-1 0 0 -1 15.704 9.856)'
                        />
                    </svg>
                    <span class='action-text'>
                        {{ $t('trade.short') }}
                    </span>
                </van-button>
            </div>
        </div>
        <!-- 订阅信号弹窗 -->
        <DrawOperationSubscribe />
        <DrawerSubscribe ref='mineSubscribeRef' />
    </div>
</template>

<script>
import { reactive, toRefs, watch, ref, computed } from 'vue'
import MarketHistory from './marketHistory.vue'
import MobileHandicop from '@plans/modules/handicap/index'
import SignalList from '@/plugins/signal/components/signal-search-list.vue'
import { formatScFromCats } from '@/plugins/signal/utils/util'
import SignalMine from '@/plugins/signal/modules/signal-mine.vue'
import { useRouter } from 'vue-router'
import useSignal from '@/plugins/signal/hooks/signal'
import DrawOperationSubscribe from '@/plugins/signal/modules/subscribe/drawer-operationSubscribe.vue'
import { useStore } from 'vuex'
import DrawerSubscribe from '@/plugins/signal/modules/subscribe/drawer-subscribe.vue'

export default {
    name: 'Handicap',
    components: {
        MobileHandicop,
        MarketHistory,
        SignalList,
        SignalMine,
        DrawOperationSubscribe,
        DrawerSubscribe,
    },
    props: ['symbolid', 'symbolCode', 'symbolName', 'tradeType'],

    setup (props) {
        const { subscribeSignal } = useSignal()
        const router = useRouter()
        const store = useStore()
        const product = computed(() => store.getters.productActived)

        // 我的订阅
        const mineSubscribeRef = ref(null)
        const state = reactive({
            currentTitle: '3',
            params: {
                sc: '',
                sy: '',
            },
        })

        watch(
            () => props.symbolCode,
            (newVal) => {
                state.params.sy = formatScFromCats(newVal)
            },
            { immediate: true },
        )

        const confirmHandle = (type) => {
            router.push(`/order?symbolId=${props.symbolid}&tradeType=${props.tradeType}&showbtnType=${type}`)
        }

        const subscribeSignalHandle = () => {
            subscribeSignal({ payload: state.params })
        }

        const manageMySignals = () => {
            mineSubscribeRef.value.open()
        }

        return {
          ...toRefs(state),
          confirmHandle,
          subscribeSignalHandle,
          manageMySignals,
          mineSubscribeRef,
          product
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.tradeDataInfo {
  width: 100%;
  min-height: 100px;
  margin-top: 8px;
  background-color: var(--contentColor);
  :deep(.signal-tab) {
      padding: 0 12px;
  }
  :deep {
      .signal-warp {
          margin: 0;
          padding: 0;
      }
      .list-item {
          .signal-item {
              pointer-events: none;
          }
      }
      .signal-item {
          padding: 0;
          margin: 0 12px;
          .van-icon {
              display: none;
          }
      }
      .signal-item-th {
          border: none;
          margin: 0;
          padding: 0 12px;
      }
      .signal-tab-link {
          display: none;
      }
      .signal-mine-head {
          padding: 12px 12px 0 12px;
      }
  }
  .real-signal-list {
      :deep {
          .signal-item-th {
              padding: 0;
          }
      }
  }
}

.page-tabs {
  :deep {
      > .van-tabs__wrap {
          border-bottom: 1px solid var(--lineColor);
          font-size: 14px;
          padding: 0 12px;
          background-color: var(--contentColor);
          .van-tab {
              flex: none;
              margin-right: 30px;
          }
          .van-tabs__line {
              width: 0;
          }
      }
  }
}
.action-content {
  padding-bottom: 90px;
}
.action-text {
  margin-left: 4px;
}

.action-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 10;
  background-color: #fff;
  .action-footer-box {
      padding: 0 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-height: 40px;
      margin-bottom: 20px;
      margin-top: 20px;
      .tradingSell {
          max-width: 44vw;
          background: var(--fallColor);
          border-color: var(--fallColor);
          color: #fff;
          font-family: 'Inter';
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
      }
      .tradingBuy {
          max-width: 44vw;
          background: var(--riseColor);
          border-color: var(--riseColor);
          color: #fff;
          font-family: 'Inter';
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
      }
  }
}
</style>
