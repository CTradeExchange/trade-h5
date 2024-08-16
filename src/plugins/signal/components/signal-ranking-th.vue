<template>
    <div class='ranking-header'>
        <div class='tr'>
            <div class='th'>
                <span>{{ $t('signal.valuable.rank') }}</span>
            </div>
            <div class='th'>
                <span>{{ $t('signal.signal') }}</span>
            </div>
            <div class='th'>
                <span>{{ $t('signal.valuable.rankingProfit') }}(USD)</span>
                <popover
                    :offset='[16, 8]'
                    placement='top-end'
                    :text="$t('signal.valuable.rankingProfitPopover')"
                />
            </div>
        </div>
    </div>
</template>

<script>
import popover from '@/components/popover.vue'
export default {
    setup () {
        popover
    }
}
</script>

<style lang="scss" scoped>
.ranking-header {
    .tr {
        display: flex;
        padding: 0 16px;
        margin-bottom: 10px;
    }
    .th {
        flex: 1;
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        color: var(--minorColor);
        &:nth-of-type(1) {
            flex: 0.4;
        }
        &:nth-of-type(2) {
            flex: 0.6;
        }
    }
}
</style>

<!-- h5样式 -->
<style lang="scss" scoped>
.h5 {
    .ranking-header {
        .tr {
            padding: 0;
            .th {
                font-size: 13px;
                &:nth-of-type(2) {
                    flex: 0.8;
                }
            }
        }
    }
}
</style>
