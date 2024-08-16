<template>
    <!-- 订单类型 -->
    <div class='typeBar'>
        <van-row class='cellBar' justify='space-between' type='flex'>
            <van-col>
                <span>{{ title }}</span>
                <popover :text="$t('trade.validityPeriodExplain')">
                    <template #reference>
                        <van-icon class='question' name='question-o' />
                    </template>
                </popover>
            </van-col>
            <van-col class='radioGroup'>
                <span
                    v-for='(btn,i) in btnList'
                    :key='i'
                >
                    <popover :text='btn.tips'>
                        <template #reference>
                            <button

                                class='btn'
                                :class="{ 'active':modelValue==btn.val }"
                                @click='setType(btn.val)'
                            >
                                {{ btn.title }}
                            </button>
                        </template>
                    </popover>
                </span>
            </van-col>
        </van-row>
    </div>
</template>

<script>
export default {
    props: ['title', 'modelValue', 'btnList'],
    emits: ['update:modelValue', 'selected'],
    methods: {
        setType (val) {
            this.$emit('update:modelValue', val)
            this.$emit('selected', val)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.typeBar {
    margin-top: 16px;
    .cellBar {
        // align-items: center;
        color: var(--minorColor);
        .titleCol {
            width: rem(150px);
            padding-top: rem(20px);
        }
        .radioGroup {
            display: flex;
            flex: 1;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
        .question {
            margin-top: rem(-4px);
            margin-left: rem(8px);
            font-size: rem(34px);
            cursor: pointer;
        }
        &:deep {
            .van-col {
                display: flex;
                align-items: center;
            }
        }
    }
    .btn {
        padding: 6px 12px;
        color: var(--color);
        font-size: rem(24px);
        line-height: 1;
        text-align: center;
        background: var(--assistColor);
        border-radius: 4px;
        cursor: pointer;
        margin-left: rem(20px);
        &.active {
            color: var(--primary);
            background: var(--primaryAssistColor);
        }
        &:disabled {
            opacity: 0.5;
        }
    }
}

</style>
