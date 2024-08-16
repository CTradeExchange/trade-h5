<template>
     <layoutTop :title='$t("record.records")' v-if="props.isShow" />
    <div class='filter-wrap'>
        <van-dropdown-menu :active-color='style.primary' :overlay='true'>
            <van-dropdown-item
                ref='timeDropdown'
                v-model='timeVal'
                :options='timeList'
                @change='timeChange'
            >
                <template #title v-if='timeVal === 5'>
                    {{ customDate }}
                </template>
                <template #default>
                    <dateRange :is-selected='timeVal === 5' @change='onRangeChange' />
                </template>
            </van-dropdown-item>
        </van-dropdown-menu>
    </div>
    <list
        v-bind='$attrs'
        ref='listRef'
        :liabilities-type='1'
        :request-api='capitalTransferRecord'
        :request-params='requestParams'
    >
        <template #default='{ list }'>
            <div v-for='item in list' :key='item' class='li'>
                <div class='block'>
                    <div class='left'>
                        <span class='currency'>
                            {{ item.outCurrencyCode }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='balance'>
                            {{ item.outAmount }}
                        </span>
                    </div>
                </div>
                <div class='block'>
                    <div class='left'>
                        <span class='num'>
                            <strong>{{ $t('tradeType['+tradeType+']') }}</strong> -
                            {{ directionText(item,1) }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='num'>
                            <strong>{{ $t('tradeType['+item.rightTradeType+']') }}</strong> - {{ directionText(item,2) }}
                        </span>
                    </div>
                </div>
                <div class='block'>
                    <span class='time'>
                        {{ formatTime(item.createTime) }}
                    </span>
                </div>
            </div>
        </template>
    </list>
</template>

<script>
import list from './list'
import { computed, reactive, ref, toRef, toRefs, unref } from 'vue'
import { capitalTransferRecord } from '@/api/user'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import dateRange from '@plans/components/dateRange'

export default {
    components: { list, dateRange },
     props: {
        isShow: {
            type: Boolean,
            default:true
        }
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const { tradeType } = route.query
        const listRef = ref(null)
        const style = computed(() => store.state.style)
        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }
        const state = reactive({
            rightTradeType: '',
            timeVal: 2,
            customDate: '',
            timeList: [
                { text: t('common.curToday'), value: 1 },
                { text: t('common.curWeek'), value: 2 },
                { text: t('common.curMonth'), value: 3 },
                { text: t('common.curThreeMonth'), value: 4 }
            ],
            requestParams: {
                startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
                endTime: window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 23:59:59')).valueOf(),
            }
        })
        // 时间筛选
        const timeChange = (timeType) => {
            if (timeType === 0) {
                state.requestParams.startTime = -1
                state.requestParams.endTime = -1
            } else if (timeType === 1) {
                state.requestParams.startTime = window.dayjs(window.dayjs(new Date()).format('YYYY/MM/DD 00:00:00')).valueOf()
            } else if (timeType === 2) {
                state.requestParams.startTime = window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf()
            } else if (timeType === 3) {
                state.requestParams.startTime = window.dayjs(window.dayjs().subtract(1, 'month').format('YYYY/MM/DD')).valueOf()
            } else if (timeType === 4) {
                state.requestParams.startTime = window.dayjs(window.dayjs().subtract(3, 'month').format('YYYY/MM/DD')).valueOf()
            }
            refresh()
        }
        // 选择自定义时间
        const onRangeChange = (timeList) => {
            state.timeVal = 5
            if (timeList.length > 1) {
                state.requestParams.startTime = timeList[0]
                state.requestParams.endTime = timeList[1]
                state.customDate = window.dayjs(timeList[0]).format('YYYY/MM/DD') + '-' + window.dayjs(timeList[1]).format('YYYY/MM/DD')
            }
            refresh()
        }

        const directionText = (item, type) => {
            const key = ['inTradeType', 'outTradeType'].find(k => Number(item[k]) === Number(tradeType))
            if (key === 'inTradeType') {
                item.rightTradeType = item.outTradeType
                return type === 1 ? t('assets.toAccount') : t('assets.fromAccount')
            } else if (key === 'outTradeType') {
                item.rightTradeType = item.inTradeType
                return type === 1 ? t('assets.fromAccount') : t('assets.toAccount')
            }
        }
        return {
            capitalTransferRecord,
            listRef,
            refresh,
            tradeType,
            directionText,
            timeChange,
            style,
            onRangeChange,
            props,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.li {
    width: 100%;
    margin-bottom: rem(20px);
    padding: rem(38px) rem(30px);
    white-space: nowrap;
    background-color: var(--contentColor);
    border-radius: rem(10px);
    .block {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0 0 rem(30px) 0;
        &:last-child {
            margin: 0;
        }
        .label {
            color: var(--minorColor);
            font-weight: 500;
            font-size: rem(24px);
            line-height: rem(26px);
        }
        .num {
            margin-top: rem(13px);
            color: var(--normalColor);
            font-weight: 400;
            font-size: rem(24px);
            white-space: break-spaces;
        }
        .left {
            max-width: 50%;
            display: flex;
            flex-direction: column;
            .currency {
                color: var(--color);
                font-weight: 500;
                font-size: rem(30px);
                line-height: rem(32px);
            }
        }
        .right {
            max-width: 50%;
            display: flex;
            flex-direction: column;
            text-align: right;
            .balance {
                color: var(--color);
                font-weight: 400;
                font-size: rem(34px);
                line-height: rem(36px);
            }
        }
        .time {
            margin-top: rem(15px);
            color: var(--placeholdColor);
            font-weight: 400;
            font-size: rem(20px);
            line-height: rem(22px);
        }
    }
}

.filter-wrap {
    width: 100%;
    background: var(--bgColor);
    display: flex;
    align-items: center;
    justify-content: space-between;
    :deep(.van-dropdown-menu) {
        .van-dropdown-menu__bar {
            width:rem(360px);
            align-items: center;
            padding: 0 rem(10px);
            background: var(--bgColor);
            box-shadow: none;
            .van-dropdown-menu__item {
                position: relative;
                justify-content: space-between;
                height: rem(60px);
                margin: 0 rem(10px);
                padding: 0 rem(5px);
                background: var(--contentColor);
                border-radius: rem(6px);
                .van-dropdown-menu__title {
                    position: static;
                    color: var(--mainColor);
                    font-family: Inter;
                    font-size: rem(28px);
                    &::after {
                        right: rem(15px);
                        border-color: transparent transparent  var(--mainColor) var(--mainColor);
                    }
                }
                .van-cell__title {
                    span {
                        color: var(--mainColor);
                        font-size: rem(28px);
                    }
                }
            }
        }
        .van-dropdown-item__option {
            font-size: rem(28px);
        }
    }
}
:deep(.van-cell .van-cell__title){
    color: var(--mainColor);
    font-size: rem(28px);
  }
  :deep(.van-dropdown-item__option--active .van-cell__title){
    color: var(--primary) !important;
  }
</style>
