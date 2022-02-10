<template>
    <div>
        <van-tabs v-model:active='active' class='fundInfoTab' type='card'>
            <van-tab :title='$t("fundInfo.baseInfo")'>
                <div v-if='active === 0' class='case'>
                    <baseVue />
                </div>
            </van-tab>
            <van-tab :title='$t("fundInfo.fundPerformance")'>
                <div v-if='active === 1' class='case'>
                    <performanceVue />
                </div>
            </van-tab>
            <van-tab :title='$t("fundInfo.investCompose")'>
                <div v-if='active === 2' class='case'>
                    <realtime-invest-compose />
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup>
import { provide, ref, defineProps } from 'vue'
import baseVue from './base.vue'
import performanceVue from './performance.vue'
import realtimeInvestCompose from './realtimeInvestCompose.vue'
const props = defineProps({
    fundId: [String, Number],
    jump: String
})
const active = ref(0)
provide('fundId', props.fundId)
provide('jump', props.jump)
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
    :deep(.van-tabs__content) {
        margin-top: 10px;
    }
}
.case {
    max-width: 600px;
    margin: 0 auto;
}
</style>
