<template>
    <div class='page-wrap'>
        <Top back left-icon='arrow-left' :menu='false' :right-action='false' show-center='true'>
            <template #right>
            </template>
        </Top>
        <van-pull-refresh v-model='loading' @refresh='onRefresh'>
            <div v-if='list.length === 0'>
                <van-empty description='暂无数据' image='search' />
            </div>
            <div v-else class='record-list'>
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
        </van-pull-refresh>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import Top from '@/components/top'
import { useStore } from 'vuex'
import { queryWithdrawPageList } from '@/api/user'
export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const store = useStore()
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const activeNames = ref(['1'])
        const state = reactive({
            loading: true,
            size: 10,
            current: 1,
            list: []
        })
        const handleFold = (e) => {
            console.log(e)
        }

        const onRefresh = () => {
            state.current = 1
            getWithdrawList()
        }

        const getWithdrawList = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                size: 10,
                current: state.current,
                startTime: 0,
                endTime: 0
            }
            queryWithdrawPageList(params).then(res => {
                console.log(res)
                state.loading = false
                if (res.check()) {
                    if (res.data.records && res.data.records.length > 0) {
                        state.list = res.data.records
                    }
                }
            })
        }

        onBeforeMount(() => {
            getWithdrawList()
        })

        return {
            activeNames,
            handleFold,
            customInfo,
            onRefresh,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
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
                font-weight: bold;
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
.van-pull-refresh {
    height: 100%;
}
</style>
