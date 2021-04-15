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
                            v-for='(item,val) in proBtns'
                            :key='val'
                            :class='{ active: Number(proCurr) === Number(val) }'
                            plain
                            size='small'
                            @click='onProbtn(item,val)'
                        >
                            {{ item }}
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
                        <van-field v-model='date' :default-date='defaultDate' label='时间区间' placeholder='请选择时间区间' @click='showCalendar = true' />
                        <van-calendar
                            v-model='dateRange'
                            v-model:show='showCalendar'
                            allow-same-day='true'
                            :min-date='minDate'
                            type='range'
                            @confirm='onConfirm'
                        />
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
            <div v-for='(item,index) in list' :key='index' class='fund-item'>
                <div class='f-left'>
                    <p class='title'>
                        {{ proBtns[item.businessType] }}
                    </p>
                    <p class='date'>
                        {{ formatTime(item.createTime) }}
                    </p>
                </div>
                <div class='f-right'>
                    <p class='amount'>
                        {{ item.amountIn }} USD
                    </p>
                    <p class='balance'>
                        余额 {{ item.amountAfter }} USD
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import { toRefs, reactive, ref, computed, onBeforeMount } from 'vue'
import { queryCapitalFlowList } from '@/api/user'
import dayjs from 'dayjs'
export default {
    components: {
        Top
    },
    setup (props) {
        const proDownItem = ref(null)
        const dateDownItem = ref(null)
        const proBtns = {
            0: '全部项目',
            1: '存款',
            8: '取款',
            2: '手续费',
            3: '隔夜利息',
            4: '盈亏',
            5: '系统清零',
            6: '额度调整',
            7: '冻结'
        }

        const directionBtns = [
            {
                name: '全部流向',
                value: 0
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
            proCurr: 0, // 业务类型
            directionCur: 0, // 流向
            dateCur: '', // 时间
            proTitle: '全部项目',
            date: '', // 日期
            minDate: new Date('2018-01-01'),
            showCalendar: false,
            dateRange: [],
            defaultDate: [],
            list: [],
            pagigation: {
                size: 10,
                current: 1,
            }
        })

        const onProbtn = (item, val) => {
            state.proCurr = val
            state.proTitle = item
        }

        const onDirectbtn = (item) => {
            state.directionCur = item.value
        }

        const reset = () => {
            state.proCurr = 0
            state.directionCur = 0
            state.proTitle = '全部项目'
        }

        const confirm = () => {
            proDownItem.value.toggle()
            queryFundDetail()
        }

        const onConfirm = (values) => {
            state.dateCur = 99
            const [start, end] = values
            state.showCalendar = false
            state.date = `${formatDate(start)} - ${formatDate(end)}`
        }

        const dateConfirm = () => {
            dateDownItem.value.toggle()
        }

        const dateReset = () => {
            state.date = ''
            state.dateCur = 99
        }

        const formatDate = (date) => `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`

        const onDate = (item) => {
            if (item.value === 1) {
                state.date = dayjs(new Date()).format('YYYY/MM/DD') + '-' + dayjs(new Date()).format('YYYY/MM/DD')
            } else if (item.value === 2) {
                state.date = dayjs().subtract(7, 'day').format('YYYY/MM/DD') + '-' + dayjs(new Date()).format('YYYY/MM/DD')
                state.dateRange = [dayjs().subtract(7, 'day').format('YYYY/MM/DD'), dayjs(new Date()).format('YYYY/MM/DD')]
            } else if (item.value === 3) {
                state.date = dayjs().subtract(1, 'month').format('YYYY/MM/DD') + '-' + dayjs(new Date()).format('YYYY/MM/DD')
            } else if (item.value === 4) {
                state.date = dayjs().subtract(3, 'month').format('YYYY/MM/DD') + '-' + dayjs(new Date()).format('YYYY/MM/DD')
            } else if (item.value === 99) {
                state.date = ''
            }

            state.dateCur = item.value
        }

        const queryFundDetail = () => {
            // size		每页条数
            // current	当前页
            // businessType		业务类型。1-存取款；2-手续费；3-过夜利息；4-盈亏；5-系统清零；6-额度调整；7-冻结；
            // status		状态。1-初始化；2-处理成功；3-处理失败；
            // startTime	开始时间。13位时间戳；
            // endTime	开始时间。13位时间戳；
            // operate流向。1.增加，2.减少；

            const params = {
                size: state.pagigation.size,
                current: state.pagigation.current,
                status: 0,
                startTime: 0,
                endTime: 0,
                operate: 0,
                businessType: state.proCurr
            }
            queryCapitalFlowList(params).then(res => {
                if (res.check()) {
                    state.list = res.data.records
                }
            })
        }

        const formatTime = (val) => {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        }

        onBeforeMount(() => {
            queryFundDetail()
        })

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
            queryFundDetail,
            formatTime,
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
            margin-top: rem(20px);
            margin-bottom: rem(30px);
            padding: 0 rem(30px);
            .title {
                line-height: rem(60px);
            }
            .van-button {
                margin-right: rem(20px);
                margin-bottom: rem(20px);
                padding: 0 rem(13px);
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
