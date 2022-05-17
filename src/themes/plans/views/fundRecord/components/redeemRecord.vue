<template>
    <div class='applyRecord'>
        <van-tabs v-model:active='redeemActive' class='redeemTab' type='card' @click-tab='onClickTab'>
            <van-tab :title='$t("fundInfo.curRedeem")' />
            <van-tab :title='$t("fundInfo.historyRedeem")' />
        </van-tabs>
        <filterBox ref='filterBoxRef' :assets-list='assetsList' @assetChange='assetChange' @dateChange='dateChange' />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='fundRedeemRecord'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundRedeemRecordItem
                            v-if='redeemActive===0'
                            :data='item'
                        />
                        <fundRedeemRecordHistoryItem
                            v-else-if='redeemActive===1'
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
import fundRedeemRecordItem from '@plans/modules/fundApplyRecord/fundRedeemRecordItem.vue'
import fundRedeemRecordHistoryItem from '@plans/modules/fundApplyRecord/fundRedeemRecordHistoryItem.vue'
import filterBox from './filterBox.vue'
import { fundRedeemRecord, getFundRedeemCurrencyList } from '@/api/fund'
import { useStore } from 'vuex'
import { computed, ref, unref } from 'vue'
import { hooks } from './hooks'
const store = useStore()
const { assetsList } = hooks()

const redeemActive = ref(0)
const filterBoxRef = ref(null)
const currencyShares = ref('')
const startTime = ref()
const endTime = ref()
const showInfo = ref([])
const params = computed(() => {
    const p = {
        currencyShares: unref(currencyShares),
        sharesStatus: unref(redeemActive),
    }
    if (unref(redeemActive) === 0) {
        p.startTime = unref(startTime)
        p.endTime = unref(endTime)
    } else {
        p.updateStartTime = unref(startTime)
        p.updateEndTime = unref(endTime)
    }
    return p
})
// 获取账户信息
const customerNo = computed(() => store.state._user.customerInfo.customerNo)

const listRef = ref(null)
const refresh = () => {
    unref(listRef) && unref(listRef).refresh()
}
// 切换当前赎回、历史赎回
const onClickTab = (val) => {
    unref(filterBoxRef).shareTokenCode = 0
    unref(filterBoxRef).timeVal = 0
    startTime.value = undefined
    endTime.value = undefined
    currencyShares.value = ''
    refresh()
}
// 筛选代币
const assetChange = val => {
    currencyShares.value = val || ''
    setTimeout(() => {
        refresh()
    }, 10)
}
// 筛选日期
const dateChange = val => {
    [startTime.value, endTime.value] = val || []
    setTimeout(() => {
        refresh()
    }, 10)
}
const showDetail = item => {
    getFundRedeemCurrencyList({
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
    .redeemTab {
        margin: rem(20px) 10% 0;

        --van-tabs-default-color: var(--primary);
        :deep(.van-tab--active .van-tab__text) {
            color: #FFF;
        }
    }
    .listContainer {
        flex: 1;
        overflow-y: auto;
        background: var(--contentColor);
    }
}
</style>
