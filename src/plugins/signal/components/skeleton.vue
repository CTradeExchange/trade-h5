<template>
    <!-- 骨架屏内容 -->
    <div v-if='show' :class='`signal signal-${itemType}`'>
        <van-skeleton
            :row='limit'
            title-width='100%'
        />
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 5,
        },
        itemType: {
            type: Number,
            default: 1,
        }
    }
}
</script>

<style lang="scss" scoped>
.signal {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;
    background-color: var(--contentColor);
    :deep {
        .van-skeleton {
            width: 100%;
            padding: 0;
        }
        .van-skeleton__row {
            width: 100% !important;
            height: 24px;
            background-color: var(--bgColor);
            &:first-child {
                margin-top: 10px;
            }
            &:last-child {
                margin-bottom: 10px;
            }
        }
    }
    &.signal-3 {
        background-color: var(--bgColor);
        :deep {
            .van-skeleton__row {
                height: 184px;
                background-color: var(--contentColor);
            }
        }
    }
}

@media (min-width: 768px) {
    .signal {
        :deep {
            .van-skeleton__row {
                height: 35px;
            }
        }
    }
}
</style>
