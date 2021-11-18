<template>
    <div class='assetsItem' @click='toInfo'>
        <div class='rowflex currency'>
            <span>{{ data.currency }}</span>
            <span>{{ data.netAssets }}</span>
        </div>
        <div class='rowflex muted mtop20'>
            <div class='asset-info'>
                <p>{{ $t('trade.free') }}</p>
                <p class='val'>
                    {{ data.available }}
                </p>
                <template v-if='Number(tradeType) !== 5'>
                    <p class='mtop10'>
                        {{ $t('trade.borrowed') }}
                    </p>
                    <p class='val'>
                        {{ data.liabilitiesPrincipal }}
                    </p>
                </template>
            </div>
            <div class='alignRight asset-info'>
                <p>{{ $t('assets.frozen') }}</p>
                <p class='val'>
                    {{ data.frozen }}
                </p>
                <template v-if='Number(tradeType) !== 5'>
                    <p class='mtop10'>
                        {{ $t('trade.swap_2') }}
                    </p>
                    <p class='val'>
                        {{ data.interest }}
                    </p>
                </template>
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
            tradeType
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
    .asset-info{
        .val{
            color: var(--color);
        }
    }
}
</style>
