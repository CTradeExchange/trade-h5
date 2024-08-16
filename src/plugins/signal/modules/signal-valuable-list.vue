<template>
    <div class='valuable-list'>
        <div class='valuable-list-slide'>
            <evaluate-widget class='list' />
        </div>
        <div class='valuable-list-slide'>
            <ranking-widget class='list' />
        </div>
    </div>
</template>

<script>
import evaluateWidget from '@/plugins/signal/modules/evaluate/widget.vue'
import rankingWidget from '@/plugins/signal/modules/ranking/widget.vue'
import guide from './signal-valuable-guide'

export default {
    components: {
        evaluateWidget,
        rankingWidget,
    },
    setup (props) {

    }
}
</script>

<style lang="scss" scoped>
.valuable-list {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .valuable-list-slide {
        width: calc(50% - 15px);
        &:first-child {
            margin-left: 0;
        }
        @media screen and (max-width: 768px) {
            width: 80%;
            margin-left: 15px;
        }
    }
    .list {
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-radius: 8px;
        padding: 15px 12px 12px;
        :deep {
            .signal-item:not(.signal-item-th) {
                font-size: 16px;
                @media screen and (max-width: 768px) {
                    font-size: 13px;
                }
            }
        }
    }
}
</style>
