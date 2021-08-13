<template>
    <list
        class='list'
        :liabilities-type='1'
        :request-api='queryCapitalFlowList'
    >
        <template #default='{ list }'>
            <div v-for='item in list' :key='item.id' class='li'>
                <div class='block'>
                    <div class='left'>
                        <span class='currency'>
                            {{ item.currency }}
                        </span>
                        <span class='businessType'>
                            {{ proBtns[item.businessType] }}
                        </span>
                    </div>
                    <div class='right'>
                        <span class='balance'>
                            {{ item.amount }}
                        </span>
                        <span class='time'>
                            {{ formatTime(item.createTime) }}
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

export default {
    components: { list },
    setup (props) {
        const { tm } = useI18n({ useScope: 'global' })
        const proBtns = tm('fund.proBtns')
        const formatTime = (val) => {
            return dayjs(val).format('YYYY/MM/DD HH:mm:ss')
        }
        return {
            formatTime,
            queryCapitalFlowList,
            proBtns
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.list {
    width: 100%;
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
                    color: #333;
                    font-weight: 400;
                    font-size: rem(34px);
                    line-height: rem(36px);
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
    }
}
</style>
