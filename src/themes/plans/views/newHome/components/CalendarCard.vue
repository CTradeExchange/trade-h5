<template>
    <div class='calendar-card'>
        <FilterBlock :temp-conditions='conditions' @change='changeConditions' />
        <van-pull-refresh
            v-model='refreshing'
            :loading-text="$t('compLang.loading')"
            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
            @refresh='onRefresh'
        >
            <div v-if='isEmpty(list) && !loading && !error'>
                <van-empty
                    :description="$t('common.noData')"
                    image='/images/empty.png'
                />
            </div>
            <van-list
                v-else
                v-model:error='error'
                v-model:loading='loading'
                :error-text="$t('c.loadError')"
                :finished='finished'
                :finished-text="$t('common.noMore')"
                :loading-text="$t('compLang.loading')"
                :offset='10'
                @load='onLoad'
            >
                <div v-for='(item,i) in list' :key='item.ID' :class="['calendar-item',isShowTimeLine(i) || i===0? 'no-border':'']">
                    <div v-if='isShowTimeLine(i) && item.ItemLanguages?.[0]' class='date-line'>
                        <span>{{ formatTimeLine(item.ItemLanguages[0]) }}</span>
                    </div>
                    <CalendarItem
                        :activity-id='item.TActivitySetting && last(item.TActivitySetting)?.ID'
                        :country-code='item.CountryCode'
                        :item='item.ItemLanguages?.[0]'
                        :trades='item.Trades'
                    />
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import {
    reactive,
    toRefs
} from 'vue'
import { isEmpty, getCookie } from '@/utils/util'
import FilterBlock from './Filter.vue'
import { GetItems } from '@/api/newApi'
import CalendarItem from './CalendarItem.vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { last } from 'lodash'

export default {
    components: { FilterBlock, CalendarItem },
    setup () {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            isEmpty,
            error: false,
            list: [],
            page: 1,
            limit: 10,
            loading: false,
            finished: false,
            refreshing: false,
            conditions: {},
            week: ['日', '一', '二', '三', '四', '五', '六'],
        })

        const getList = () => {
            const params = {
                Offset: state.page,
                Limit: state.limit,
                Conditions: state.conditions
            }
            state.loading = true
            GetItems({ body: params })
                .then((res) => {
                    const { List, TotalPage } = res || {}
                    state.list =
                        state.page === 1 ? List : state.list.concat(List)
                    state.finished = TotalPage === state.page
                    state.loading = false
                    state.page += 1
                })
                .catch((err) => {})
        }

        const changeConditions = (e) => {
            state.page = 1
            state.list = []
            state.conditions = e
            getList()
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

        const isShowTimeLine = (i) => {
            const conditionTime = state.conditions?.TimeStartStr ? new Date(state.conditions?.TimeStartStr).getTime() : new Date().getTime()
            const currentItem = state.list[i].ItemLanguages?.[0]
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

        const onRefresh = () => {
            if (state.refreshing) {
                state.list = []
                state.refreshing = false
            }
            state.finished = false
            state.loading = true
            state.page = 1
            getList()
        }

        const onLoad = () => {
            if (state.page === 1) return
            // state.page += 1
            getList()
        }

        // onMounted(() => {
        //     getList()
        // })

        return {
            isShowTimeLine,
            formatTimeLine,
            onRefresh,
            changeConditions,
            onLoad,
            last,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.calendar-card {
    //margin-top: rem(20px);
    padding: rem(30px) rem(30px) rem(110px) rem(30px);
    background: var(--contentColor);
    .date-line{
        height: rem(84px);
        background: var(--f8Color);
        padding: 0 rem(24px);
        display:flex;
        align-items: center;
        font-size: rem(28px);
        color: var(--mainColor);
    }
    .calendar-item{
        border-top:rem(2px) solid var(--lineColor);
        &.no-border{
            border-top:none;
        }
    }
}
</style>
