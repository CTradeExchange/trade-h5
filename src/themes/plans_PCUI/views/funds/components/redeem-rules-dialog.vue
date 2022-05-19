<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundInfo.redeemRules')"
            width='520px'
        >
            <div class='rules-info'>
                <div class='tDate'>
                    <div class='start'>
                        <p>{{ $t('fundInfo.tDate') }}</p>
                        <p>{{ $t('fundInfo.redeemSubmit') }}</p>
                    </div>
                    <div class='center'>
                        <p>{{ $t('fundInfo.tDate') }}+1</p>
                    </div>
                    <div class='end'>
                        <p>{{ $t('fundInfo.tDate') }}+2</p>
                        <p>{{ $t('fundInfo.fundArrive') }}</p>
                    </div>
                </div>
                <div class='list'>
                    <p class='row'>
                        <span class='no'>
                            1
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip1') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            2
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip2') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            3
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.redeem_tip3') }}
                        </span>
                    </p>

                    <p class='row'>
                        <span class='no'>
                            4
                        </span>
                        <span class='value'>
                            赎回USDT时将会扣除USDT手续费，赎回一篮子资产时，会根据比例在每一项资产中扣除手续费
                        </span>
                    </p>
                </div>
                <div class='block'>
                    <p class='title'>
                        {{ $t('fundInfo.jz_formula') }}
                    </p>
                    <p class='text'>
                        1、{{ $t('fundInfo.jz_formulaContent') }}
                    </p>
                    <p class='text'>
                        2、 赎回USDT的计算：
                    </p>
                    <p class='text indent'>
                        收到的USDT=赎回份额*基金净值*（1-手续费率%）
                    </p>
                    <p class='text'>
                        3、赎回一篮子资产的计算：
                    </p>
                    <p class='text indent'>
                        获得多少资产1：

                        资产1=投资构成1/基金份额*赎回份额*（1-手续费率%）
                    </p>
                    <p class='text indent'>
                        获得多少资产2：
                    </p>
                    <p class='text indent'>
                        资产2=投资构成2/基金份额*申购份额*（1-手续费率%）
                    </p>
                    <p class='text indent'>
                        ...
                    </p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
// 是否显示弹窗
const show = ref(false)

// 打开弹窗
const open = () => {
    show.value = true
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.rules-info {
    .row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .no {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-right: 5px;
            color: #FFF;
            line-height: 1;
            background: var(--primary);
            border-radius: 50%;
        }
        .value {
            line-height: 18px;
        }
    }
    .block {
        margin-top: 20px;
        .title {
            color: var(--color);
            font-size: 20px;
        }
        .text {
            margin-top: rem(20px);
            &.indent {
                padding-left: 22px;
            }
        }
    }
    .tDate {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding-top: 15px;
        padding-bottom: rem(30px);
        &::before {
            position: absolute;
            top: 5px;
            right: 15px;
            left: 15px;
            height: 1px;
            background: var(--primary);
            content: '';
        }
        .end {
            text-align: right;
        }
        .start,
        .center,
        .end {
            position: relative;
            &::before {
                position: absolute;
                top: -14px;
                left: 10px;
                width: 5px;
                height: 5px;
                background: var(--contentColor);
                border: 2px solid var(--primary);
                border-radius: 100%;
                content: '';
            }
        }
        .end {
            &::before {
                right: 10px;
                left: initial;
            }
        }
    }
}
</style>
