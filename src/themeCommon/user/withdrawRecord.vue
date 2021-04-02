<template>
    <div class='page-wrap'>
        <topNav />
        <div class='record-list'>
            <van-collapse v-model='activeNames' accordion @change='handleFold'>
                <van-collapse-item name='1'>
                    <template #title>
                        <p class='amount'>
                            10000.00 USD
                        </p>
                        <p class='time'>
                            2020.04.03 16:12:40
                        </p>
                    </template>
                    <template #right-icon>
                        <div>
                            <span class='state'>
                                审核中
                            </span>
                            <van-icon :name='activeNames == 1 ? "arrow-up" : "arrow-down"' />
                        </div>
                    </template>
                    <div class='withdraw-desc'>
                        <div class='w-item'>
                            <span class='left-label'>
                                取款金额
                            </span>
                            <span class='right-val'>
                                1000
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                币种
                            </span>
                            <span class='right-val'>
                                USD
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                状态
                            </span>
                            <span class='right-val state'>
                                审核中
                            </span>
                        </div>

                        <div class='w-item'>
                            <span class='left-label'>
                                手续费
                            </span>
                            <span class='right-val'>
                                0.00
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                入账金额
                            </span>
                            <span class='right-val'>
                                1000
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                提案编号
                            </span>
                            <span class='right-val'>
                                M45482723665
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                提交时间
                            </span>
                            <span class='right-val'>
                                2020.04.23 06:14:01
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                备注
                            </span>
                            <span class='right-val'>
                                --
                            </span>
                        </div>
                    </div>
                </van-collapse-item>
                <van-collapse-item name='2'>
                    <template #title>
                        <p class='amount'>
                            10000.00 USD
                        </p>
                        <p class='time'>
                            2020.04.03 16:12:40
                        </p>
                    </template>
                    <template #right-icon>
                        <div>
                            <span class='state'>
                                审核中
                            </span>
                            <van-icon :name='activeNames == 2 ? "arrow-up" : "arrow-down"' />
                        </div>
                    </template>
                    <div class='withdraw-desc'>
                        <div class='w-item'>
                            <span class='left-label'>
                                取款金额
                            </span>
                            <span class='right-val'>
                                1000
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                币种
                            </span>
                            <span class='right-val'>
                                USD
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                状态
                            </span>
                            <span class='right-val state'>
                                审核中
                            </span>
                        </div>

                        <div class='w-item'>
                            <span class='left-label'>
                                手续费
                            </span>
                            <span class='right-val'>
                                0.00
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                入账金额
                            </span>
                            <span class='right-val'>
                                1000
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                提案编号
                            </span>
                            <span class='right-val'>
                                M45482723665
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                提交时间
                            </span>
                            <span class='right-val'>
                                2020.04.23 06:14:01
                            </span>
                        </div>
                        <div class='w-item'>
                            <span class='left-label'>
                                备注
                            </span>
                            <span class='right-val'>
                                --
                            </span>
                        </div>
                    </div>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import topNav from '@/components/topNav'
export default {
    components: {
        topNav
    },
    setup (props) {
        const router = useRouter()
        const activeNames = ref(['1'])
        const handleFold = (e) => {
            console.log(e)
        }
        const back = () => {
            if (props.backHandler) emit('back')
            else router.back()
        }
        return { activeNames, handleFold, back }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    background-color: var(--bgColor);
    .withdraw-desc {
        .w-item {
            display: flex;
            line-height: rem(60px);
            span {
                flex: 1;
                font-size: rem(24px);
            }
            .right-val {
                color: var(--color);
                text-align: right;
                &.state {
                    color: var(--primary);
                }
            }
            .left-label {
                color: var(--mutedColor);
            }
        }
    }
    .record-list {
        .van-collapse-item {
            border-top: solid rem(20px) var(--btnColor);
        }
        .amount {
            color: var(--color);
            font-weight: bold;
            font-size: rem(28px);
        }
        .time {
            color: var(--mutedColor);
            font-size: rem(20px);
        }
        .state {
            color: var(--primary);
            vertical-align: middle;
        }
        .van-icon {
            vertical-align: middle;
        }
    }
}
</style>
