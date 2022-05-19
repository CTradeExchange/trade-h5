<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            :title="$t('fundInfo.applyRules')"
            width='520px'
        >
            <div class='rules-info'>
                <div class='list'>
                    <p class='row'>
                        <span class='no'>
                            1
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip1') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            2
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip2') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            3
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip4') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            4
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip3') }}
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
                        2、使用USDT申购，支付费用计算：
                    </p>
                    <p class='text indent'>
                        申购支付费用=申购份额*基金净值*（1+手续费率）
                    </p>
                    <p class='text'>
                        3、使用一篮子资产申购，支付费用计算：
                    </p>
                    <p class='text indent'>
                        资产1支付费用：

                        资产1=投资构成1/基金份额*申购份额*（1+手续费率）
                    </p>
                    <p class='text indent'>
                        资产2支付费用：

                        资产2=投资构成2/基金份额*申购份额*（1+手续费率）
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
}
</style>
