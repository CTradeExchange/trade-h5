<template>
    <div class='applyRecord'>
        <van-tabs v-model:active='redeemActive' class='redeemTab' type='card'>
            <van-tab :title='$t("fundInfo.curRedeem")' />
            <van-tab :title='$t("fundInfo.historyRedeem")' />
        </van-tabs>
        <filterBox />
        <div class='listContainer'>
            <listVue
                ref='listRef'
                class='listVue'
                :request-api='queryPlatFormMessageLogList'
                :request-params='params'
            >
                <template #default='{ list }'>
                    <div v-for='item in list' :key='item.id' class='li'>
                        <fundRedeemRecordItem v-if='redeemActive===0' />
                        <fundRedeemRecordHistoryItem v-else-if='redeemActive===1' />
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
import { queryPlatFormMessageLogList } from '@/api/user'
import { ref } from 'vue'

const params = {}
const redeemActive = ref(0)

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
