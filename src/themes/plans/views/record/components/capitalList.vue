<template>
    <list
        v-if='reRender'
        :liabilities-type='1'
        :request-api='queryCapitalFlowList'
        v-bind='$attrs'
        :request-params='newParams'
    >
        <template #filter>
            <flowFilter :trade-type='tradeType' :value='businessType' @change='onChange' />
        </template>
        <template #default='{ list }'>
            <div v-for='item in list' :key='item.id' class='li'>
                <div class='block'>
                    <div class='left'>
                        <span class='currency'>
                            {{ item.currency }}
                        </span>
                        <span class='businessType'>
                            {{ flowSubCategory[item.businessType1] }}
                        </span>
                        <span class='time'>
                            {{ formatTime(item.createTime) }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='balance'>
                            {{ item.amount }}
                        </span>
                        <span class='amountAfter'>
                            {{ $t('common.balance') }} {{ item.amountAfter }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </list>
</template>

<script>
import list from './list'
import dayjs from 'dayjs'
import { queryCapitalFlowList } from '@/api/user'
import { useI18n } from 'vue-i18n'
import flowFilter from './flowFilter'
import { computed, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: { list, flowFilter },
    props: {
        requestParams: {
            type: Object,
            default: () => ({})
        }
    },
    setup (props) {
        const route = useRoute()
        const { tradeType } = route.query
        const { tm } = useI18n({ useScope: 'global' })
        const flowSubCategory = tm(`fund.flowSubCategory.${tradeType}`)
        const formatTime = (val) => {
            return dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }
        const reRender = ref(true)

        const businessType = ref('')
        const onChange = value => {
            businessType.value = value

            reRender.value = false
            nextTick(() => {
                reRender.value = true
            })
        }

        const newParams = computed(() => {
            if (businessType.value) {
                return {
                    ...props.requestParams,
                    businessType: businessType.value
                }
            }

            return props.requestParams
        })

        return {
            formatTime,
            queryCapitalFlowList,
            flowSubCategory,
            newParams,
            onChange,
            reRender,
            businessType,
            tradeType
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
        .time {
            margin-top: rem(15px);
            color: var(--placeholdColor);
            font-weight: 400;
            font-size: rem(20px);
            line-height: rem(22px);
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
        }
        .left {
            display: flex;
            flex-direction: column;
            .currency {
                color: var(--color);
                font-weight: 500;
                font-size: rem(30px);
                line-height: rem(32px);
            }
            .businessType {
                margin-top: rem(15px);
            }
        }
        .right {
            display: flex;
            flex-direction: column;
            text-align: right;
            .balance {
                color: var(--color);
                font-weight: 400;
                font-size: rem(34px);
                line-height: rem(36px);
            }
            .amountAfter {
                margin-top: rem(15px);
                color: var(--placeholdColor);
                font-weight: 400;
                font-size: rem(20px);
                line-height: rem(22px);
            }
        }
    }
}

</style>
