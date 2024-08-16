<template>
    <div class='page-wrap' :class='{ hasNav: $hasNav }'>
        <PageComp class='minePageComp' :data='pageModules' />
    </div>
</template>

<script>
import PageComp from '@plans/components/PageComp'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { MsgSocket } from '@/plugins/socket/socket'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
    components: { PageComp },
    setup () {
        const store = useStore()
        const route = useRoute()
        const pageModules = ref([])
        const { t } = useI18n({ useScope: 'global' })
        store.dispatch('_base/getPageConfig', 'Mine').then((res) => {
            pageModules.value = res
        })

        const customInfo = computed(() => store.state._user.customerInfo)

        // 获取玩法列表
        const plans = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans
                .filter((e) => {
                    return userProductCategory[e.tradeType]?.find(
                        (o) => o.listByUser?.length
                    )
                })
                .map((el) => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
            return resultPlans
        })

        const tradeType = computed(
            () => store.state._quote.curTradeType || plans.value[1]?.id
        )

        onMounted(() => {
            if (customInfo.value?.customerNo) {
                // 更新用户数据
                store.dispatch('_user/UpdateCustomerInfo')
            }
            // 订阅资产数据
            MsgSocket.subscribeAsset(tradeType.value)
        })

        // 路由变化取消订阅
        watch(
            () => route.path,
            (newVal) => {
                if (newVal !== '/positionDetail') {
                    MsgSocket.cancelSubscribeAsset()
                }
            }
        )

        return {
            pageModules
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
.page-wrap {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: rem(136px);
    :deep(#topNav) {
      display: none;
    }
    .minePageComp {
        flex:1;
        display: flex;
        flex-direction: column;
        padding-bottom: 60px;
        box-sizing: border-box;
        --van-cell-group-background-color: transparent;
        :deep(.menuList){
            flex:1;
            background: var(--contentColor);
        }
    }
    &.hasNav {
        //padding-bottom: rem(100px);
    }
    .support {
        width: rem(300px);
        margin: rem(-70px) auto rem(10px);
        line-height: rem(32px);
        text-align: center;
        img {
            width: 100%;
        }
    }
}
</style>
