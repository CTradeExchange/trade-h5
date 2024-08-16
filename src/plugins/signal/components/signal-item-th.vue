<template>
    <div>
        <div v-if='itemType === 5' class='signal-item signal-item-th'>
            <div class='col'>
                <span>{{ $t('signal.detail.time') }}</span>
            </div>
            <div class='col justify-center'>
                <span>{{ $t('signal.detail.product') }}</span>
            </div>
            <div class='col  justify-center'>
                <span>{{ $t('signal.detail.indicator') }}</span>
                <popover class='col-icon-qa' :text='message.indicator' text-align='left' />
            </div>
            <div class='col'>
                <span>{{ $t('signal.tradeRecommend') }}</span>
            </div>
        </div>
        <div v-else-if='itemType === 11' class='signal-item signal-item-th'>
            <div class='col'>
                <span>{{ $t('signal.detail.time') }}</span>
            </div>
            <div class='col col-indicator col-multiple'>
                <span>{{ $t('signal.detail.indicator') }}</span>
                <popover class='col-icon-qa' :text='message.indicator' text-align='left' />
            </div>
            <!-- <div class='col'>
                <span>{{ $t('signal.detail.signal') }}</span>
                <popover class='col-icon-qa' :text='message.signal' />
            </div> -->
            <div class='col'>
                <span>{{ $t('signal.tradeRecommend') }}</span>
            </div>
            <div class='col col-trigger-price'>
                <span>{{ $t('signal.detail.triggerPrice') }}</span>
                <popover class='col-icon-qa' :text='message.triggerPrice' />
            </div>
            <div class='col col-symbol-name col-multiple'>
                <span>{{ $t('signal.detail.product') }}</span>
            </div>
            <!-- <div class='col'>
                <span> {{ $t('signal.detail.newPrice') }}</span>
            </div> -->
            <div class='col col-option'></div>
        </div>
        <div v-else-if='itemType === 4' class='signal-item signal-item-th'>
            <div class='col'>
                <span>{{ $t('signal.detail.time') }}</span>
            </div>
            <div class='col justify-center'>
                <span>{{ $t('signal.detail.indicator') }}</span>
                <popover class='col-icon-qa' :offset='[20, 8]' placement='top-end' :text='message.indicator' text-align='left' />
            </div>
            <div class='col'>
                <span>{{ $t('signal.tradeRecommend') }}</span>
            </div>
            <!-- <div class='col'>
                <span> {{ $t('signal.detail.triggerPrice') }}</span>
                <popover
                    class='col-icon-qa'
                    :offset='[20, 8]'
                    placement='top-end'
                    :text='message.triggerPrice'
                />
            </div> -->
        </div>
    </div>
</template>

<script>
// 获取标题
import { toRefs, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import popover from '@/components/popover.vue'

export default {
    components: {
        popover,
    },
    props: {
        // 列表展示类型
        itemType: {
            type: Number,
            default: 0,
        },
    },
    setup () {
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            message: {
                indicator: [
                    t('signal.desc.indicator1'),
                    t('signal.desc.indicator2'),
                    t('signal.desc.indicator3'),
                    t('signal.desc.indicator4'),
                ],
                signal: [t('signal.desc.signal')],
                triggerPrice: [t('signal.desc.triggerPrice')],
            },
            type: '',
        })
        return {
            ...toRefs(state),
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
</style>
