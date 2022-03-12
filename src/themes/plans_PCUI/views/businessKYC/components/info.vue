<template>
    <div class='info'>
        <h2>信息确认</h2>
        <div class='content'>
            <strong>声明</strong>
            <p>在提交上述资料及文件时，我完全理解并代表公司确认:</p>

            <p>1、我/我们有充分的权力开设维他命企业账户，并代表申请公司签署相关条款和协议。</p>

            <p>2、我/我们已阅读、理解并同意受维他命发布的适用条款和条件的约束，包括但不限于合约服务约定条款及细则和隐私政策。</p>

            <p>3、我/我们了解所提供的申请公司账号信息是直实且完整的。</p>

            <p>4、我/我们会在最少7个工作日内将所提供信息中的任何更改，通知维他命或其关联公司(如适用)。</p>
            <el-checkbox v-model='checked' label='我/我们理解并同意该声明' size='large' @change='onChange' />
        </div>
    </div>
</template>

<script setup >
import { reactive, ref, defineEmits } from 'vue'
const emit = defineEmits()

const checked = ref(false)
const onChange = (val) => {
    emit('update:protocol', val)
}
</script>

<style lang="scss" scoped>
.info {
    h2 {
        text-align: center;
    }
    .content {
        padding: 0 rem(100px);
        p {
            padding: rem(10px) 0;
        }
    }
}
</style>
