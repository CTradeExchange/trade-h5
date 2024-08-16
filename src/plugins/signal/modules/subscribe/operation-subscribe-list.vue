<template>
    <div class='list' :class="editable === false ? 'list-pre' : ''">
        <div v-if='list.length' class='list-warp' :class="list.length === 1 ? 'list-warp-center' : ''">
            <div v-for='(item, key) in list' :key='key' class='list-item'>
                <van-tag v-if='item.isNew' class='new' type='primary'>
                    New
                </van-tag>
                <!-- <van-icon v-if='editable' name='cross' @click='handleDel(key)' /> -->
                <div class='flex justify-space-between items-flex-start'>
                    <div class='text-xs mr-1'>
                        <product-icon :show-symbol-icon='false' :symbol-code='item.sy' />
                        <div class='list-item-signal my-1 font-medium'>
                            {{ getIndicatorName(item) }}
                        </div>
                    </div>
                    <img
                        v-if='editable'
                        alt='delete'
                        class='w-4 cursor-pointer'
                        src='/images/delete.png'
                        srcset=''
                        @click='handleDel(item,key)'
                    />
                </div>
                <p class='expiredTime'>
                    {{ $t('signal.subscribe.expired', [formatTime(item.et * 1000, 'YYYY/MM/DD')]) }}
                </p>
            </div>
        </div>
        <none-data v-else />
    </div>
</template>

<script>
import { useStore } from 'vuex'
import productIcon from '@/plugins/signal/components/product-icon.vue'
import noneData from '@/plugins/signal/components/none-data.vue'

export default {
    components: {
        productIcon,
        noneData,
    },
    emits: ['on-del'],
    props: {
        list: {
            type: Object,
            default: () => {},
        },
        // 是否可编辑
        editable: {
            type: Boolean,
            default: true,
        },
    },
    setup (props, { emit }) {
        const store = useStore()

        // 删除
        const handleDel = (item, index) => {
            emit('on-del', item, index)
        }

        const getIndicatorName = (item) => {
            return store.getters['_signal/getIndicatorName'](item)
        }

        return {
            handleDel,
            getIndicatorName,
        }
    },
}
</script>

<style lang="scss" scoped>
.list {
    .list-title {
        font-size: 15px;
        padding: 16px 0 12px;
    }
    .list-warp {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        .list-item {
            width: calc(50% - 6px);
            background: var(--bgColor);
            padding: 14px;
            margin-bottom: 12px;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            @media screen and (max-width: 768px) {
                padding: 14px 12px;
            }
            .new {
                transform: scale(0.7) rotate(-45deg);
                position: absolute;
                left: -23px;
                top: -8px;
                font-size: 12px;
                line-height: normal;
                background: var(--primary);
                padding: 12px 18px 4px 18px;
            }
            .van-icon-cross {
                position: absolute;
                right: 8px;
                top: 4px;
                cursor: pointer;
                &:hover {
                    opacity: 0.9;
                }
            }
            .text {
                display: flex;
                align-items: center;
                font-size: 13px;
                margin-bottom: 4px;
                .list-item-signal {
                    min-width: 60px;
                    margin-right: 6px;
                }
                :deep {
                    .symbol-name {
                        flex: 1;
                    }
                }
            }
            .expiredTime {
                color: var(--minorColor);
                font-size: 12px;
            }
        }
    }
    &.list-pre {
        min-height: auto;
        .list-warp-center {
            justify-content: center;
            // 单个信号尽量显示完整
            .list-item {
                min-width: 180px;
            }
        }
        .list-item {
            padding-right: 14px;
            :deep {
                .symbol-code {
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
