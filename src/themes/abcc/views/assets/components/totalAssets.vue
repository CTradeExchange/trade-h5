<template>
    <div class='totalAssets'>
        <div class='relative'>
            <AssetsChart />
            <div class='totalAssetsInfo'>
                <p class='label'>
                    总资产(USDT)
                </p>
                <p class='totalAmount'>
                    341234.23
                </p>
            </div>
        </div>
        <ul class='assetList'>
            <li class='item'>
                <p class='muted'>
                    <span class='color_jzc'></span>
                    净资产
                </p>
                <p>12312312.12</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span class='color_zjk'></span>
                    总借款
                </p>
                <p>1231232.12</p>
            </li>
            <li class='item'>
                <p class='muted'>
                    <span class='color_lx'></span>
                    利息
                </p>
                <p>122.12</p>
            </li>
        </ul>
    </div>
</template>

<script>
// import { reactive, toRefs } from 'vue'
import AssetsChart from './assetsChart.vue'
export default {
    components: {
        AssetsChart,
    },
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.totalAssets {
    padding: rem(30px);
    background: var(--contentColor);
}
.totalAssetsInfo {
    position: absolute;
    top: rem(90px);
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
    grid-column-gap: 5px;
    grid-template-columns: 1fr 1fr 1fr;
    margin-top: rem(60px);
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
