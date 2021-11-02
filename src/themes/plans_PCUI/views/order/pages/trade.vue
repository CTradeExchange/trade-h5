<template>
    <div>
        <van-tabs v-model='active' class='tabs' :color='$style.primary'>
            <van-tab class='trade-wrap' title='市价单'>
                <div class='buy-wrap'>
                    <div class='form-item'>
                        <label for=''>
                            买入价
                        </label>
                        市场最优价买入
                    </div>
                    <div class='form-item'>
                        <label for=''>
                            买入价
                        </label>
                        <OrderVolume v-model='volume' v-model:entryType='entryType' :account='account' class='cellMarginTop' :product='product' />
                    </div>
                    <div class='balance'>
                        <p class='label'>
                            可用
                        </p>
                        <div class='val'>
                            <span>  50000.154 USD</span>
                            <router-link to='/'>
                                划转
                            </router-link>
                        </div>
                    </div>

                    <div class='footerBtn buy'>
                        <van-button block :disabled='loading' :loading='loading' size='normal' @click='submitHandler'>
                            {{ $t('trade.buyText') }}
                        </van-button>
                    </div>
                </div>
                <div class='sell-wrap'>
                    <div class='footerBtn sell'>
                        <van-button block :disabled='loading' :loading='loading' size='normal' @click='submitHandler'>
                            $t('trade.sellText')
                        </van-button>
                    </div>
                </div>
            </van-tab>
            <van-tab title='挂单'>
                <div class='sell-wrap'>
                    买
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import hooks from '../orderHooks'
import OrderVolume from './components/orderVolume'

export default {
    components: { OrderVolume },
    setup () {
        const store = useStore()
        const product = computed(() => store.getters.productActived)
        const state = reactive({
            volume: '',
            entryType: 1, // 1按数量下单 2按成交额下单
            loading: false,
        })

        const { bizType, account, findProductInCategory, switchProduct } = hooks(state)

        // 点击提交按钮
        const submitHandler = () => {}

        return {
            bizType,
            product,
            account,
            submitHandler,
            ...toRefs(state),
        }
    }

}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.tabs{
    width: 150px;
    .buy-wrap{
        .form-item{
            height: 40px;
            background: var(--bgColor);
            border-radius: 4px;
        }
    }
    .sell-wrap{

    }
}
</style>
