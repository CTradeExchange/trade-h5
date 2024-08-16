<template>
    <van-tabs
        v-model:active='modelValue'
        class='directions mb-3'
        type='card'
        @change='setDirection'
    >
        <van-tab
            v-for='(item, i) in list'
            :key='i'
            :name='item.value'
            :title-class='item.value'
        >
            <template #title>
                <div class='tab-title'>
                    <svg v-if="item.value === 'buy'" height='9.856' viewBox='0 0 15.704 9.856' width='15.704' xmlns='http://www.w3.org/2000/svg'>
                        <path d='m529-488.59v5.67l-2.113-2.109-5.326 5.319-2.924-2.921-3.9 3.9-1.444-1.448 5.341-5.341 2.924 2.924 3.882-3.882-2.113-2.109z' fill='#red' transform='translate(-513.3 488.59)' />
                    </svg>
                    <svg v-else height='9.856' viewBox='0 0 15.704 9.856' width='15.704' xmlns='http://www.w3.org/2000/svg'>
                        <path d='m0 0v5.67l2.113-2.11 5.326 5.32 2.924-2.921 3.9 3.9 1.437-1.451-5.337-5.341-2.924 2.924-3.882-3.882 2.113-2.109z' fill='#fff' transform='matrix(-1 0 0 -1 15.704 9.856)' />
                    </svg>
                    <span>
                        {{ item.title }}
                    </span>
                </div>
            </template>
        </van-tab>
    </van-tabs>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })

        const list = ref([
            {
                title: t('trade.long'),
                value: 'buy',
                icon: 'long.svg'
            },
            {
                title: t('trade.short'),
                value: 'sell',
                icon: 'short.svg'
            }
        ])

        const setDirection = (data) => {
            emit('update:modelValue', data)
        }

        return {
            setDirection,
            list,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.directions {
    .tab-title {
        padding: 9px 0;
        img {
            margin-right: 8px;
        }
    }
    :deep {
        > .van-tabs__wrap,
        .van-tabs__nav {
            height: auto;
        }
        .van-tabs__nav {
            background: var(--bgColor);
            border-radius: 4px;
            overflow: hidden;
        }
        .van-tab--card {
            border-right: 0;
            &:not(.van-tab--active):hover {
                background: var(--primaryAssistColor);
            }
            .tab-title {
                color: var(--normalColor);
                svg {
                   margin-right: 8px;
                   path {
                        fill: var(--normalColor);
                   }
                }
            }
            &.van-tab--active {
                &.buy {
                    background: var(--riseColor);
                }
                &.sell {
                    background: var(--fallColor);
                }
                .tab-title {
                    color: #FFF;
                    svg {
                        path {
                                fill: #FFF;
                        }
                    }
                }
            }
        }
        .van-tabs__nav--card {
            margin: 0;
            border-color: var(--lineColor);
        }
    }
}
</style>
