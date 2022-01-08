<template>
    <div class=''>
        <van-tabs v-model:active='active' class='fundInfoTab' type='card'>
            <van-tab :title='$t("fundInfo.baseInfo")'>
                <baseVue />
            </van-tab>
            <van-tab :title='$t("fundInfo.fundPerformance")'>
                <performanceVue />
            </van-tab>
            <van-tab :title='$t("fundInfo.investCompose")'>
                <realtime-invest-compose />
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import baseVue from './base.vue'
import performanceVue from './performance.vue'
import realtimeInvestCompose from './realtimeInvestCompose.vue'
const active = ref(0)
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.fundInfoTab{
    margin: rem(30px) rem(20px);
    min-height: 320px;
    :deep(.van-tabs__wrap){
        border: 0 !important;
    }
    :deep(.van-tabs__nav){
        border: 0;
        span.van-tab__text{
            font-weight: normal !important;
        }
    }
    :deep(.van-tab){
        border: 0;
        &.van-tab--active{
            background: var(--assistColor);
            color: var(--primary);

        }
    }
}
</style>
