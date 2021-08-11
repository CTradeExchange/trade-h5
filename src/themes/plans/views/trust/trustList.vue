<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :title='$t("trade.trustList")' />
        <Loading :show='loading' />
        <div v-if='pendingList.length === 0'>
            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
        </div>
        <div v-else class='trust-wrap'>
            <trustItem v-for='(item, index) in pendingList' :key='index' :product='item' @click.stop='toDetail(item)' />
        </div>
    </div>
</template>

<script>
import trustItem from '@plans/modules/trust/trust.vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed, ref, nextTick, watch } from 'vue'
import { QuoteSocket } from '@/plugins/socket/socket'
export default {
    components: {
        trustItem
    },
    setup (props) {
        const loading = ref(false)
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { tradeType } = route.query
        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList[tradeType] || [])

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const toDetail = (item) => {
            router.push({
                path: '/trustDetail',
                query: {
                    id: item.id,
                    symbolId: item.symbolId,
                    tradeType: route.query.tradeType,
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
            customerNo: customInfo.value.customerNo,
            sortFieldName: 'orderTime',
            sortType: 'desc',
            tradeType: route.query.tradeType,
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
.page-wrap {
    flex: 1;
    height: 100%;
    padding-top: rem(95px);
    padding-right: rem(20px);
    padding-left: rem(20px);
    overflow: auto;
    background-color: var(--bgColor);
    .trust-item {
        margin-top: rem(20px);
    }
}
</style>
