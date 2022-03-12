<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :size='size'
    >
        <div v-for='(item,index) in form.list' :key='index' v-loading='loading' class='director'>
            <h3>账户持有人/交易员{{ index+1 }}</h3>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    主要验证人&nbsp;&nbsp;<el-switch
                        v-model='item.main'
                    />
                </el-col>
            </el-row>
            <p class='title'>
                基础信息
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='名字'>
                        <el-input v-model='item.lastname' type='text' />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='姓名'>
                        <el-input v-model='item.firstName' />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='出生日期'>
                        <el-date-picker
                            v-model='item.birthDay'
                            placeholder='请选择出生日期'
                            style='width: 100%;'
                            type='date'
                        />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='国家/地区'>
                        <el-select
                            v-model='item.address'
                            placeholder='请选择国家/地区'
                        >
                            <el-option
                                v-for='country in countryList'
                                :key='country.countryCode'
                                :label='country.name'
                                :value='country.countryCode'
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='邮箱'>
                        <el-input v-model='item.email' />
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
                            v-model='item.idType'
                            placeholder='请选择证件类型'
                        >
                            <el-option
                                v-for='ict in idCardType'
                                :key='ict.code'
                                :label='ict.displayName'
                                :value='ict.code'
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='证件号'>
                        <el-input v-model='item.idNo' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='证件签发国家/地区'>
                        <el-select
                            v-model='item.issued'
                            placeholder='请选择证件签发国家/地区'
                        >
                            <el-option
                                v-for='country in countryList'
                                :key='country.countryCode'
                                :label='country.name'
                                :value='country.countryCode'
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='证件文件'>
                        <van-uploader :after-read='afterRead' :name="index+',documents'" result-type='file'>
                            <div class='uploader'>
                                <img class='icon-upload' src='/images/upload.png' srcset='' />
                                <p class='upload-tip'>
                                    点击上传
                                </p>
                            </div>
                        </van-uploader>
                        <a class='link' :href='item.documents' target='_blank'>
                            {{ item.documents }}
                        </a>
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='个人肖像照'>
                        <van-uploader :after-read='afterRead' :name="index+',photo'" result-type='file'>
                            <div class='uploader'>
                                <img class='icon-upload' src='/images/upload.png' srcset='' />
                                <p class='upload-tip'>
                                    点击上传
                                </p>
                            </div>
                        </van-uploader>
                        <a class='link' :href='item.photo' target='_blank'>
                            {{ item.photo }}
                        </a>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <template v-if='accountHoldVis || mainAccountVis'>
            <p class='title'>
                账户持有人/交易员身份认证
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item label='手持证件照'>
                        <van-uploader :after-read='afterRead' name='form,mainAccount' result-type='file'>
                            <div class='uploader'>
                                <img class='icon-upload' src='/images/upload.png' srcset='' />
                                <p class='upload-tip'>
                                    点击上传
                                </p>
                            </div>
                        </van-uploader>
                        <a class='link' :href='form.mainAccount' target='_blank'>
                            {{ form.mainAccount }}
                        </a>
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

import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { ElIcon, ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { upload, getListByParentCode } from '@/api/base'

export default {
    components: {

    },
    props: {
        dialogVis: {
            type: Boolean
        },
        formData: {
            type: Object,
            require: true
        }
    },
    emits: ['update:dialogVis'],
    setup (props, context) {
        const store = useStore()
        const formRef = ref(null)
        const state = reactive({
            form: {
                list: [{
                    main: false,
                    lastname: '',
                    firstName: '',
                    birthDay: '',
                    address: '',
                    email: '',
                    idType: '',
                    idNo: '',
                    issued: ''
                }],
                mainAccount: ''
            },
            accountHoldVis: false,
            idCardType: [],
            loading: false

        })

        watch(
            () => props.formData, (val) => {
                if (val) {
                    const elementValue = val.find(el => el.elementCode === 'company_account_owner')?.elementValue
                    if (elementValue) { state.form = JSON.parse(elementValue) }
                }
            }, {
                immediate: true
            }
        )

        const add = () => {
            state.form.list.push({
                lastname: '',
                firstName: '',
                birthDay: '',
                address: '',
                email: '',
                idType: '',
                idNo: '',
                issued: ''
            })
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

        const mainAccountVis = computed(() => {
            // 判断“账户持有人步骤”的主账户持有人是否有值
            const jsonStr = props.formData?.find(el => el.elementCode === 'company_account_owner')?.elementValue
            let mainAccount
            if (jsonStr) {
                mainAccount = JSON.parse(jsonStr)?.mainAccount
            }
            return mainAccount
        })

        // 获取国家列表
        const countryList = computed(() => {
            const countryList = store.state.countryList || []
            const tempArr = []

            countryList.forEach(item => {
                const lable = item.name + ' (' + item.countryCode + ')'
                const value = item.countryCode
                tempArr.push({
                    name: lable,
                    code: value,
                    countryCode: item.code,
                    countryName: item.name,
                })
            })
            return tempArr
        })

        // 获取证件类型
        const getIdCardType = () => {
            getListByParentCode({ parentCode: 'id_card_type' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    state.idCardType = res.data
                }
            }).catch(res => {

            })
        }

        // 上传图片
        const afterRead = (file, detail) => {
            state.loading = true
            const formData = new FormData()
            formData.append('object', file.file)
            upload(
                formData
            ).then(res => {
                state.loading = false
                if (res.check()) {
                    const param = detail.name.split(',')
                    if (param[0] === 'form') {
                        state.form[param[1]] = res.data
                    } else {
                        state.form.list[param[0]][param[1]] = res.data
                    }

                    ElMessage({
                        message: '上传成功',
                        type: 'success',
                    })
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        getIdCardType()
        // 获取国家列表
        store.dispatch('getCountryListByParentCode')

        return {
            add,
            onClose,
            countryList,
            onConfirm,
            afterRead,
            formRef,
            mainAccountVis,
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
