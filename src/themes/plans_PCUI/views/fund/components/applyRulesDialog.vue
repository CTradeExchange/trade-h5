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
                            {{ $t('fundInfo.applyRule_tip3') }}
                        </span>
                    </p>
                </div>
                <div class='block'>
                    <p>{{ $t('fundInfo.jz_formula') }}</p>
                    <p>{{ $t('fundInfo.jz_formulaContent') }}</p>
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
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            width: 20px;
            height: 20px;
            line-height: 1;
            margin-right: 5px;
            color: #fff;
            background: var(--primary);
            border-radius: 50%;
        }
        .value {

        }
    }
}
</style>
