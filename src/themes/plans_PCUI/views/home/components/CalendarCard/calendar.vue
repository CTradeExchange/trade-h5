<template>
    <div class='calendar-box'>
        <div class='title'>
            {{ $t('news.majorEvents') }}
        </div>
        <FilterLine :temp-conditions='conditions' @change='handleChangeConditions' />
        <div class='list-box'>
            <el-row class='t-head'>
                <el-col :span='2' style='padding-left: 16px;'>
                    {{ $t('common.time') }}
                </el-col>
                <el-col :span='3'>
                    {{ $t('news.importance') }}
                </el-col>
                <el-col :span='6'>
                    {{ $t('news.event') }}
                </el-col>
                <el-col class='col-center' :span='3'>
                    {{ $t('news.actual') }}
                </el-col>
                <el-col class='col-center' :span='3'>
                    {{ $t('news.forecast') }}
                </el-col>
                <el-col class='col-center' :span='3'>
                    {{ $t('news.previous') }}
                </el-col>
                <el-col class='col-center' :span='4'>
                    {{ $t('news.relatedInstruments') }}
                </el-col>
            </el-row>
            <div
                v-if='!isEmpty(list)'
                class='t-body'
            >
                <div v-for='(item, i) in list' :key='item.ID' :class="['calendar-item',isShowTimeLine(i) || i===0? 'no-border':'']">
                    <div v-if='isShowTimeLine(i)' class='date-line'>
                        <span>
                            {{ formatTimeLine(item.ItemLanguages[0]) }}
                        </span>
                    </div>
                    <CalendarItem :data='item' />
                </div>
            </div>
            <div v-if='loading' class='loading'>
                <van-loading type='spinner'>
                    {{ $t('compLang.loading') }}
                </van-loading>
            </div>
            <div v-if='finished && isFetch' class='no-more'>
                {{ $t('common.noMore') }}
            </div>
            <div v-if='list.length === 0 && isFetch' class='none-data'>
                <van-empty :description='$t("common.noData")' image='/images/empty.png' />
            </div>
        </div>
    </div>
    <div v-if='totalPage>page' class='view-more'>
        <div class='more-btn' @click='load'>
            <span>{{ $t("news.more") }}</span>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import FilterLine from './filter.vue'
import { GetItems } from '@/api/newApi'
import { getCookie, isEmpty } from '@/utils/util'
import dayjs from 'dayjs'
import CalendarItem from './calendarItem.vue'
import { useI18n } from 'vue-i18n'

export default {
    components: { FilterLine, CalendarItem },
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            conditions: {
                TimeStartStr: dayjs().format('YYYY-MM-DD'),
                TimeEndStr: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                Language: getCookie('lang') || 'en-US'
            },
            list: [],
            isFetch: false,
            page: 1,
            pageSize: 15,
            totalPage: 0,
            loading: false,
            finished: false,
            week: ['日', '一', '二', '三', '四', '五', '六'],
            more: false
        })

        const handleChangeConditions = (e) => {
            state.conditions = e
            state.list = []
            state.page = 1
            state.isFetch = false
            load()
        }

        const getList = () => {
            const body = {
                Conditions: state.conditions,
                Limit: state.pageSize,
                Offset: state.page,

            }
            state.loading = true
            GetItems({ body }).then(res => {
                const { TotalPage, List } = res
                if (state.page === 1) {
                    state.totalPage = TotalPage
                }
                state.list = state.list.concat(List)
                state.loading = false
                state.finished = TotalPage === state.page || TotalPage === 0
                state.page += 1
                state.isFetch = true
            })
        }
        const disabled = computed(() => state.loading || state.finished)

        const isShowTimeLine = (i) => {
            const conditionTime = state.conditions?.TimeStartStr ? new Date(state.conditions?.TimeStartStr).getTime() : new Date().getTime()
            const currentItem = state.list[i].ItemLanguages?.[0]
            if (!currentItem) return false
            const prevItem = i === 0 ? { PublishTime: conditionTime / 1000 } : state.list[i - 1].ItemLanguages?.[0]
            const { PublishTime: currentTime } = currentItem || {}
            const { PublishTime: prevTime } = prevItem || {}
            const currentDay = dayjs(currentTime * 1000).format('YYYYMMDD')
            const prevDay = dayjs(prevTime * 1000).format('YYYYMMDD')
            if (currentDay === prevDay) {
                return false
            } else {
                return true
            }
        }

        const formatTimeLine = (info) => {
            const { PublishTime: time } = info || {}
            const lang = getCookie('lang') || ''
            const isChina = lang.indexOf('zh') > -1
            const date = dayjs(time * 1000)
            if (isChina) {
                return (
                    date.format(t('news.yearMonthDayFormat')) +
                    ' 星期' +
                    state.week[date.day()]
                )
            } else {
                return date.format('YYYY MMM DD, dddd')
            }
        }

        const load = () => {
            getList()
        }

        return {
            formatTimeLine,
            isShowTimeLine,
            disabled,
            load,
            isEmpty,
            handleChangeConditions,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
@import "@/sass/mixin.scss";

.calendar-box{
    padding:45px 0 0 0;
    overflow-x: auto;
    margin-bottom: 40px;
    @include scroll-bar-horizontal;

    .title{
        font-size: 48px;
        font-weight: bold;
        color: var(--mainColor);
    }
    .list-box{
        min-width:1380px;
        .t-head{
            background: var(--colorfa);
            display: flex;
            height: 54px;
            align-items: center;
            color:var(--colorth);
            font-size: 22px;
            padding:0 15px;
            justify-content: space-between;
            margin-top:25px;
            .t-head-left{
                align-items: center;
                display: flex;
            }
            .t-head-right{
                align-items: center;
                display: flex;
            }
            .time{
                width:120px
            }
            .important{
                width:175px;
            }
            .event{
                flex:1;
            }
            .actual{
                width:150px;
                text-align: center;
            }
            .forecast{
                width:150px;
                text-align: center;
            }
            .previous{
                width:150px;
                text-align: center;
            }
            .related{
                width:220px;
                text-align: right;
            }
        }
        .t-body{

            .calendar-item{
                border-top:1px solid var(--lineColor);
                max-width: 1380px;
                &.no-border{
                    border-top:none;
                }
                .date-line{
                    height:54px;
                    padding: 0 15px;
                    background: var(--colorfa);
                    display: flex;
                    align-items: center;
                    color:var(--mainColor);
                    font-size:22px;
                    font-weight: bold;

                }
                &:first-of-type{
                    .date-line{
                        margin-top:10px;
                    }
                }
            }

        }
        .no-more{
            text-align: center;
            font-size: 16px;
            color:var(--color7a)
        }
        .loading{
            padding:15px 0;
        }

    }
}
.view-more{
    display: flex;
    justify-content: center;
    padding-bottom:40px;
    .more-btn{
        width: 120px;
        height: 42px;
        background: var(--contentColor);
        border: 1px solid var(--cardBg);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color:var(--mainColor);
        font-size: 16px;
        cursor: pointer;
    }
}
.col-center{
    text-align: center;
}
</style>
