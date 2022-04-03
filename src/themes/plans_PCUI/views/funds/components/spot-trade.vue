<template>
    <div class='spot-trade'>
        <div class='trade-header'>
            <span>{{ $t('funds.spot') }}</span>
            <span>{{ $t('funds.spot') }}</span>
        </div>
        <!-- 选项卡 -->
        <el-tabs v-model='activeName'>
            <el-tab-pane :label="$t('trade.buy')" name='buy'>
                <!-- <div>
                    <div class='form-item disable'>
                        <label for=''>
                            {{ $t('trade.buyPrice') }}  &nbsp;&nbsp;
                            <span class='minor'>
                                {{ $t('trade.bestPriceBuy') }}
                            </span>
                        </label>
                    </div>
                    <div class='footerBtn buy'>
                        <van-button block :disabled='buy.loading || product.tradeEnable === 2' :loading='buy.loading' size='normal' @click='submitHandler("buy")'>
                            {{ $t('trade.buyText') }}
                        </van-button>
                    </div>
                </div> -->
            </el-tab-pane>
            <el-tab-pane :label="$t('trade.sell')" name='sell' />
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, inject } from 'vue'
import { useStore } from 'vuex'
</script>

<style lang='scss' scoped>
.spot-trade {
    .trade-header {
        display: flex;
        font-size: 14px;
        color: var(--color);
        span {
            display: inline-flex;
            justify-content: center;
            flex: 1;
        }
    }
    &:deep {
        .el-tabs {
            padding: 0 20px;
        }
        .el-tabs__header {
            margin: 0;
        }
        .el-tabs__nav {
            display: flex;
            width: 100%;
            height: 40px;
        }
        .el-tabs__nav-wrap::after {
            display: none;
        }
        .el-tabs__active-bar {
            height: 2px;
        }
        .el-tabs__item {
            flex: 1;
            font-size: 20px;
            color: var(--color);
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-weight: bold;
            &.is-active {
                color: var(--primary);
            }
        }
        .el-tabs__active-bar {
            background-color: var(--primary);
        }
    }
}
.form-item{
    color: var(--minorColor);
    height: 40px;
    background: var(--assistColor);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    padding: 10px 14px;
    margin-bottom: 16px;
    label{
        margin-right: 9px;
        color: var(--normalColor);
        .minor{
            color: var(--minorColor);
        }
    }
    &.disable{
        background-color: var(--lineColor);
    }
}
.footerBtn {
    width: 100%;
    background: var(--contentColor);
    height: 40px;
    border-radius: 4px;
    font-weight: bold;
    margin-bottom: 5px;
    &:hover{
        opacity: 0.7;
    }
    &.buy {
        .van-button {
            color: #FFF;
            background: var(--riseColor);
            border-color: var(--riseColor);
            border-radius: 4px;
        }
    }
    &.sell {
        .van-button {
            color: #FFF;
            background: var(--fallColor);
            border-color: var(--fallColor);
            border-radius: 4px;
        }
    }
}
</style>
