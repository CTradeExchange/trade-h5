<template>
    <list
        v-bind='$attrs'
        ref='listRef'
        :liabilities-type='1'
        :request-api='capitalTransferRecord'
        :request-params='requestParams'
    >
        <template #default='{ list }'>
            <div v-for='item in list' :key='item' class='li'>
                <p>{{ formatTime(item.createTime) }}</p>
                <p class="title">
                    <span>{{ item.outCurrencyCode }}</span>
                    <span>{{ item.outAmount }}</span>
                </p>
                <p>
                    <span>{{ $t('tradeType['+tradeType+']') }} - {{ directionText(item,1) }}</span>
                    <span>{{ $t('tradeType['+item.rightTradeType+']') }} - {{ directionText(item,2) }}</span>
                </p>
            </div>
        </template>
    </list>
</template>

<script>
import list from './list'
import { reactive, ref, toRefs, unref } from 'vue'
import { capitalTransferRecord } from '@/api/user'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default {
    components: { list },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const route = useRoute()
        const { tradeType } = route.query
        const requestParams = ref({
            startTime: window.dayjs(window.dayjs().subtract(7, 'day').format('YYYY/MM/DD')).valueOf(),
            endTime: window.dayjs().endOf('day').valueOf()
        })
        const setParams = (params) => {
            requestParams.value = params || {}
        }

        const listRef = ref(null)

        const refresh = () => {
            unref(listRef) && unref(listRef).refresh()
        }
        const state = reactive({
            rightTradeType: ''
        })

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
            requestParams,
            setParams,
            listRef,
            refresh,
            tradeType,
            directionText,
            ...toRefs(state)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

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
