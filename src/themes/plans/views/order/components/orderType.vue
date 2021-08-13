<template>
    <van-tabs v-model:active='orderType' class='orderTypeTab' @change='changeOrderType'>
        <van-tab v-for='(item,i) in btnList' :key='i' :name='item.val' :title='item.title' />
    </van-tabs>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    props: ['modelValue'],
    emits: ['update:modelValue', 'selected'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            orderType: 1,
            btnList: [{
                title: t('trade.marketPrice'),
                val: 1
            }, {
                title: t('trade.pending'),
                val: 10
            }]
        })
        watchEffect(() => {
            if (props.modelValue !== state.orderType) state.orderType = props.modelValue
        })
        const changeOrderType = (val) => {
            console.log(val)
            emit('update:modelValue', val)
            emit('selected', val)
        }
        return {
            ...toRefs(state),
            changeOrderType,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderTypeTab {
    margin: 0 0 rem(20px);

    --van-tabs-bottom-bar-width: 20vw;
    --van-tabs-line-height: 40px;
    --van-tabs-bottom-bar-color: var(--primary);
    :deep(.van-tab) {
        flex: none;
        min-width: rem(130px);
        margin-right: rem(40px);
        padding: 0 rem(20px);
        text-align: center;
    }
}
</style>
