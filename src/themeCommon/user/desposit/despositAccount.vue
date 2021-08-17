<template>
    <div class='page-wrap'>
        <LayoutTop />
        <div class='page-content'>
            <p class='head-text'>
                {{ $t('deposit.chooseCurrency') }}
            </p>
            <van-cell
                v-for='item in accountList'
                :key='item.accountId'
                is-link
                :title='item.currency'
                :to="{ path: 'desposit', query:{ accountId: item.accountId,currency: item.currency } }"
            />
        </div>
    </div>
</template>

<script>
import { computed, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            tradeType: route.query.tradeType
        })

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))

        return {
            accountList,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(90px);
    overflow: auto;
    //background: var(--contentColor);
    .page-content {
        margin-top: rem(20px);
        //padding: 0 rem(20px);
        background: var(--contentColor);
        .head-text {
            padding-left: rem(30px);
            color: var(--minorColor);
            font-size: rem(28px);
            line-height: rem(90px);
            border-bottom: solid 1px var(--lineColor);
        }

        --van-cell-line-height: 30px;
        --van-cell-text-color: #F00;
    }
}
</style>
