<template>
    <Top back='true' :menu='false' title='' />
    <div class='page-wrap'>
        <div class='oper-area'>
            <van-dropdown-menu>
                <van-dropdown-item ref='proDownItem' :title='proTitle'>
                    <div class='condition'>
                        <p class='title'>
                            项目
                        </p>
                        <van-button
                            v-for='item in proBtns'
                            :key='item.value'
                            :class='{ active: proCurr === item.value }'
                            plain
                            size='small'
                            @click='onProbtn(item)'
                        >
                            {{ item.name }}
                        </van-button>
                    </div>
                    <div class='condition'>
                        <p class='title'>
                            流向
                        </p>
                        <van-button
                            v-for='item in directionBtns'
                            :key='item.value'
                            :class='{ active: directionCur === item.value }'
                            plain
                            size='small'
                            @click='onDirectbtn(item)'
                        >
                            {{ item.name }}
                        </van-button>
                    </div>
                    <div class='btns'>
                        <van-button plain size='small' type='primary' @click='reset'>
                            重置
                        </van-button>
                        <van-button size='small' type='primary' @click='confirm'>
                            完成
                        </van-button>
                    </div>
                </van-dropdown-item>
                <van-dropdown-item ref='dateDownItem' title='全部日期'>
                    <div class='condition'>
                        <p class='title'>
                            时间
                        </p>
                        <van-button
                            v-for='item in dateBtns'
                            :key='item.value'
                            :class='{ active: dateCur === item.value }'
                            plain
                            size='small'
                            @click='onDate(item)'
                        >
                            {{ item.name }}
                        </van-button>
                        <!-- <van-cell title='选择日期区间' :value='date'  /> -->
                        <van-field v-model='date' label='时间区间' placeholder='请选择时间区间' @click='showCalendar = true' />
                        <van-calendar v-model:show='showCalendar' type='range' @confirm='onConfirm' />
                    </div>
                    <div class='btns'>
                        <van-button plain size='small' type='primary' @click='dateReset'>
                            重置
                        </van-button>
                        <van-button size='small' type='primary' @click='dateConfirm'>
                            完成
                        </van-button>
                    </div>
                </van-dropdown-item>
            </van-dropdown-menu>
        </div>
        <div class='list'>
            <div v-for='i in 15' :key='i' class='fund-item'>
                <div class='f-left'>
                    <p class='title'>
                        存款
                    </p>
                    <p class='date'>
                        2021.01.02 14:20:35
                    </p>
                </div>
                <div class='f-right'>
                    <p class='amount'>
                        +1000.00 USD
                    </p>
                    <p class='balance'>
                        余额 3000.00 USD
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref } from 'vue'
export default {
    components: {
        Top
    },
    setup (props) {
        const proDownItem = ref(null)
        const dateDownItem = ref(null)
        const proBtns = [
            {
                name: '全部项目',
                value: 99
            },
            {
                name: '存款',
                value: 1
            },
            {
                name: '取款',
                value: 2
            },
            {
                name: '手续费',
                value: 3
            },
            {
                name: '隔夜利息',
                value: 4
            },
            {
                name: '盈亏',
                value: 5
            },
            {
                name: '系统清零',
                value: 6
            },
            {
                name: '额度调整',
                value: 7
            },
            {
                name: '冻结',
                value: 8
            }

        ]
        const directionBtns = [
            {
                name: '全部流向',
                value: 99
            },
            {
                name: '入账',
                value: 1
            },
            {
                name: '出帐',
                value: 2
            }

        ]
        const dateBtns = [
            {
                name: '全部日期',
                value: 99
            },
            {
                name: '今天',
                value: 1
            },
            {
                name: '最近一周',
                value: 2
            },
            {
                name: '最近一月',
                value: 3
            },
            {
                name: '最近三月',
                value: 4
            }
        ]
        const state = reactive({
            proCurr: 99,
            directionCur: 99,
            dateCur: 99,
            proTitle: '全部项目',
            date: '',
            showCalendar: false
        })

        const onProbtn = (item) => {
            state.proCurr = item.value
            state.proTitle = item.name
        }

        const onDirectbtn = (item) => {
            state.directionCur = item.value
        }

        const reset = () => {
            state.proCurr = 99
            state.directionCur = 99
            state.proTitle = '全部项目'
        }

        const confirm = () => {
            proDownItem.value.toggle()
        }

        const dateConfirm = () => {
            dateDownItem.value.toggle()
        }

        const dateReset = () => {
            state.date = ''
            state.dateCur = 99
        }

        const formatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        const onConfirm = (values) => {
            const [start, end] = values
            state.showCalendar = false
            state.date = `${formatDate(start)} - ${formatDate(end)}`
        }

        const onDate = (item) => {
            state.dateCur = item.value
        }

        return {
            proBtns,
            directionBtns,
            dateConfirm,
            onProbtn,
            onDirectbtn,
            dateBtns,
            reset,
            proDownItem,
            onDate,
            confirm,
            dateCur: 99,
            onConfirm,
            dateReset,
            dateDownItem,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    overflow: auto;
    .oper-area {
        .condition {
            margin-bottom: rem(40px);
            padding: 0 rem(30px);
            .title {
                line-height: rem(60px);
            }
            .van-button {
                margin-right: rem(20px);
                margin-bottom: rem(20px);
                padding: 0 rem(15px);
                &.active {
                    border-color: dodgerblue;
                }
            }
            .van-cell {
                padding: 0;
            }
        }
        .btns {
            display: flex;
            justify-content: space-around;
            margin: rem(20px) 0;
            .van-button {
                padding: 0 rem(30px);
            }
        }
    }
    .list {
        .fund-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: rem(30px);
            padding-bottom: rem(30px);
            line-height: rem(50px);
            border-bottom: solid 1px var(--bdColor);
            .f-left {
                .title {
                    color: var(--color);
                    font-weight: bold;
                    font-size: rem(28px);
                    font-family: PingFang SC;
                }
                .date {
                    color: var(--mutedColor);
                    font-weight: 400;
                    font-family: DIN 1451 Mittelschrift;
                }
            }
            .f-right {
                .amount {
                    color: var(--color);
                    font-weight: bold;
                    font-size: rem(28px);
                    font-family: DIN 1451 Mittelschrift;
                }
                .balance {
                    color: var(--mutedColor);
                    font-weight: 500;
                    font-family: PingFang SC;
                }
            }
        }
    }
}
</style>
