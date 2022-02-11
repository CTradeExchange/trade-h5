<template>
    <div class='recordList'>
        <tabBar v-model:active='tabActive' />
        <div v-if='tabActive===0' class='listWrap'>
            <fundApplyRecordItem v-for='item in applyRecordData' :key='item' :data='item' />
        </div>
        <div v-else-if='tabActive===1' class='listWrap'>
            <van-tabs v-model:active='redeemActive' class='redeemTab' type='card'>
                <van-tab title='当前赎回' />
                <van-tab title='历史赎回' />
            </van-tabs>
            <template v-if='redeemActive===0'>
                <fundRedeemRecordItem v-for='item in 1' :key='item' />
            </template>
            <template v-else>
                <fundRedeemRecordHistoryItem v-for='item in 1' :key='item' />
            </template>
        </div>
        <!-- 资产 -->
        <div v-else-if='tabActive===2'>
            <assetsItem v-for='account in accountList' :key='account.accountId' class='block' :data='account' />
        </div>
    </div>
</template>

<script setup>
import tabBar from './tabBar.vue'
import fundApplyRecordItem from '@plans/modules/fundApplyRecord/fundApplyRecordItem.vue'
import fundRedeemRecordItem from '@plans/modules/fundApplyRecord/fundRedeemRecordItem.vue'
import fundRedeemRecordHistoryItem from '@plans/modules/fundApplyRecord/fundRedeemRecordHistoryItem.vue'
import assetsItem from '@plans/modules/assets/assetsItem.vue'
import { ref, computed, unref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { fundApplyRecord, fundRedeemRecord } from '@/api/fund'
const store = useStore()

// 现货账户列表
const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 5))
const tabActive = ref(0)
const redeemActive = ref(0)
const applyRecordData = ref([])

// 获取基金申购记录
const getFundApplyRecord = function () {
    fundApplyRecord({ size: 10, current: 1 }).then(res => {
        if (res.check()) {
            applyRecordData.value = res.data
        }
    })
}

// 获取基金赎回记录
const getFundRedeemRecord = function () {
    fundRedeemRecord({ size: 10, current: 1, sharesStatus: unref(redeemActive) }).then(res => {
        if (res.check()) {
            applyRecordData.value = res.data
        }
    })
}

watch(
    [redeemActive, tabActive],
    () => {
        tabActive.value === 0 ? getFundApplyRecord() : getFundRedeemRecord()
    }
)

onMounted(() => {
    getFundApplyRecord()
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.recordList{
    margin-top: rem(30px);
    // background: var(--contentColor);
    .listWrap{
        margin-top: rem(30px);
        background: var(--contentColor);
        padding: rem(10px) rem(30px);

    }
    .redeemTab{
        margin: rem(20px) 10%;

        --van-tabs-default-color: var(--primary);
        :deep(.van-tab--active .van-tab__text){
            color:#fff;
        }
    }
}
</style>
