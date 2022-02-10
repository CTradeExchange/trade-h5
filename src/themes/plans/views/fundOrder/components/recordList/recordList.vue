<template>
    <div class='recordList'>
        <tabBar v-model:active='tabActive' />
        <div v-if='tabActive===0' class='listWrap'>
            <fundApplyRecordItem v-for='item in 2' :key='item' />
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

// 现货账户列表
const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === 5))
const tabActive = ref(1)
const redeemActive = ref(0)
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
