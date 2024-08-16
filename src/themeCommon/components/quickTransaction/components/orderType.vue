<template>
    <van-tabs v-if='product && product.dealMode' v-model:active='orderType' class='orderType' type='card'>
        <van-tab v-for='(item, i) in btnList' :key='i' :name='item.val' :title='item.title'>
            <template #title>
                <span :id="item.val === 1 ? 'fourth-element-driver' : ''">
                    {{ item.title }}
                </span>
            </template>
        </van-tab>
    </van-tabs>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toolHooks } from '@plans/hooks/handicap'
import { useStore } from 'vuex'
import { localSet } from '@/utils/util'

export default {
    props: {
        modelValue: Number, // 下单类型
    },
    emits: ['selected', 'update:modelValue'], // 切换
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const { dealModeShowMap } = toolHooks()

        const product = computed(() => store.getters.productActived)

        const orderType = computed({
            get: () => props.modelValue,
            set: (val) => {
                emit('update:modelValue', val)
                localSet('__TRADE_ORDERTYPE__', val)
                emit('selected', val)
            },
        })

        // 订单类型
        const btnList = computed(() => {
            const list = [
                {
                    title: t('trade.marketPrice'),
                    val: 1,
                },
            ]
            const pendingTab = dealModeShowMap.value[product.value?.dealMode]?.pendingTab || {}
            if (pendingTab.show && pendingTab.tradeType?.includes(parseInt(product.value.tradeType))) {
                list.push({
                    // title: [3, 5, 9].includes(props.tradeType) ? t('trade.pending2') : t('trade.pending'),
                    title: t('trade.pending2'),
                    val: 10,
                })
            }
            return list
        })

        return {
            orderType,
            btnList,
            product,
        }
    },
}
</script>

<style lang="scss" scoped>
.orderType {
    margin: 16px 0;
    :deep {
        > .van-tabs__wrap {
            height: auto;
        }
        .van-tabs__nav {
            display: flex;
            background-color: var(--assistColor);
            padding: 1px;
            margin: 0;
            border-radius: 5px;
            border: none;
            height: 36px;
            padding: 2px;
            align-items: center;
        }
        .van-tab--card {
            border-right: 0;
            .van-tab__text {
                background-color: var(---transferSuccessBg);
                font-weight: 500;
                &:hover {
                    opacity: 0.8;
                }
            }

            &.van-tab--active {
                border-radius: 4px;
                height: 32px;
                background-color: var(--contentColor);
                .van-tab__text {
                    color: var(--color);
                    font-weight: 700;
                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }
    }
}
.h5 .orderType {
  margin: 12px 0;
}
</style>
