<template>
    <div class='trustWrapper'>
        <div class='hd'>
            <span>{{ $t('trade.curTrust') }} ({{ pendingList.length }})</span>
            <a class='allTrust' href='javascript:;' @click="$router.push({ name:'TrustList',query:{ tradeType:product.tradeType } })">
                {{ $t('trade.allTrust') }}
            </a>
        </div>
        <div class='bd'>
            <trustItem v-for='(item, index) in pendingList.slice(0,5)' :key='index' :product='item' @click.stop='toDetail(item)' />
        </div>
    </div>
</template>

<script>
import { computed, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import trustItem from '@plans/modules/trust/trust.vue'
import { useRouter } from 'vue-router'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: {
        trustItem,
    },
    props: ['product'],
    setup (props) {
        const loading = ref(false)
        const store = useStore()
        const router = useRouter()

        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList[props.product.tradeType] || [])

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const toDetail = (item) => {
            router.push({
                path: '/trustDetail',
                query: {
                    id: item.id,
                    symbolId: item.symbolId,
                    tradeType: props.product.tradeType
                }
            })
        }

        watch(
            () => pendingList.value?.length,
            async (newval) => {
                await nextTick()
                if (!newval) return false
                const subscribList = pendingList.value.map(el => {
                    return {
                        symbolId: el.symbolId,
                        tradeType: el.tradeType
                    }
                })

                if (subscribList.length > 0) QuoteSocket.send_subscribe(subscribList)
            },
            { immediate: true }
        )

        // 获取委托列表
        store.dispatch('_trade/queryPBOOrderPage', {
            tradeType: props.product.tradeType,
            customerNo: customInfo.value.customerNo,
            sortFieldName: 'orderTime',
            sortType: 'desc',
        })

        return {
            toDetail,
            pendingList,
            loading

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.trustWrapper {
    margin-top: rem(20px);
    background: var(--contentColor);
    .hd {
        display: flex;
        justify-content: space-between;
        height: rem(70px);
        padding: 0 rem(30px);
        font-size: rem(28px);
        line-height: rem(70px);
        border-bottom: 1px solid var(--assistColor);
        .allTrust {
            color: var(--primary);
            font-size: rem(24px);
        }
    }
}
</style>
