<template>
    <div class='trustWrapper'>
        <div class='hd'>
            <span>{{ $t('trade.curTrust') }} ({{ pendingList.length }})</span>
            <a class='allTrust' href='javascript:;' @click="$router.push({ name:'List',query:{ tradeType: $route.query.tradeType } })">
                <i class='icon_mingxi'></i>
            </a>
        </div>
        <div class='bd'>
            <van-empty
                v-if='pendingList?.length === 0'
                :description="$t('trade.pendingEmpty')"
                image='/images/empty.png'
            />
            <trustItem v-for='item in pendingList' v-else :key='item.id' :product='item' />
        </div>
    </div>
</template>

<script>
import { computed, watch, ref, nextTick, onUpdated } from 'vue'
import { useStore } from 'vuex'
import trustItem from '@plans/modules/trust/trust.vue'
import { useRouter, useRoute } from 'vue-router'
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
        const route = useRoute()

        // 获取挂单列表
        const pendingList = computed(() => store.state._trade.pendingList[route.query.tradeType] || [])

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

        return {
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
        height: rem(80px);
        padding: 0 rem(30px);
        font-size: rem(28px);
        line-height: rem(80px);
        border-bottom: 1px solid var(--assistColor);
        .allTrust {
            color: var(--normalColor);
            font-size: rem(32px);
        }
    }
}
</style>
