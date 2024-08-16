<template>
    <div class='offer-wrap'>
        <div class='header'>
            <div class='title'>
                {{ $t('trade.offer') }}
            </div>
        </div>
        <Splitpanes :dbl-click-splitter='false' horizontal>
            <Pane class='handicap-content' :size='handicapSize'>
                <handicap />
            </Pane>
            <Pane class='deal-content' :size='dealListSize'>
                <dealList :symbol-id='product?.symbolId' />
            </Pane>
        </splitpanes>
    </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import handicap from './handicap.vue'
import dealList from './dealList.vue'
import { useStore } from 'vuex'
import { toolHooks } from '@planspc/hooks/handicap'
import { Splitpanes, Pane } from 'splitpanes'

export default {
    components: {
        Splitpanes,
        Pane,
        handicap,
        dealList,
    },
    emit: ['onclose'],
    setup (props, { emit }) {
        const store = useStore()
        const { dealModeShowMap } = toolHooks() // 是否显示
        const product = computed(() => store.getters.productActived)
        const handicapSize = ref(50)
        const dealListSize = ref(50)
        const close = () => {
            emit('onclose')
        }

        onMounted(() => {
            const paneHeight = document.querySelector('.splitpanes')
            if (paneHeight?.offsetHeight) {
                handicapSize.value = parseInt(420 / paneHeight?.offsetHeight * 100)
                dealListSize.value = 100 - handicapSize.value
            }
        })

        return {
            product,
            dealModeShowMap,
            close,
            handicapSize,
            dealListSize
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.offer-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--contentColor);
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        border-bottom: 1px solid var(--lineColor);
        .van-icon-arrow-left {
            cursor: pointer;
            line-height: normal;
            margin-right: rem(20px);
            &:hover {
                opacity: 0.8;
            }
        }
        .title {
            color: var(--color);
            font-size: 20px;
            font-weight: bold;
        }
    }
    .content {
        padding: rem(30px);
        .deal-content {
            padding: rem(30px) 0;
            :deep {
                .title {
                    margin: 10px 0;
                }
                .deal-list {
                    padding-bottom: 10px;
                }
            }
        }
    }
    :deep {
        .deal-list {
            padding-bottom: 60px;  // 受盘口结构影响，多了这么多
        }
    }
}

</style>
