<template>
    <div class='filter'>
        <div class='filter-left'>
            <el-dropdown ref='dropDownRef' class='change-time' trigger='click'>
                <span class='el-dropdown-link'>
                    {{ formatStartTime(currentStartTime) }}
                    <el-icon color='#3f5372'>
                        <CaretBottom />
                    </el-icon>
                </span>
                <template #dropdown>
                    <van-datetime-picker
                        v-model='pirckerTime'
                        :cancel-button-text="$t('common.cancel')"
                        :columns-order="['year', 'month', 'day']"
                        :confirm-button-text="$t('common.sure')"
                        :min-date='minDate'
                        title=''
                        type='date'
                        @cancel='showTimerPicker = false'
                        @confirm='handleConfirmStartTime'
                    />
                </template>
            </el-dropdown>
        </div>
        <div class='filter-right'>
            <div class='sort'>
                <span class='label'>
                    {{ $t('news.sortBy') }}:
                </span>
                <el-popover :visible='showSortList'>
                    <template #reference>
                        <div class='sort-btn' @click='showSortList=!showSortList'>
                            <span class='value'>
                                {{ currentSortType.text }}
                            </span>
                            <el-icon v-if="currentSortType.direction==='up'" class='riseColor'>
                                <Top />
                            </el-icon>
                            <el-icon v-else class='fallColor'>
                                <Bottom />
                            </el-icon>
                            <!-- <el-icon><CaretBottom /></el-icon> -->
                        </div>
                    </template>
                    <ul class='sort-list'>
                        <li v-for='(item,i) in sortList' :key='i' @click='changeSortType(item)'>
                            <span>{{ item.text }}</span>
                            <el-icon v-if="item.direction==='up'" class='riseColor'>
                                <Top />
                            </el-icon>
                            <el-icon v-else class='fallColor'>
                                <Bottom />
                            </el-icon>
                        </li>
                    </ul>
                </el-popover>
            </div>
            <div class='important'>
                <el-switch
                    v-model='important'
                    class='switch'
                    style='--el-switch-on-color:#BE1E2D;--el-switch-off-color: #FFC9CE'
                    @change='handleChangeImportant'
                />
                <span class='value'>
                    {{ $t("news.onlyImportant") }}
                </span>
            </div>
            <div class='time-filter'>
                <el-switch
                    v-model='timeFilter'
                    class='switch'
                    style='--el-switch-on-color: #BE1E2D; --el-switch-off-color: #FFC9CE'
                    @change='handleChangeTimeFilter'
                />
                <span class='value'>
                    {{ $t("news.periodUpcoming") }}
                </span>
            </div>
            <div class='countries' :class="[countryCode.length>0 && 'active']" @click='showCountries=!showCountries'>
                <el-icon><Filter /></el-icon>
                <span>{{ $t('news.filter') }}</span>
            </div>
        </div>
        <el-dialog v-model='showCountries' title='' :width='803' @open='openDialog'>
            <div class='countries-box'>
                <div class='title'>
                    {{ $t('news.country') }}
                </div>
                <div class='check-all' :class="[checkAll && countryCode.length===countryList.length && 'active']" @click='handleCheckAll'>
                    <span>{{ $t('news.all') }}</span>
                </div>
            </div>
            <div v-if='!isEmpty(countryList.filter(i=>i.IsHot===1))' class='countries-list'>
                <div v-for='item in countryList.filter(i=>i.IsHot===1)' :key='item.CountryCode' class='country-item'>
                    <div class='country-btn' :class="countryCode.includes(item.CountryCode) && !checkAll && 'active'" @click='handleChangeCountries(item.CountryCode)'>
                        <span>{{ item.CountryName }}</span>
                    </div>
                </div>
            </div>
            <div v-if='!isEmpty(countryList.filter(i=>i.IsHot!==1))' class='countries-list'>
                <div v-for='item in countryList.filter(i=>i.IsHot!==1)' :key='item.CountryCode' class='country-item'>
                    <div class='country-btn' :class="countryCode.includes(item.CountryCode) && !checkAll && 'active'" @click='handleChangeCountries(item.CountryCode)'>
                        <span>{{ item.CountryName }}</span>
                    </div>
                </div>
            </div>
            <div class='confirm'>
                <div class='confirm-btn' @click='handleConfirm'>
                    <span>{{ $t('news.confirm') }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import { toRefs, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCookie, isEmpty } from '@/utils/util'
import { GetCountries } from '@/api/newApi'
import dayjs from 'dayjs'
import _ from 'lodash'
export default {
    props: {
        tempConditions: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    setup (props, { emit }) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            showTimerPicker: false,
            conditions: {
                Status: 2,
                Type: 2,
                SortType: 4,
                TimeStartStr: dayjs().format('YYYY-MM-DD'),
                TimeEndStr: dayjs().add(1, 'year').format('YYYY-MM-DD'),
                Language: getCookie('lang') || 'en-US'
            },
            currentStartTime: new Date(),
            pirckerTime: new Date(),
            minDate: new Date(`${dayjs().format('YYYY') - 1}`),
            week: ['日', '一', '二', '三', '四', '五', '六'],
            currentSortType: { text: t('common.time'), value: 4, direction: 'up' },
            important: false,
            timeFilter: false,
            showCountries: false,
            countryList: [],
            countryCode: [],
            checkAll: false,
            flag: false,
            showPicker: false,
            dropDownRef: null,
            showSortList: false

        })

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
                    date.format('YYYY年MM月DD日') +
                    ' 星期' +
                    state.week[date.day()]
                )
            } else {
                return date.format('YYYY MMM DD, dddd')
            }
        }

        const handleConfirmStartTime = (e) => {
            state.currentStartTime = e.getTime()
            state.conditions = Object.assign(state.conditions, {
                TimeStartStr: dayjs(state.currentStartTime).format('YYYY-MM-DD'),
                TimeEndStr: dayjs().add(1, 'year').format('YYYY-MM-DD')
            })
            state.dropDownRef.handleClose()
            state.timeFilter = false
            _.unset(state.conditions, 'TimeFilter')
            emit('change', state.conditions)
        }

        const handleChangeImportant = (e) => {
            state.important = e
            if (state.important) {
                state.conditions = Object.assign(state.conditions, {
                    Important: '3'
                })
            } else {
                _.unset(state.conditions, 'Important')
            }
            emit('change', state.conditions)
        }

        const handleChangeTimeFilter = (e) => {
            state.timeFilter = e
            if (state.timeFilter) {
                state.conditions = Object.assign(state.conditions, {
                    TimeFilter: 'UPCOMING'
                })
            } else {
                state.conditions = Object.assign(state.conditions, {
                    TimeFilter: 'PASS'
                })
                // _.unset(state.conditions, 'TimeFilter')
            }
            emit('change', state.conditions)
        }

        const handleChangeCountries = (code) => {
            if (state.countryList.length === state.countryCode.length) {
                state.countryCode = []
            }
            if (state.countryCode.includes(code)) {
                _.pull(state.countryCode, code)
            } else {
                state.countryCode.push(code)
            }
        }

        const handleCheckAll = () => {
            state.checkAll = !state.checkAll
            if (state.checkAll) {
                state.countryCode = state.countryList.map(
                    (item) => item.CountryCode
                )
            } else {
                state.countryCode = []
            }
        }

        const getCountryList = () => {
            GetCountries({
                body: { Language: getCookie('lang') || 'en-US' }
            }).then((res) => {
                const { Data } = res
                state.countryList = Data
                // const CountryCode = Data.map(i => i.CountryCode).join(',')
                // state.conditions = Object.assign(state.conditions, { CountryCode })
                emit('change', state.conditions)
            })
        }

        const handleConfirm = () => {
            if (state.countryCode.length > 0 && state.countryCode.length !== state.countryList.length) {
                const CountryCode = state.countryCode.join(',')
                state.conditions = Object.assign(state.conditions, {
                    CountryCode
                })
            } else {
                _.unset(state.conditions, 'CountryCode')
            }
            state.showCountries = false
            if (state.timeFilter || state.important || state.countryCode.length) {
                state.filterStatus = true
            } else {
                state.filterStatus = false
            }
            emit('change', state.conditions)
        }

        // const canleCountries = () => {
        //     if (state.flag) return
        //     state.countryCode = []
        // }

        const openDialog = () => {
            const countryCode = (props.tempConditions.CountryCode && props.tempConditions.CountryCode.split(',')) || []
            state.countryCode = countryCode
            if (countryCode.length === state.countryList.length) {
                state.checkAll = true
            } else {
                state.checkAll = false
            }
        }

        const changeSortType = (item) => {
            const { value } = item || {}
            state.currentSortType = item
            state.showSortList = false
            state.conditions = Object.assign(state.conditions, {
                SortType: value
            })
            emit('change', state.conditions)
        }

        watch(() => state.countryCode.length, (len) => {
            if (len === state.countryList.length) {
                state.checkAll = true
            } else {
                state.checkAll = false
            }
        })

        onMounted(() => {
            getCountryList()
            // emit('change', state.conditions)
        })

        return {
            changeSortType,
            isEmpty,
            openDialog,
            // canleCountries,
            handleConfirm,
            handleCheckAll,
            handleChangeCountries,
            handleChangeImportant,
            handleChangeTimeFilter,
            sortList,
            handleConfirmStartTime,
            formatStartTime,
            ...toRefs(state)
        }
    }

}
</script>

<style scoped lang="scss">
.filter{
    margin-top:25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 1380px;
    .filter-left{
        :deep{
            .el-dropdown-link{
                display: flex;
                align-items: center;
                font-size: 22px;
                font-weight: bold;
                color: var(--mainColor);
            }

        }
        .change-time{
            cursor: pointer;
        }
    }
    .filter-right{
        display: flex;
        align-items: center;
        font-size: 22px;
        font-weight: bold;
        color:var(--mainColor);
        .sort{
            display:flex;
            align-items: center;
            padding-right:40px;
            border-right:1px solid var(--cardBg);
            .value{
                color:var(--primary)
            }

        }
        .important{
            padding-left:40px;
        }
        .time-filter{
            padding-right: 40px;
            padding-left:30px;
            border-right:1px solid var(--cardBg);
        }
        .countries{
            padding-left:40px;
            display: flex;
            align-items: center;
            cursor: pointer;
            &.active{
                color:var(--primary);
                :deep(.el-icon){
                    color:var(--primary);
                }
            }

        }
        &>div{
            .value{
                margin-left:5px;
            }
        }
    }
}
.countries-box{
    color:var(--mainColor);
    border-bottom: 1px solid var(--cardBg);
    padding-bottom: 15px;
    .title{
        font-size: 18px;
        font-weight: bold;

    }
    .check-all{
        cursor: pointer;
        width: 137px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--colorf4);
        color:var(--mainColor);
        font-size:14px;
        border-radius: 36px;
        margin-top:15px;
        transition: all linear 0.1s;
        &.active{
            background: var(--primary);
            color:var(--contentColor)
        }
    }
}
.countries-list{
    margin:-8px -5px;
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0 7px 0;
    border-bottom:1px solid var(--cardBg);
    .country-item{
        padding: 8px 5px;

        .country-btn{
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--colorf4);
            cursor: pointer;
            color:var(--mainColor);
            font-size: 14px;
            border:none;
            transition: all linear 0.1s;
            height: 36px;
            width: 137px;
            border-radius: 36px;
            &.active{
                background: var(--primary);
                color:var(--contentColor);

            }
        }
    }

}
.confirm{
    display: flex;
    justify-content: center;
    margin-top:30px;
    .confirm-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color:var(--contentColor);
        border-radius: 5px;
        width:283px;
        height: 40px;
        background: var(--primary);
        cursor: pointer;
    }
}
:deep{
    .van-picker-column{
        width: 90px;
    }
    .el-dialog__body{
        padding: 40px 36px 30px 40px;
    }
}
.sort-list{
    &>li{
        height: 40px;
        display: flex;
        align-items: center;
        font-weight: bold;
        cursor: pointer;
        &>span{
            margin-right: 3px;
        }
    }
}
.sort-btn{

    font-size: 22px;
    display:flex;
    align-items: center;
    cursor: pointer;
}
</style>
