<template>
    <div class='finCard'>
        <div class='filterBox'>
            <div class='filterTop'>
                <div class='filterCountry' @click='show = true'>
                    <img
                        class='filterIcon'
                        src='../../../../../assets/newUI/filter.png'
                    /><span>{{ $t("filter") }}</span>
                </div>
                <div class='filterClearAll'>
                    <div class='clearAllBtn' @click="$emit('onClearAll')">
                        <span>{{ $t("news.clearAll") }}</span>
                    </div>
                </div>
            </div>
            <div class='filterCard'>
                <div class='filterItem'>
                    <div class='filterItemTitle'>
                        {{ $t("news.period") }}
                    </div>
                    <div class='filterItemBtn'>
                        <span
                            :class="[
                                hasOption('Period', 'PASS') &&
                                    'period-pass-active',
                            ]"
                            @click="
                                $emit('changeOpt', {
                                    mode: 'Period',
                                    option: 'PASS',
                                })
                            "
                        >
                            {{ $t("news.periodPass") }}
                        </span>
                        <span
                            :class="[
                                hasOption('Period', 'UPCOMING') &&
                                    'period-upcoming-active',
                            ]"
                            @click="
                                $emit('changeOpt', {
                                    mode: 'Period',
                                    option: 'UPCOMING',
                                })
                            "
                        >
                            {{ $t("news.periodUpcoming") }}
                        </span>
                    </div>
                </div>
                <div class='dividerItem'>
                    <div class='divider'></div>
                </div>

                <div class='filterItem'>
                    <div class='filterItemTitle'>
                        {{ $t("news.importance") }}
                    </div>
                    <div class='filterItemBtn'>
                        <span
                            :class="[
                                hasOption('Importance', 'LOW') &&
                                    'importance-low-active',
                            ]"
                            @click="
                                $emit('changeOpt', {
                                    mode: 'Importance',
                                    option: 'LOW',
                                })
                            "
                        >
                            {{ $t("news.low") }}
                        </span>
                        <span
                            :class="[
                                hasOption('Importance', 'MEDIUM') &&
                                    'importance-medium-active',
                            ]"
                            @click="
                                $emit('changeOpt', {
                                    mode: 'Importance',
                                    option: 'MEDIUM',
                                })
                            "
                        >
                            {{ $t("news.medium") }}
                        </span>
                        <span
                            :class="[
                                hasOption('Importance', 'HIGH') &&
                                    'importance-high-active',
                            ]"
                            @click="
                                $emit('changeOpt', {
                                    mode: 'Importance',
                                    option: 'HIGH',
                                })
                            "
                        >
                            {{ $t("news.high") }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <van-pull-refresh
            v-model='refresh'
            :loading-text="$t('compLang.loading')"
            :loosing-text="$t('compLang.vanPullRefresh.loosing')"
            :pulling-text="$t('compLang.vanPullRefresh.pulling')"
            @refresh="$emit('onRefresh', 1)"
        >
            <div v-if='isEmpty(data) && !loading'>
                <van-empty
                    :description="$t('common.noData')"
                    image='/images/empty.png'
                />
            </div>
            <van-list
                v-else
                v-model:error='isError'
                v-model:loading='loading'
                :error-text='errorTip'
                :finished='finished'
                :finished-text="$t('common.noMore')"
                :loading-text="$t('compLang.loading')"
                :offset='10'
                @load="$emit('onLoad', 1)"
            >
                <div
                    v-for='(item, index) in data'
                    :key='index'
                    class='card-item'
                >
                    <div v-if='isShowDate(item, index)' class='publishTime'>
                        <span style='text-align: left;'>
                            {{ publishDate(item.PublishTime) }}
                        </span>
                        <span>
                            <!--econ Agenda Header-->
                            <div class='itemTop finHeader'>
                                <span class='finMenu'>
                                    {{ $t("Time") }}
                                </span>

                                <!--Importance-->
                                <div class='bodyRight'>
                                    <div class='rightLable finMenu'>
                                        {{ $t("Importance") }}
                                    </div>
                                </div>

                                <!--Country-->
                                <div class='countryRow'>
                                    <span class='finMenu'>
                                        {{ $t("Event") }}
                                    </span>
                                </div>

                                <div class='itemBody'>
                                    <div class='itemMain'>
                                        <div class='bodyTitle finMenu'>
                                            {{ $t("Title") }}
                                        </div>
                                        <div class='bodyContent'>
                                            <div class='contentItem'>
                                                <div class='itemLable finMenu'>
                                                    {{ $t("news.actual") }}
                                                </div>
                                            </div>
                                            <div class='contentItem'>
                                                <div class='itemLable finMenu'>
                                                    {{ $t("news.forecast") }}
                                                </div>
                                            </div>
                                            <div class='contentItem'>
                                                <div class='itemLable finMenu'>
                                                    {{ $t("news.previous") }}
                                                </div>
                                            </div>
                                        </div>

                                        <!--Related Instruments-->
                                        <div class='bodyRight'>
                                            <div class='rightLable finMenu'>
                                                {{ $t("Related Instruments") }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                    <!--Econ Agenda-->
                    <div class='itemTop'>
                        <span>{{ formatTime(item) }}</span>

                        <!--Importance-->
                        <div v-if='!isHoliDay(item.Description)' class='bodyRight'>
                            <div class='rightLable'>
                                {{ $t("news.concern") }}
                            </div>
                            <div
                                v-if='getConcern(1, item.Description)'
                                class='rightVal'
                            >
                                <img
                                    src='../../../images/craigIndexImg/Vector-1.png'
                                    style='margin-right: 4px;'
                                />
                                <img
                                    src='../../../images/craigIndexImg/Vector.png'
                                    style='margin-right: 4px;'
                                />
                                <img
                                    src='../../../images/craigIndexImg/Vector.png'
                                />
                            </div>
                            <div
                                v-if='getConcern(2, item.Description)'
                                class='rightVal'
                            >
                                <img
                                    src='../../../images/craigIndexImg/Vector-1.png'
                                    style='margin-right: 4px;'
                                />
                                <img
                                    src='../../../images/craigIndexImg/Vector-1.png'
                                    style='margin-right: 4px;'
                                />
                                <img
                                    src='../../../images/craigIndexImg/Vector.png'
                                />
                            </div>
                            <div
                                v-if='getConcern(3, item.Description)'
                                class='rightVal'
                            >
                                <img
                                    src='../../../images/craigIndexImg/Vector-1.png'
                                    style='margin-right: 4px;'
                                />
                                <img
                                    src='../../../images/craigIndexImg/Vector-1.png'
                                    style='margin-right: 4px;'
                                />
                                <img
                                    src='../../../images/craigIndexImg/Vector-1.png'
                                />
                            </div>
                        </div>

                        <!--Country-->
                        <div class='countryRow'>
                            <img
                                :class="[
                                    'country-icon',
                                    'ceFlags',
                                    item.CountryCode.toLowerCase(),
                                ]"
                            />
                            <span>{{ item.CountryCode }}</span>
                        </div>

                        <div class='itemBody'>
                            <div class='itemMain'>
                                <div class='bodyTitle'>
                                    {{ item.Title }}
                                </div>
                                <div class='bodyContent'>
                                    <div class='contentItem'>
                                        <div class='itemLable'>
                                            {{ $t("news.forecast") }}
                                        </div>
                                        <div class='itemVal'>
                                            {{
                                                formatDesc(
                                                    item.Description,
                                                    "Forecast"
                                                )
                                            }}
                                        </div>
                                    </div>
                                    <div class='contentItem'>
                                        <div class='itemLable'>
                                            {{ $t("news.actual") }}
                                        </div>
                                        <div class='itemVal'>
                                            {{
                                                formatDesc(
                                                    item.Description,
                                                    "Actual"
                                                )
                                            }}
                                        </div>
                                    </div>
                                    <div class='contentItem'>
                                        <div class='itemLable'>
                                            {{ $t("news.previous") }}
                                        </div>
                                        <div class='itemVal'>
                                            {{
                                                formatDesc(
                                                    item.Description,
                                                    "Previous"
                                                )
                                            }}
                                        </div>
                                    </div>
                                </div>

                                <!--Related Instruments-->
                                <div v-if='!isHoliDay(item.Description)' class='bodyRight'>
                                    <div class='rightLable'>
                                        {{ $t("Related Instruments") }}
                                    </div>
                                    <div class='itemVal'>
                                        {{
                                            formatDesc(
                                                item.Description,
                                                "Currency"
                                            )
                                        }}
                                    </div>
                                </div>

                                <div v-else class='bodyRight holiday'>
                                    <span>{{ $t('news.holiday') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if='isShowTrade' class='itemTrade'>
                        <div class='tradeName'>
                            {{ name }}
                        </div>
                        <img
                            class='img-people'
                            src='../../../../../assets/newUI/baidu.png'
                        />
                        <div class='tradePercent'>
                            {{ percent }}
                        </div>
                        <div class='tradeMain'>
                            <div class='hots'>
                                <img
                                    class='img-hot'
                                    src='../../../../../assets/newUI/hot.png'
                                />
                                <img
                                    class='img-hot'
                                    src='../../../../../assets/newUI/hot.png'
                                />
                                <img
                                    class='img-hot'
                                    src='../../../../../assets/newUI/hot.png'
                                />
                            </div>
                            <span class='hotSecond'>
                                {{ hotSecond }}
                            </span>
                            <span class='hotThird'>
                                {{ hotThird }}
                            </span>
                            <button>{{ $t("news.trade") }}</button>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <van-popup
            v-model:show='show'
            position='right'
            :style="{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }"
            teleport='body'
        >
            <LayoutTop
                :custom-back='true'
                :menu='false'
                :title="$t('country.title')"
                @back='handleConfirmCountry'
            >
                <template #right>
                    <div class='checkedAllBtn' @click='handleToggle'>
                        {{
                            isAll
                                ? $t("country.invertSelection")
                                : $t("country.selectAll")
                        }}
                    </div>
                </template>
            </LayoutTop>
            <div class='modalContainer'>
                <van-checkbox-group ref='checkboxGroup' v-model='checked'>
                    <van-cell-group inset>
                        <van-cell
                            v-for='(item, index) in countryList'
                            :key='item.code'
                            clickable
                            :title='getCountryName(item)'
                            @click='toggle(index, item)'
                        >
                            <template #right-icon>
                                <van-checkbox
                                    :ref='(el) => (checkboxRefs[index] = el)'
                                    :checked-color='color'
                                    :name='item.code'
                                    @click.stop
                                >
                                    <template #icon='props'>
                                        <img
                                            class='img-icon'
                                            :src='
                                                props.checked
                                                    ? checkedIcon
                                                    : unCheckIcon
                                            '
                                        />
                                    </template>
                                </van-checkbox>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
            </div>
        </van-popup>
    </div>
</template>

<script>
import {
    reactive,
    toRefs,
    onBeforeUpdate,
    ref,
    onMounted,
    watch,
    computed
} from 'vue'
import { isEmpty, getCookie, isChina } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import unCheckIcon from '@plans/images/unCheckIcon.png'
import checkedIcon from '@plans/images/checkedIcon.png'
import template from '@/themes/plans/modules/template/template.vue'
export default {
    emits: ['changeDate', 'onClearAll', 'changeOpt', 'onLoad'],
    components: { template },
    props: {
        startTime: {
            type: String,
            default: ''
        },
        data: {
            type: Array,
            default: () => {
                return []
            }
        },
        loading: {
            type: Boolean,
            default: false
        },
        refresh: {
            type: Boolean,
            default: false
        },
        finished: {
            type: Boolean,
            default: false
        },
        periodMode: {
            type: String,
            default: ''
        },
        importanceMode: {
            type: String,
            default: ''
        }
    },
    emits: [''],
    setup (props, { emit }) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            isShowTrade: false, // 暂时隐藏交易
            name: '伦敦金',
            percent: '78%',
            hotFirst: 3,
            hotSecond: 0.9887,
            hotThird: 0.9895,
            isError: false,
            errorTip: '',
            week: ['日', '一', '二', '三', '四', '五', '六'],
            show: false,
            countryList: [],
            CountryCode: '',
            checked: [],
            checkboxRefs: [],
            checkboxGroup: null,
            unCheckIcon,
            checkedIcon,
            isAll: false,
            isEmpty
        })

        store.dispatch('getCountryListByParentCode').then((res) => {
            if (res.data.length > 0) {
                state.countryList = res.data
            }
        })

        const isShowDate = (item, index) => {
            const curDate = dayjs(item.PublishTime * 1000).format('YYYY-MM-DD')
            if (index === 0) {
                return true
            } else {
                const { PublishTime } = props.data[index - 1]
                return (
                    dayjs(PublishTime * 1000).format('YYYY-MM-DD') !== curDate
                )
            }
        }

        const formatTime = (item) => {
            const { PublishTime, Description } = item || {}
            if (isHoliDay(Description)) {
                return t('news.allDay')
            }
            return dayjs(PublishTime * 1000).format('HH:mm')
        }

        const formatDesc = (desc, key, dValue = '-') => {
            if (isEmpty(desc)) return ''
            return JSON.parse(desc)[key] || dValue
        }

        const publishDate = (time) => {
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

        const getConcern = (important, desc) => {
            return important === Number(formatDesc(desc, 'Important', '-1'))
        }

        const hasOption = (mode, option) => {
            switch (mode) {
                case 'Period':
                    return props.periodMode === option
                case 'Importance':
                    return props.importanceMode === option
                default:
                    return false
            }
        }
        const isHoliDay = (desc) => {
            const descObj = (desc && JSON.parse(desc)) || {}
            const { Important } = descObj || {}
            return Number(Important) === 0
        }

        const toggle = (index, item) => {
            state.checkboxRefs[index].toggle()
        }

        onBeforeUpdate(() => {
            state.checkboxRefs = []
        })

        const getCountryName = (country) => {
            // console.log(country)
            const { nameEn, name } = country || {}
            let res = ''
            if (isChina()) {
                res = name
            } else {
                res = isEmpty(nameEn) ? name : nameEn
            }
            // console.log({ res })
            return res
        }

        const handleToggle = () => {
            state.checkboxGroup.toggleAll(!state.isAll)
        }

        const handleConfirmCountry = () => {
            state.show = false
            if (state.isAll) {
                emit('changeCountries', '')
                return
            }
            state.CountryCode = state.checked.join(',')
            emit('changeCountries', state.CountryCode)
        }

        watch(
            () => state.checked,
            (n) => {
                state.isAll =
                    n.length > 0 && state.countryList.length === n.length
            }
        )

        return {
            isHoliDay,
            handleConfirmCountry,
            handleToggle,
            isChina,
            getCountryName,
            toggle,
            hasOption,
            getConcern,
            formatDesc,
            formatTime,
            isShowDate,
            publishDate,
        ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";
@import "@/sass/country_currency.scss";

.finMenu{
  font-weight: 600 !important;
  font-size: 16px !important;
  color: #D4999F !important;
  line-height: 19px;
}
.filterBox {
padding: rem(10px) rem(20px);
background: var(--f8Color);
.filterTop {
    display: flex;
    align-items: center;

    .filterCountry {
        display: flex;
        & > span {
            font-size: rem(24px);
            color: var(--primaryText);
            padding: 0 rem(12px) 0 0;
            border-radius: rem(20px);
        }
        & > img {
            width: rem(26px);
            height: rem(34px);
        }
    }
    .filterDate {
        margin-left: rem(45px);
        display: flex;
        width: rem(330px);
        height: rem(41px);
        padding: 0 rem(7px);
        align-items: center;
        border: rem(2px) solid var(--cardBg);
        background: var(--contentColor);
        & > img {
            width: rem(31px);
            height: rem(31px);
        }
        & > input {
            flex: 1;
            font-size: rem(22px);
            padding: 0 rem(10px);
            //color: var(--textColor);
        }
    }
    .filterClearAll {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
        .clearAllBtn {
            height: rem(40px);
            display: flex;
            align-items: center;
            padding: 0 rem(12px);
            background: var(--cardBg);
            color: var(--primaryText);
            font-size: rem(24px);
            border-radius: rem(40px);
        }
    }
}
}

.filterCard {
margin-top: rem(23px);
color: var(--placeholdColor);
font-size: rem(24px);
display: flex;
position: relative;
align-items: flex-end;
.dividerItem {
    padding: 0 rem(20px);
    display: flex;
    flex-direction: column-reverse;
    height: 100%;
    .divider {
        width: rem(2px);
        height: rem(40px);
        background: var(--cardBg);
    }
}

.filterItem {
    .filterItemTitle {
    }
    .filterItemBtn {
        margin-top: rem(5px);
        span {
            height: rem(40px);
            background: var(--cardBg);
            border-radius: rem(40px);
            padding: 0 rem(20px);
            margin-left: rem(10px);
            font-size: rem(24px);
            color: var(--primaryText);
            line-height: rem(40px);
            &:first-of-type {
                margin-left: 0;
            }
            &.period-pass-active {
                color: var(--contentColor);
                background: var(--passColor);
            }
            &.period-upcoming-active {
                color: var(--contentColor);
                background: var(--upComingColor);
            }
            &.importance-low-active {
                color: var(--contentColor);
                background: var(--lowColor);
            }
            &.importance-medium-active {
                color: var(--contentColor);
                background: var(--mediumColor);
            }
            &.importance-high-active {
                color: var(--contentColor);
                background: var(--highColor);
            }
        }
    }
}
}

.filterTime {
justify-content: space-between;
& > span {
    font-size: rem(22px);
    color: var(--primaryText);
}
& > div {
    width: rem(270px);
    height: rem(41px);
    background: var(--contentColor);
    border: 0.5px solid var(--lineColor);
}
}

.card-item {
background: var(--contentColor);
.publishTime {
    height: rem(88px);
    background: var(--f8Color);
    align-items: center;
    font-size: rem(26px);
    display: grid;
}

.finHeader{
  padding-bottom: 60px !important;
}
.itemTop {
    display: flex;
    padding: rem(15px) rem(20px);
    align-items: center;
    & > span {
        font-size: rem(28px);
        display: inline-block;
        width: rem(140px);
    }
    .countryRow {
        display: flex;
        align-items: center;
        padding-left: 30px;
        .country-icon {
            margin: 0 rem(10px) 0 rem(5px);
            border-radius: 50%;
        }
    }

    .itemBody {
        flex: 1;
        padding-left: rem(28px);
        .bodyTitle {
            font-size: rem(28px);
            @include ellipsisLn(2);
            margin-bottom: rem(14px);
            align-self: center;
            text-align: start;
            min-width: 300px;
        }
        .itemMain {
            display: flex;
            width: 100%;
            justify-content: space-around;
        }
        .bodyContent {
            display: flex;
            flex: 0.7;
            .contentItem {
                flex: 1;
                text-align: center;
                .itemLable {
                    font-size: rem(24px);
                    color: var(--color80);
                }
                .itemVal {
                    font-size: rem(28px);
                }
            }
        }
        .bodyRight {
            width: rem(110px);
            margin-left: rem(30px);
            &.holiday{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: rem(24px);
                color: var(--color80);
            }
            .rightLable {
                font-size: rem(24px);
                color: var(--color80);
                text-align: center;
            }
            .rightVal {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 10px;
                    height: auto;
                }
            }
        }
    }
}
.itemTrade {
    display: flex;
    align-items: center;
    height: rem(82px);
    background: var(--bgColor);
    padding: 0 rem(20px);
    .tradeName {
        font-size: rem(28px);
        display: inline-block;
        width: rem(140px);
    }
    .img-people {
        width: rem(51px);
        height: rem(41px);
    }
    .tradePercent {
        font-size: rem(28px);
        margin-left: rem(5px);
        width: rem(90px);
    }
    .tradeMain {
        flex: 1;
        display: flex;
        align-content: center;
        justify-content: space-between;
    }
    .hots {
        display: flex;
        .img-hot {
            width: rem(21px);
            height: rem(27px);
            margin-left: rem(3px);
        }
    }
    .hotSecond {
        font-size: rem(28px);
        color: var(--color1);
    }
    .hotThird {
        font-size: rem(28px);
        color: var(--color2);
    }
    button {
        background: var(--primary);
        color: var(--primaryLc);
        font-size: rem(28px);
        width: rem(125px);
        height: rem(41px);
        border-radius: rem(10px);
        text-transform: uppercase;
    }
}
}
.finCard {
max-width: 1200px;

:deep(.van-popup) {
    display: flex;
    flex-direction: column;
}
}
.modelHeader {
position: fixed;
width: 100%;
left: 0;
top: 0;
display: flex;
justify-content: space-between;
align-items: center;
height: rem(90px);
color: var(--contentColor);
background: var(--primary);
padding: 0 rem(30px);
& > div {
    flex: 1;
    &:nth-of-type(1) {
        text-align: left;
    }
    &:nth-of-type(2) {
        text-align: center;
    }
    &:nth-of-type(3) {
        text-align: right;
    }
}
}
.modalContainer {
padding-top: rem(110px);
flex: 1;
overflow-y: scroll;
.img-icon {
    width: rem(36px);
    height: rem(36px);
}
:deep(.van-cell-group--inset) {
    margin: 0;
}
:deep(.van-cell) {
    &::after {
        right: 0;
        left: 0;
    }
}
}
</style>
