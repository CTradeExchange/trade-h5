<template>
    <div class='signal-valuable'>
        <div class='section'>
            <div class='title-section'>
                <div class='title-left'>
                    <div
                        class='title'
                        :class="{ 'active': index !== 1 }"
                        @click.stop='handleIndex(0)'
                    >
                        {{ $t("signal.valuable.evaluate") }}
                    </div>
                </div>
                <div class='title-left'>
                    <div
                        class='title'
                        :class="{ 'active': index === 1 }"
                        @click.stop='handleIndex(1)'
                    >
                        {{ $t("signal.valuable.ranking") }}
                    </div>
                </div>
            </div>
        </div>
        <div class='valuable-list'>
            <div v-if='index === 1' class='valuable-list-slide'>
                <ranking-widget class='list' />
            </div>
            <div v-else class='valuable-list-slide'>
                <evaluate-widget class='list' />
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import evaluateWidget from '@/plugins/signal/modules/evaluate/widget.vue'
import rankingWidget from '@/plugins/signal/modules/ranking/widget.vue'
import { localGet, localSet } from '@/utils/util'
import useSignal from '@/plugins/signal/hooks/signal'

export default {
    components: {
        evaluateWidget,
        rankingWidget,
    },
    setup (props) {
        // 选中tab索引
        const index = ref(parseInt(localGet('signalValuable') || 0))

        // 切换
        const handleIndex = (idx) => {
            localSet('signalValuable', idx)
            index.value = idx
        }

        return {
            index, // 当前选中的tab
            isPC: window.isPC,
            handleIndex
        }
    }
}
</script>

<style lang="scss" scoped>
.signal-valuable {
    border-radius: 8px;
    overflow: hidden;
    margin: 6px 0;
}
.valuable-list {
    display: flex;
    justify-content: space-between;
    .valuable-list-slide {
        width: calc(33.33333% - 15px);
        &:first-child {
            margin-left: 0;
        }
        @media screen and (max-width: 768px) {
            width: 100%;
            margin-left: 20px;
        }
    }
    .list {
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        padding: 0 12px;
        @media screen and (max-width: 768px) {
            border: none;
            padding: 0 0 14px;
        }
        :deep {
            @media screen and (max-width: 768px) {
                .classify-tabs {
                    padding: 0 12px;
                }
            }
        }
    }
}
.section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background-color: var(--contentColor);
    position: relative;
    .title-section {
        display: flex;
        align-items: center;
        .title-left {
            display: flex;
            align-items: baseline;
            margin-right: 8px;
            .title {
                color: var(--minorColor);
                font-size: rem(30px);
                margin-right: rem(6px);
                &.active {
                    color: var(--primary);
                    font-size: rem(36px);
                    transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
                }
            }
        }
    }
    .more {
        font-size: rem(24px);
        position: absolute;
        right: 0;
        height: 100%;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

</style>
