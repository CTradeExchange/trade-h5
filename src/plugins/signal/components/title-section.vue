<template>
    <div class='title-section'>
        <div class='title-left'>
            <div class='title'>
                {{ title }}
            </div>
            <popover v-if='desc' :placement='placement' :text='[desc]'>
                <template #reference>
                    <van-icon name='question-o' size='16' />
                </template>
            </popover>
        </div>
        <div v-if='showMoreLink' class='more' @click='handleMore'>
            <span v-if='isPC'>
                {{ $t('signal.common.more') }}
            </span>
            <van-icon class='arrow' name='arrow' :size='isPC ? 16 : 14' />
        </div>
        <div v-else class='more'>
            <slot name='more'></slot>
        </div>
    </div>
</template>

<script>
import { Dialog } from 'vant'
import popover from '@/components/popover.vue'
import { computed } from 'vue'

export default {
    components: {
        popover
    },
    props: {
        // 标题
        title: {
            type: String,
            default: ''
        },
        desc: String,
        showMore: Boolean,
        // popover位置
        placement: {
            type: String,
            default: 'top'
        }
    },
    emits: ['handle-more'],
    setup (props, { emit }) {
        const isPC = window.isPC
        // 是否显示更多
        const showMoreLink = computed(() => {
            return (!isPC || props.showMore)
        })
        return {
            isPC,
            showMoreLink,
            handleExplain () {
                Dialog.alert({
                    message: props.desc
                })
            },
            handleMore () {
                emit('handle-more')
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.title-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 12px 12px;
    .title-left {
        display: flex;
        align-items: center;
        .title {
            font-size: rem(30px);
            margin-right: rem(10px);
        }
    }
    .more {
        display: flex;
        align-items: center;
        justify-content: center;
        @media (any-hover: hover) {
            span {
                line-height: normal;
            }
            &:hover {
                color: var(--primary);
            }
        }
        .van-icon {
            line-height: normal;
            margin-left: 8px;
        }
    }
}

@media (min-width: 768px) {
    .title-section {
        .title-left {
            .title {
                font-size: 18px;
                font-weight: bold;
            }
            .van-icon-question-o {
                font-size: 18px !important;
            }
        }
        .more {
            cursor: pointer;
            font-size: 13px;
        }
    }
}
</style>
