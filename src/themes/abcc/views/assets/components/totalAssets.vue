<template>
    <div class='totalAssets'>
        <div v-if='assetsInfo && assetsInfo.totalBalance>0' class='totalAssetsBlock'>
            <AssetsChart />
            <div class='totalAssetsInfo'>
                <p class='label'>
                    {{ $t('assets.totalAssets') }}({{ assetsInfo.currency }})
                </p>
                <p class='totalAmount'>
                    {{ assetsInfo.totalBalance }}
                </p>
            </div>
        </div>
        <ul class='assetList'>
            <li class='item'>
                <p class='muted'>
                    <span class='color_jzc'></span>
                    {{ $t('assets.netAssets') }}
                </p>
                <p>{{ assetsInfo.totalNetAssets }}</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span class='color_zjk'></span>
                    {{ $t('assets.totalLoan') }}
                </p>
                <p>{{ assetsInfo.totalLiabilitiesPrincipal }}</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span class='color_lx'></span>
                    {{ $t('trade.swap_2') }}
                </p>
                <p>{{ assetsInfo.totalInterest }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import AssetsChart from './assetsChart.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
        AssetsChart,
    },
    setup () {
        const store = useStore()
        const assetsInfo = computed(() => store.state._user.assetsInfo)
        return {
            assetsInfo,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAssets {
    padding: rem(30px) 0;
    background: var(--contentColor);
    border-radius: 4px;
}
.totalAssetsBlock {
    margin-bottom: rem(60px);
}
.totalAssetsInfo {
    position: absolute;
    top: rem(140px);
    left: 50%;
    font-size: rem(28px);
    text-align: center;
    transform: translate(-50%, 0);
    .label {
        margin-top: rem(20px);
        color: var(--minorColor);
        font-size: rem(28px);
    }
    .totalAmount {
        margin-top: rem(10px);
        color: var(--color);
        font-size: rem(50px);
    }
}
.assetList {
    display: grid;
    grid-template-columns: auto auto auto;
    justify-content: space-around;
    font-size: rem(34px);
    line-height: 1.5;
    .muted {
        font-size: rem(24px);
    }
    .color_jzc,
    .color_zjk,
    .color_lx {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 8px;
    }
    .color_jzc {
        background: #477FD3; // 固定颜色
    }
    .color_zjk {
        background: #F2A11B; // 固定颜色
    }
    .color_lx {
        background: #26A69A; // 固定颜色
    }
}
</style>
