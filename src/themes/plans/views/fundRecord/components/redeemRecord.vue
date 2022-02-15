<template>
    <div class='applyRecord'>
        <van-tabs v-model:active='redeemActive' class='redeemTab' type='card' @click-tab='onClickTab'>
            <van-tab :title='$t("fundInfo.curRedeem")' />
            <van-tab :title='$t("fundInfo.historyRedeem")' />
        </van-tabs>
        <filterBox :assets-list='assetsList' @assetChange='assetChange' @dateChange='dateChange' />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='fundRedeemRecord'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundRedeemRecordItem v-if='redeemActive===0' :data='item' />
                        <fundRedeemRecordHistoryItem v-else-if='redeemActive===1' :data='item' />
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
import { fundRedeemRecord } from '@/api/fund'
import { computed, ref, unref } from 'vue'
import { hooks } from './hooks'

const { assetsList } = hooks()

const redeemActive = ref(0)
const currencyShares = ref('')
const startTime = ref()
const endTime = ref()
const params = computed(() => {
    return {
        currencyShares: unref(currencyShares),
        sharesStatus: unref(redeemActive),
        updateStartTime: unref(startTime),
        updateEndTime: unref(endTime),
    }
})
const listRef = ref(null)
const refresh = () => {
    unref(listRef) && unref(listRef).refresh()
}
// 切换当前赎回、历史赎回
const onClickTab = (val) => {
    refresh()
}
// 筛选代币
const assetChange = val => {
    console.log(val)
    currencyShares.value = val || ''
    setTimeout(() => {
        refresh()
    }, 10)
}
// 筛选日期
const dateChange = val => {
    console.log(val);
    [startTime.value, endTime.value] = val || []
    setTimeout(() => {
        refresh()
    }, 10)
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.applyRecord{
    height: 100%;
    display: flex;
    flex-flow: column;
    .redeemTab{
        margin: rem(20px) 10% 0;

        --van-tabs-default-color: var(--primary);
        :deep(.van-tab--active .van-tab__text){
            color:#fff;
        }
    }
    .listContainer{
        background: var(--contentColor);
        flex: 1;
        overflow-y: auto;
    }
}
</style>
