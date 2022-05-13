<template>
    <div class='applyRecord'>
        <filterBox :assets-list='assetsList' @assetChange='assetChange' @dateChange='dateChange' />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='fundApplyRecord'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundApplyRecordItem
                            :data='item'
                            :show-info='showInfo'
                            @showDetail='showDetail(item)'
                        />
                    </div>
                </template>
            </listVue>
        </div>
    </div>
</template>

<script setup>
import listVue from '@plans/views/record/components/list.vue'
import fundApplyRecordItem from '@plans/modules/fundApplyRecord/fundApplyRecordItem.vue'
import filterBox from './filterBox.vue'
import { fundApplyRecord, getFundCurrencyList } from '@/api/fund'
import { hooks } from './hooks'
import { useStore } from 'vuex'
import { ref, unref, computed } from 'vue'

const params = {}
const { assetsList } = hooks()
const store = useStore()
const listRef = ref(null)
const showInfo = ref([])
const refresh = () => {
    unref(listRef) && unref(listRef).refresh()
}
// 获取账户信息
const customerNo = computed(() => store.state._user.customerInfo.customerNo)
// 筛选日期
const assetChange = val => {
    params.currencyShares = val || ''
    refresh()
}
// 筛选日期
const dateChange = val => {
    const [startTime, endTime] = val || []
    params.startTime = startTime
    params.endTime = endTime
    refresh()
}

const showDetail = item => {
    getFundCurrencyList({
        customerNo: customerNo.value,
        proposalNo: item.proposalNo,
    }).then(res => {
        if (res.check()) {
            if (res.data?.length > 0) {
                showInfo.value = []
                res.data.forEach(el => {
                    showInfo.value.push({
                        currency: el.currency,
                        amount: el.amount,
                        fees: el.fees
                    })
                })
            }
        }
    })
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.applyRecord {
    display: flex;
    flex-flow: column;
    height: 100%;
    .listContainer {
        flex: 1;
        overflow-y: auto;
        background: var(--contentColor);
    }
}
</style>
