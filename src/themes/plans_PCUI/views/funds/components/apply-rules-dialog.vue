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
                        2、{{ $t('fundInfo.fundRedeemFormula4') }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula5') }}
                    </p>
                    <p class='text'>
                        3、{{ $t('fundInfo.fundRedeemFormula6') }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula7',{ number: 1 }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula8',{ number: 1 }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula7',{ number: 2 }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula8',{ number: 2 }) }}
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
