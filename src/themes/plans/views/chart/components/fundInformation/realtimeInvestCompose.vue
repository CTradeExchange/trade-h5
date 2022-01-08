<template>
    <div class='realtimeInvestCompose'>
        <h4 class='title'>
            {{ $t('fundInfo.realtimeInvestCompose') }}
        </h4>
        <div class='assetsTitle cellflex'>
            <p class='hd'>
                资产
            </p>
            <p class='bd'>
                排名
                <br />
                <span class='small'>
                    (较上期变化)
                </span>
            </p>
            <p class='ft'>
                权重
                <br />
                <span class='small'>
                    (较上期变化)
                </span>
            </p>
        </div>
        <ul class='assetsList'>
            <li v-for='item in 10' :key='item' class='cellflex'>
                <p class='hd'>
                    <i class='currencyIcon'></i>
                    BTC
                </p>
                <p class='bd'>
                    1(-)
                </p>
                <p class='ft'>
                    23%(-0.5%)
                </p>
            </li>
        </ul>
        <div class='block'>
            <div ref='chartPieDOM' class='chartPieDOM'></div>
        </div>

        <div class='block'>
            <h4 class='singleAssetTitle'>
                {{ $t('fundInfo.singleAsset') }}
            </h4>
            <div ref='chartBarDOM' class='chartBarDOM'></div>
        </div>
    </div>
</template>

<script setup>
import { delayAwaitTime } from '@/utils/util'
import { nextTick, onMounted, ref } from 'vue'
import { useChart_pieDoughnut, useChart_bar } from './hooks/realtimeInvestCompose'

const chartPieDOM = ref('')
const chartBarDOM = ref('')
onMounted(async () => {
    await nextTick()
    await delayAwaitTime(200)
    useChart_pieDoughnut(chartPieDOM.value)
    useChart_bar(chartBarDOM.value)
})
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.title{
    font-size: rem(32px);
}
.assetsTitle{
    margin-top: rem(30px);
    color: var(--minorColor);
    font-size: rem(24px);
}
.assetsList{
    margin-top: rem(20px);
    font-size: rem(28px);
    li{
        line-height: rem(60px);
    }

}
.cellflex{
    display: flex;
    text-align: right;
    .hd{
        text-align: left;
    }
    .bd{
        flex: 1;
    }
    .ft{
        width: rem(240px);
    }
    .small{
        font-size: rem(22px);
    }
}
.block{
    margin-top: rem(40px);
    border-top: 6px solid var(--bgColor);
}
.chartPieDOM{
    height: rem(400px);
}
.singleAssetTitle{
    padding: rem(30px) 0;
    font-size: rem(32px);
}
.chartBarDOM{
    height: rem(500px);
}
</style>
