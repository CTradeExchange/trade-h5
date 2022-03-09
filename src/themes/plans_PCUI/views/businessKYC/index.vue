<template>
    <div class='page-wrap'>
        <el-form
            ref='form'
            label-position='top'
            label-width='auto'
            :model='sizeForm'
            :size='size'
        >
            <el-form-item label='您当前所在国家/地区'>
                <el-select
                    v-model='sizeForm.region'
                    placeholder='please select your zone'
                >
                    <el-option label='Zone one' value='shanghai' />
                    <el-option label='Zone two' value='beijing' />
                </el-select>
            </el-form-item>
            <el-form-item
                label='企业类型'
            >
                <el-select
                    v-model='sizeForm.region'
                    placeholder='please select your zone'
                >
                    <el-option label='Zone one' value='shanghai' />
                    <el-option label='Zone two' value='beijing' />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='onSubmit'>
                    下一步
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const size = ref('default')

const sizeForm = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

function onSubmit () {
    router.push('/businessKYC/content')
    console.log('submit!')
}
</script>

<style lang="scss" scoped>
.page-wrap {
    width: 1200px;
    margin: 0 auto;
    background: var(--contentColor);
    .el-form {
        margin: rem(50px);
        padding: rem(100px);
        border-radius: rem(10px);
        .el-select {
            width: 100%;
        }
    }
}
</style>
