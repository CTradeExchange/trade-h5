<template>
    <div class='page-wrap'>
        <el-steps :active='active' finish-status='success'>
            <el-step title='Step 1' />
            <el-step title='Step 2' />
            <el-step title='Step 3' />
        </el-steps>

        <el-form
            ref='form'
            label-position='top'
            label-width='auto'
            :model='form'
            :size='size'
        >
            <p class='title'>
                账户信息
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='公司名称'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='注册号'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='成立日期'>
                        <el-date-picker
                            v-model='form.date1'
                            placeholder='Pick a date'
                            style='width: 100%;'
                            type='date'
                        />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='联系电话'>
                        <el-row :gutter='20'>
                            <el-col :span='6'>
                                <el-select
                                    v-model='form.phone'
                                    placeholder='please select your zone'
                                >
                                    <el-option label='Zone one' value='shanghai' />
                                    <el-option label='Zone two' value='beijing' />
                                </el-select>
                            </el-col>
                            <el-col :span='18'>
                                <el-input v-model='form.name' />
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='资金来源'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='业务性质'>
                        <el-select
                            v-model='form.phone'
                            placeholder='please select your zone'
                        >
                            <el-option label='Zone one' value='shanghai' />
                            <el-option label='Zone two' value='beijing' />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='申请原因'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- <el-form-item
                label='企业类型'
            >
                <el-select
                    v-model='form.types'
                    placeholder='please select your zone'
                >
                    <el-option label='Zone one' value='shanghai' />
                    <el-option label='Zone two' value='beijing' />
                </el-select>
            </el-form-item>-->
            <p class='title'>
                注册地址
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='国家/地区'>
                        <el-select
                            v-model='form.phone'
                            placeholder='please select your zone'
                        >
                            <el-option label='Zone one' value='shanghai' />
                            <el-option label='Zone two' value='beijing' />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='城市'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='街道地址'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>

            <p class='title'>
                商务运营地址
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='国家/地区'>
                        <el-select
                            v-model='form.phone'
                            placeholder='please select your zone'
                        >
                            <el-option label='Zone one' value='shanghai' />
                            <el-option label='Zone two' value='beijing' />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='城市'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='街道地址'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='邮政编码'>
                        <el-input v-model='form.name' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item>
                <el-button style='margin-top: 12px;' @click='prev'>
                    上一步
                </el-button>
                <el-button style='margin-top: 12px;' @click='next'>
                    下一步
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const size = ref('default')
const active = ref(0)
const form = reactive({
    name: '',
    region: '',
    date1: '',
    phone: '',
    types: ''
})

const next = () => {
    if (active.value++ > 2) active.value = 0
}

</script>

<style lang="scss" scoped>
.page-wrap {
    width: 1200px;
    margin: rem(50px) auto;
    padding-top: rem(50px);
    background: var(--contentColor);
    .el-steps {
        margin: rem(100px) rem(100px) 0 rem(100px);
    }
    .title {
        margin: rem(50px) 0 0 0;
        padding: rem(40px) 0;
        font-weight: bold;
    }
    .el-form {
        margin: 0 rem(20px) rem(20px) rem(20px);
        padding: 0  rem(100px)  rem(100px) rem(100px);
        border-radius: rem(10px);
        .el-select {
            width: 100%;
        }
    }
}
</style>
