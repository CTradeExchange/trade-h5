<template>
    <div class='assetsItem' @click='toInfo'>
        <div class='rowflex currency'>
            <span>{{ data.currency }}</span>
            <span>{{ data.netAssets }}</span>
        </div>
        <div class='rowflex muted mtop20'>
            <div>
                <p>{{ $t('trade.free') }}</p>
                <p>{{ data.available }}</p>
                <p class='mtop10'>
                    {{ $t('trade.loan') }}
                </p>
                <p>{{ data.liabilitiesPrincipal }}</p>
            </div>
            <div class='alignRight'>
                <p>{{ $t('assets.frozen') }}</p>
                <p>{{ data.frozen }}</p>
                <p class='mtop10'>
                    {{ $t('trade.swap_2') }}
                </p>
                <p>{{ data.interest }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { reactive, toRefs, computed } from 'vue'
export default {
    props: {
        data: {
            type: Object,
        },
    },
    setup (props) {
        // console.log(props.data)
        const store = useStore()
        const router = useRouter()
        const plans = computed(() => store.state._base.plans)
        const tradeType = computed(() => store.state._quote.curTradeType || plans.value[0].id)
        const toInfo = () => {
            router.push({
                name: 'AssetsInfo',
                query: {
                    currency: props.data.currency,
                    accountId: props.data.accountId,
                    tradeType: tradeType.value
                }
            })
        }
        return {
            toInfo,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsItem {
    padding: rem(30px);
    font-size: rem(24px);
    background: var(--contentColor);
}
.rowflex {
    display: flex;
    justify-content: space-between;
    width: 100%;
    line-height: 1.5;
    &.currency {
        font-size: rem(30px);
    }
}
</style>
