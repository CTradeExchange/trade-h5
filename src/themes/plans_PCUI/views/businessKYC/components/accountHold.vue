<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :size='size'
    >
        <div v-for='(item,index) in list' :key='index' class='director'>
            <h3>账户持有人/交易员{{ index+1 }}</h3>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    主要验证人&nbsp;&nbsp;<el-switch
                        v-model='form.main'
                    />
                </el-col>
            </el-row>
            <p class='title'>
                基础信息
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='名字'>
                        <el-input v-model='form.lastname' type='text' />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='姓名'>
                        <el-input v-model='form.firstName' />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='出生日期'>
                        <el-date-picker
                            v-model='form.birthDay'
                            placeholder='Pick a date'
                            style='width: 100%;'
                            type='date'
                        />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='国家/地区'>
                        <el-select
                            v-model='form.address'
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
                    <el-form-item label='邮箱'>
                        <el-input v-model='form.email' />
                    </el-form-item>
                </el-col>
            </el-row>
            <p class='title'>
                上传身份证明文件
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='证件类型'>
                        <el-select
                            v-model='form.idType'
                            placeholder='please select your zone'
                        >
                            <el-option label='Zone one' value='shanghai' />
                            <el-option label='Zone two' value='beijing' />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='证件号'>
                        <el-input v-model='form.idNo' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='证件签发国家/地区'>
                        <el-select
                            v-model='form.issued'
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
                    <el-form-item label='证件文件'>
                        <el-upload
                            action=''
                            class='upload-demo'
                            drag
                            multiple
                        >
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <upload-filled />
                            <div class='el-upload__text'>
                                拖动文件或 <em>点击上传</em>
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='个人肖像照'>
                        <el-upload
                            action=''
                            class='upload-demo'
                            drag
                            multiple
                        >
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <upload-filled />
                            <div class='el-upload__text'>
                                拖动文件或 <em>点击上传</em>
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <template v-if='accountHoldVis'>
            <p class='title'>
                账户持有人/交易员身份认证
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='手持证件照'>
                        <el-upload
                            action=''
                            class='upload-demo'
                            drag
                            multiple
                        >
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <upload-filled />
                            <div class='el-upload__text'>
                                拖动文件或 <em>点击上传</em>
                            </div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </template>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='24'>
                <div class='add' @click='add'>
                    <i class='el-icon-plus'></i>
                    添加账户持有人/交易员
                </div>
            </el-col>
        </el-row>
    </el-form>

    <el-dialog
        v-model='dialogVis'
        :before-close='handleClose'
        title='需要主账户持有人/交易员进行身份验证'
        width='30%'
    >
        <span>进行身份验证之前，请确保您是主要的账户持有人/交易员</span>
        <template #footer>
            <span class='dialog-footer'>
                <el-button @click='onClose'>
                    我再想想
                </el-button>
                <el-button
                    type='primary'
                    @click='onConfirm'
                >
                    我是主要账户持有人/交易员
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

import { reactive, ref, toRefs, watch } from 'vue'
import { log } from '@public/libs/adapter-latest'

export default {
    components: {

    },
    props: ['dialogVis'],
    emits: ['update:dialogVis'],
    setup (props, context) {
        const state = reactive({
            form: {
                main: true,
                lastname: '',
                firstName: '',
                birthDay: '',
                address: '',
                email: '',
                idType: '',
                idNo: '',
                issued: ''
            },
            list: [],
            accountHoldVis: false

        })

        state.list.push(state.form)
        const add = () => {
            state.list.push(state.form)
        }

        const onClose = () => {
            // 参数： [弹窗状态,点击状态 ]
            context.emit('update:dialogVis', [false, false])
        }

        const onConfirm = () => {
            // 参数： [弹窗状态,点击状态 ]
            context.emit('update:dialogVis', [false, true])
            state.accountHoldVis = true
        }

        return {
            add,
            onClose,
            onConfirm,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
.add {
    width: 100%;
    color: #666;
    font-weight: bold;
    line-height: rem(100px);
    text-align: center;
    background: var(--bgColor);
    cursor: pointer;
}
</style>
