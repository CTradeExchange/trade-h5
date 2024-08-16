<template>
    <list
        ref='listRef'
        v-bind='$attrs'
        :liabilities-type='1'
        :request-api='queryCapitalFlowList'
        :request-params='newParams'
    >
        <template #filter>
            <div class="search-body">
                <flowFilter :trade-type='tradeType' :value='businessType' @change='onChange' />
                <dateFilter class='dateFilter' @change='onDateChange' />
            </div>
        </template>
        <template #default='{ list }'>
            <div v-for='item in list' :key='item.id' class='li'>
                <p>{{ formatTime(item.createTime) }}</p>
                <p class="title">
                    <span>{{ item.currency }}</span>
                    <span>{{ item.amount > 0 ? '+ '+item.amount : item.amount.replace('-','- ') }}</span>
                </p>
                <p>
                    <span>{{ item.businessType1Name }}</span>
                    <span>{{ $t('common.balance') }} {{ item.amountAfter }}</span>
                </p>
            </div>
        </template>
    </list>
</template>

<script>
import list from './list'
import { queryCapitalFlowList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import flowFilter from './flowFilter'
import dateFilter from './dateFilter'
import { computed, ref, unref } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: { list, flowFilter, dateFilter },
    setup (props) {
        const route = useRoute()
        let { tradeType, tradeTypes } = route.query
        if (!tradeType) tradeType = tradeTypes
        const { tm } = useI18n({ useScope: 'global' })
        const flowSubCategory = tm(`fund.flowSubCategory.${tradeType}`)
        const formatTime = (val) => {
            return window.dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }

        const listRef = ref(null)
        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }

        const requestParams = ref({
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs().endOf('day').valueOf(),
        })
        
        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const businessType = ref('')
        const onChange = value => {
            businessType.value = value
            refresh()
        }

        const newParams = computed(() => {
            if (businessType.value) {
                return {
                    ...unref(requestParams),
                    businessType: businessType.value
                }
            }

            return unref(requestParams)
        })
        
        const onDateChange = (value) => {
            const [startTime, endTime] = value || []
            if (startTime && endTime) {
                requestParams.value = {
                    ...requestParams.value,
                    startTime,
                    endTime
                }
                refresh()
            } else {
                requestParams.value = {}
                refresh()
            }
        }

        return {
            setParams,
            refresh,
            formatTime,
            queryCapitalFlowList,
            flowSubCategory,
            newParams,
            onChange,
            onDateChange,
            businessType,
            tradeType,
            listRef
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.search-body {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background: #FAF9F9;
    padding: 0 24px;
}

.li {
    width: 100%;
    height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #F8F8F8;
    padding: 16px 24px;
    font-size: 12px;
    color: #999999;
    background-color: var(--contentColor);
    & > p {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        line-height: 1.5;
    }
    .title {
        font-size: 16px;
        color: var(--primaryText);
    }
}

</style>