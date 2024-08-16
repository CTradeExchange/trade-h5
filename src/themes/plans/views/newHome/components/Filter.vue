<template>
    <div class='filter-container'>
        <div class='filter-top'>
            <span>{{ $t("news.majorEvents") }}</span>
            <div class='sort'>
                <div>{{ $t("news.sortBy") }}：</div>
                <div ref='dropdownRef' v-click-outside:[dropdownRef]='handleClickOutside' @click='showSort=!showSort'>
                    <span>
                        {{ currentSortType.text }}
                    </span>
                    <i v-if="currentSortType.direction==='down'" class='icon_paixuxiaojiantou_xiangxia fallColor'></i>
                    <i v-else class='icon_paixuxiaojiantou_xiangshang riseColor'></i>
                    <ul v-if='showSort' class='drop-down'>
                        <li v-for='(item,i) in sortList' :key='i' @click='handleChangeSort(item)'>
                            <span>{{ item.text }}</span>
                            <i v-if="item.direction==='down'" class='icon_paixuxiaojiantou_xiangxia fallColor'></i>
                            <i v-else class='icon_paixuxiaojiantou_xiangshang riseColor'></i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class='filter-bottom'>
            <div class='start-time' @click='showPicker = true'>
                <span>{{ formatStartTime(startTime) }}</span>
                <img class='down-icon' :src='downIcon' />
            </div>
            <div
                class='countries'
                :class="[filterStatus && 'active']"
                @click='showCountries = true'
            >
                <span>{{ $t("news.filter") }}</span>
                <img
                    class='filter-icon'
                    :src='filterStatus ? filterActiveIocn : filterIocn'
                />
            </div>
        </div>
    </div>

    <van-popup v-model:show='showPicker' position='bottom' round>
        <van-datetime-picker
            v-model='currentDate'
            :cancel-button-text="$t('common.cancel')"
            :columns-order="['year', 'month', 'day']"
            :confirm-button-text="$t('common.sure')"
            :min-date='minDate'
            title=''
            type='date'
            @cancel='showPicker = false'
            @confirm='handleConfirmDate'
        />
    </van-popup>
    <van-popup
        v-model:show='showCountries'
        closeable
        position='right'
        :style="{ height: '100%' }"
        @open='openDialog'
    >
        <div class='draw-container'>
            <div class='draw-main'>
                <div class='filter-item'>
                    <div class='title'>
                        {{ $t("common.status") }}
                    </div>
                    <div class='switch-line'>
                        <span>{{ $t("news.onlyImportant") }}</span>
                        <van-switch
                            v-model='important'
                            :active-color='$style.newPrimary'
                            :inactive-color='$style.primaryOpacity'
                            size='16px'
                            @change='handleChangeImportant'
                        />
                    </div>
                    <div class='switch-line'>
                        <span>{{ $t("news.periodUpcoming") }}</span>
                        <van-switch
                            v-model='timeFilter'
                            :active-color='$style.newPrimary'
                            :inactive-color='$style.primaryOpacity'
                            size='16px'
                            @change='handleChangeTimeFilter'
                        />
                    </div>
                </div>
                <div class='filter-item'>
                    <div class='title'>
                        {{ $t("news.country") }}
                    </div>
                    <div class='check-btn'>
                        <button :class="[checkAll && allCountries.length===countryCode.length && 'active']" @click='handleCheckAll'>
                            {{
                                $t("news.all")
                            }}
                        </button>
                    </div>
                    <div v-if='!isEmpty(hotCountries)' class='country-box'>
                        <div
                            v-for='(item) in hotCountries'
                            :key='item.CountryCode'
                            class='country-item'
                        >
                            <button
                                :class="[
                                    countryCode.includes(item.CountryCode) && !checkAll &&
                                        'active',
                                ]"
                                @click='handleChangeCountries(item.CountryCode)'
                            >
                                {{ item.CountryName }}
                            </button>
                        </div>
                    </div>
                    <div v-if='!isEmpty(countryList)' class='country-box'>
                        <div
                            v-for='(item) in countryList'
                            :key='item.code'
                            class='country-item'
                        >
                            <button
                                :class="[
                                    countryCode.includes(item.CountryCode) && !checkAll &&
                                        'active',
                                ]"
                                @click='handleChangeCountries(item.CountryCode)'
                            >
                                {{ item.CountryName }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button class='confirm-btn' @click='handleApply'>
                {{ $t("news.confirm") }}
            </button>
        </div>
    </van-popup>
</template>

<script>
import sortIcon from '@plans/images/down-primary.png'
import downIcon from '@plans/images/down-gray.png'
import filterActiveIocn from '@plans/images/filter-active.png'
import filterIocn from '@plans/images/filter.png'
import { toRefs, reactive, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCookie, isEmpty } from '@/utils/util'
import dayjs from 'dayjs'
import _ from 'lodash'
import { GetCountries } from '@/api/newApi'

export default {
    props: {
        tempConditions: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    emits: ['change'],
    setup (props, { emit }) {
        const dropdownRef = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            currentDate: new Date(),
            minDate: new Date(`${dayjs().format('YYYY') - 1}`),
            showSort: false,
            showCountries: false,
            showPicker: false,
            sortIcon,
            downIcon,
            filterIocn,
            filterActiveIocn,
            conditions: {
                TimeStartStr: dayjs().format('YYYY-MM-DD'),
                TimeEndStr: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                Language: getCookie('lang') || 'en-US',
                Status: 2,
                Type: 2,
                SortType: 4
            },
            week: ['日', '一', '二', '三', '四', '五', '六'],
            startTime: new Date().getTime(),
            currentSortType: { text: t('common.time'), value: 4, direction: 'up' },
            important: false,
            timeFilter: false,
            countryList: [],
            countryCode: [],
            checkAll: true,
            filterStatus: false,
            hotCountries: [],
            allCountries: [],
            isEmpty,
            flag: false,
        })

        const getCountryList = () => {
            GetCountries({
                body: { Language: getCookie('lang') || 'en-US' }
            }).then((res) => {
                const { Data } = res
                state.allCountries = Data
                // const CountryCode = Data.map(i => i.CountryCode).join(',')
                // state.conditions = Object.assign(state.conditions, { CountryCode })
                emit('change', state.conditions)
                state.countryList = Data.filter(i => i.IsHot !== 1)
                state.hotCountries = Data.filter(i => i.IsHot === 1)
            })
        }

        const sortList = [
            { text: t('common.time'), value: 4, direction: 'up' },
            { text: t('common.time'), value: 1, direction: 'down' },
            { text: t('news.importance'), value: 13, direction: 'up' },
            { text: t('news.importance'), value: 12, direction: 'down' },
        ]

        const formatStartTime = (time) => {
            const lang = getCookie('lang') || ''
            const isChina = lang.indexOf('zh') > -1
            const date = dayjs(time)
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

        const handleConfirmDate = (e) => {
            state.startTime = e.getTime()
            state.conditions = Object.assign(state.conditions, {
                TimeStartStr: dayjs(state.startTime).format('YYYY-MM-DD'),
                TimeEndStr: dayjs().add(1, 'year').format('YYYY-MM-DD')
            })
            state.showPicker = false
            state.timeFilter = false
            _.unset(state.conditions, 'TimeFilter')
            emit('change', state.conditions)
        }

        const handleChangeSort = (item) => {
            state.currentSortType = item
            const { value } = item || {}
            state.currentSortType = item
            state.conditions = Object.assign(state.conditions, {
                SortType: value
            })
            emit('change', state.conditions)
        }

        const handleChangeImportant = (e) => {
            state.important = e
        }

        const handleChangeTimeFilter = (e) => {
            state.timeFilter = e
        }

        const handleChangeCountries = (code) => {
            if (state.allCountries.length === state.countryCode.length) {
                state.countryCode = []
            }
            if (state.countryCode.includes(code)) {
                _.pull(state.countryCode, code)
            } else {
                state.countryCode.push(code)
            }
        }

        const handleCheckAll = () => {
            if (state.allCountries.length === state.countryCode.length) {
                state.countryCode = []
            } else {
                state.countryCode = state.allCountries.map(item => item.CountryCode)
            }

            state.checkAll = !state.checkAll
        }

        const handleApply = () => {
            state.flag = true
            if (state.timeFilter) {
                state.conditions = Object.assign(state.conditions, {
                    TimeFilter: 'UPCOMING'
                })
            } else {
                _.unset(state.conditions, 'TimeFilter')
            }
            if (state.important) {
                state.conditions = Object.assign(state.conditions, {
                    Important: '3'
                })
            } else {
                _.unset(state.conditions, 'Important')
            }
            if (state.countryCode.length > 0 && state.countryCode.length !== state.allCountries.length) {
                const CountryCode = state.countryCode.join(',')
                state.conditions = Object.assign(state.conditions, {
                    CountryCode
                })
            } else {
                _.unset(state.conditions, 'CountryCode')
            }

            if (state.timeFilter || state.important || state.countryCode.length) {
                state.filterStatus = true
            } else {
                state.filterStatus = false
            }
            state.showCountries = false
            emit('change', state.conditions)
        }

        const openDialog = () => {
            state.important = props.tempConditions.Important === '3'
            state.timeFilter = props.tempConditions.TimeFilter === 'UPCOMING'
            const countryCode = (props.tempConditions.CountryCode && props.tempConditions.CountryCode.split(',')) || []
            state.countryCode = countryCode
            if (countryCode.length === state.allCountries.length) {
                state.checkAll = true
            } else {
                state.checkAll = false
            }
        }

        const handleClickOutside = () => {
            state.showSort = false
        }

        watch(() => state.countryCode.length, (n) => {
            state.checkAll = n === state.allCountries.length
        })

        onMounted(() => {
            getCountryList()
        })

        return {
            handleClickOutside,
            dropdownRef,
            openDialog,
            handleApply,
            handleCheckAll,
            handleChangeCountries,
            handleChangeTimeFilter,
            handleChangeImportant,
            formatStartTime,
            handleConfirmDate,
            handleChangeSort,
            sortList,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
.filter-container {
    .filter-top {
        display: flex;
        justify-content: space-between;
        background: var(--contentColor);
        padding: rem(30px) 0;
        & > span {
            font-size: rem(36px);
            font-weight: bold;
            color: var(--mainColor);
        }
        .sort {
            position: relative;
            display: flex;
            align-items: center;
            font-size: rem(26px);
            i{
                font-size: rem(20px);
            }
            .drop-down{
                position: absolute;
                right:0;
                top:rem(50px);
                background: var(--contentColor);
                box-shadow: -4px 4px 25px rgba(0, 0, 0, 0.15);
                z-index:1;
                border-radius:rem(8px);
                &>li{
                    height: rem(80px);
                    display: flex;
                    align-items: center;
                    padding:0 rem(30px);
                    background: var(--contentColor);
                    i{
                        font-size: rem(20px);
                    }
                }
            }
            &>div {
                &:last-of-type{
                    &>span{
                        color: var(--primary);
                    }

                }

            }

        }
    }
    .filter-bottom {
        height: rem(84px);
        background: var(--f8Color);
        border-radius: rem(10px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 rem(24px);
        margin-bottom: rem(10px);
        .start-time {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: rem(28px);
            color: var(--mainColor);
            width: rem(360px);
            .down-icon {
                width: rem(20px);
                height: rem(13px);
                margin-left: rem(3px);
            }
        }
        .countries {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--mainColor);
            font-size: rem(28px);
            &.active {
                color: var(--primary);
            }
            .filter-icon {
                margin-left: rem(12px);
                width: rem(30px);
                height: rem(28px);
            }
        }
    }
}
.draw-container {
    position:relative;
    background: var(--contentColor);
    width: rem(530px);
    padding: rem(100px) rem(30px) rem(30px) rem(30px);
    height: 100%;
    display: flex;
    flex-direction: column;
    .draw-main{
        flex:1;
        overflow-y: auto;
        -ms-overflow-style: none;
        overflow: -moz-scrollbars-none;
        &::-webkit-scrollbar { width: 0!important }
    }

    .filter-item {
        border-bottom: 1px solid var(--colorbf);
        &:last-of-type{
            border-bottom:none;
        }
        .title {
            font-size: rem(30px);
            color: var(--mainColor);
            padding: rem(25px) 0;
        }
        .switch-line {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: rem(25px) 0;
            font-size: rem(28px);
            color: var(--mainColor);
        }
        .check-btn {
            padding-bottom: rem(25px);
            & > button {
                width: rem(225px);
                height: rem(60px);
                border-radius: rem(30px);
                font-size: rem(24px);
                background: var(--colorf4);
                color: var(--mainColor);
                &.active{
                    background: var(--primary);
                    color: var(--contentColor);
                }
            }
        }
        .country-box {
            margin: 0 rem(-8px);
            display: flex;
            flex-wrap: wrap;
            padding: rem(25px) 0;
            border-top: rem(2px) solid var(--colorbf);
            & > .country-item {
                padding: rem(12px) rem(8px);
                width: 50%;

                & > button {
                    width: 100%;
                    height: rem(70px);
                    border-radius: rem(35px);
                    background: var(--colorf4);
                    color: var(--mainColor);
                    font-size: rem(24px);
                    padding: rem(10px);
                    overflow: hidden;
                    &.active {
                        background: var(--primary);
                        color: var(--contentColor);
                    }
                }
            }
        }
    }
    .confirm-btn {
        height: rem(80px);
        background: var(--primary);
        border-radius: rem(10px);
        color: var(--contentColor);
        font-size: rem(28px);

    }
}
:deep{
    .van-popover__action{
        height: rem(80px);
        flex-direction: row-reverse;
        &.up{
            i{
                transform: rotate(180deg);
            }
        }
    }
    .van-icon-ascending{
        font-size: rem(28px);
        margin-left:3px;
        color: var(--riseColor);
    }
    .van-icon-descending{
        font-size: rem(28px);
        margin-left:3px;
        color: var(--fallColor);
    }
}
</style>
