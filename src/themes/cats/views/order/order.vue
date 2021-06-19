<template>
    <div class='orderWrap'>
        <layoutTop>
            <div v-if='product' class='productTopInfo'>
                <p class='productName'>
                    {{ product.symbolName }}
                </p>
                <p class='short_name'>
                    {{ product.symbolCode }}
                </p>
            </div>
            <template #left>
                <span></span>
            </template>
            <template #right>
                <a href='javascript:;' @click='$router.back()'>
                    <i class='icon_icon_close_big'></i>
                </a>
            </template>
        </layoutTop>

        <div class='main'>
            <!-- 方向 -->
            <Direction v-model='direction' class='cellMarginTop' :product='product' />
            <!-- 订单类型 -->
            <CellType v-model='orderType' :btn-list='orderTypeList' class='cellMarginTop' :title="$t('trade.orderType')" />
            <!-- 手数 -->
            {{ volume }}
            <OrderVolume
                v-if='product'
                v-model='volume'
                class='cellMarginTop'
                :product='product'
            />
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { QuoteSocket } from '@/plugins/socket/socket'
import Direction from './components/direction'
import OrderVolume from './components/orderVolume'
import CellType from '@c/components/cellType'
export default {
    components: {
        Direction,
        CellType,
        OrderVolume,
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const { symbolId, direction } = route.query
        const state = reactive({
            loading: false,
            direction: direction,
            orderType: 1, // 订单类型
            orderTypeList: [{
                title: t('trade.marketPrice'),
                val: 1
            }, {
                title: t('trade.pending'),
                val: 2
            }],
            volume: 0.01,
        })
        QuoteSocket.send_subscribe([symbolId]) // 订阅产品报价
        store.commit('_quote/Update_productActivedID', symbolId)
        const product = computed(() => store.getters.productActived)
        // 初始化设置
        const init = () => {
            if (product.value.minVolume) {
                state.volume = product.value.minVolume
            } else {
                // 获取产品详情
                store.dispatch('_quote/querySymbolInfo', symbolId).then(res => {
                    if (res.invalid()) return false
                    state.volume = res.data.minVolume // 设置默认手数
                })
            }
        }
        init()
        return {
            ...toRefs(state),
            product
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productTopInfo {
    font-size: rem(34px);
    line-height: 1;
    .short_name {
        margin-top: rem(8px);
        color: var(--mutedColor);
        font-size: rem(20px);
    }
    .productName {
        @include single-line-clamp();
    }
}
.icon_icon_close_big {
    color: var(--color);
}
.orderWrap {
    position: relative;
    flex: 1;
    margin-top: rem(90px);
    margin-bottom: rem(10px);
    overflow-y: auto;
    .main {
        @include scroll();
        flex: 1;
        margin-bottom: 80px;
        padding: 0 20px;
        overflow: auto;
    }
}
.cellMarginTop {
    margin-top: rem(40px);
}
.typeMarginTop {
    margin-top: rem(10px);
    overflow: hidden;
}
</style>
