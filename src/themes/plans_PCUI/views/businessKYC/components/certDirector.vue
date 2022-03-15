<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :size='size'
    >
        <div v-for='(item,index) in form.list' :key='index' v-loading='loading' class='director'>
            <div class='head'>
                <h3>董事{{ index+1 }}</h3>
                <el-button v-if='index>0' size='small' @click='deleteItem(index)'>
                    删&nbsp;除
                </el-button>
            </div>
            <p class='title'>
                基础信息
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        label='名字'
                        :prop='"list."+index+".lastname"'
                        :rules="{
                            required: true,
                            message: '请输入名字',
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model='item.lastname' type='text' />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        label='姓名'
                        :prop='"list."+index+".firstName"'
                        :rules="{
                            required: true,
                            message: '请输入姓名',
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model='item.firstName' />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        label='出生日期'
                        :prop='"list."+index+".birthDay"'
                        :rules="{
                            required: true,
                            message: '请输入出生日期',
                            trigger: 'change',
                        }"
                    >
                        <el-date-picker
                            v-model='item.birthDay'
                            placeholder='请选择出生日期'
                            style='width: 100%;'
                            type='date'
                        />
                    </el-form-item>
                </el-col>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        label='国家/地区'
                        :prop='"list."+index+".address"'
                        :rules="{
                            required: true,
                            message: '请选择国家/地区',
                            trigger: 'change',
                        }"
                    >
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
                    <el-form-item
                        label='邮箱'
                        :prop='"list."+index+".email"'
                        :rules="[{
                                     required: true,
                                     message: '请输入邮箱',
                                     trigger: 'blur',
                                 },
                                 {
                                     type: 'email',
                                     message: '请输入正确的邮箱',
                                     trigger: ['blur', 'change'],
                                 },]"
                    >
                        <el-input v-model='item.email' />
                    </el-form-item>
                </el-col>
            </el-row>
            <p class='title'>
                上传身份证明文件
            </p>
            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        label='证件类型'
                        :prop='"list."+index+".idType"'
                        :rules="{
                            required: true,
                            message: '请选择证件类型',
                            trigger: 'change',
                        }"
                    >
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
                    <el-form-item
                        label='证件号'
                        :prop='"list."+index+".idNo"'
                        :rules="{
                            required: true,
                            message: '请输入证件号',
                            trigger: 'blur',
                        }"
                    >
                        <el-input v-model='item.idNo' />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter='20'>
                <el-col :offset='0' :span='12'>
                    <el-form-item
                        label='证件签发国家/地区'
                        :prop='"list."+index+".issued"'
                        :rules="{
                            required: true,
                            message: '请选择证件签发国家/地区',
                            trigger: 'change',
                        }"
                    >
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
                    <el-form-item
                        label='证件文件'
                        :prop='"list."+index+".documents"'
                        :rules="{
                            required: true,
                            message: '请上传证件文件',
                            trigger: 'blur',
                        }"
                    >
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
                    <el-form-item
                        label='个人肖像照'
                        :prop='"list."+index+".photo"'
                        :rules="{
                            required: true,
                            message: '请上传个人肖像照',
                            trigger: 'blur',
                        }"
                    >
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
        <el-row :gutter='20'>
            <el-col :offset='0' :span='24'>
                <div class='add' @click='add'>
                    <i class='el-icon-plus'></i>
                    添加董事
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script >
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { ElIcon, ElMessage } from 'element-plus'
import { upload, getListByParentCode, getCountryListByParentCode } from '@/api/base'
export default {
    props: {
        formData: {
            type: Object,
            require: true
        }
    },
    setup (props, context) {
        const store = useStore()
        const formRef = ref(null)
        const state = reactive({
            countryList: [],
            form: {
                list: [
                    {
                        lastname: '',
                        firstName: '',
                        birthDay: '',
                        address: '',
                        email: '',
                        idType: '',
                        idNo: '',
                        issued: '',
                        documents: '',
                        photo: ''
                    }
                ]
            },
            idCardType: [],
            loading: false,
        })

        watch(
            () => props.formData, (val) => {
                if (val) {
                    const elementValue = val.find(el => el.elementCode === 'company_auth_director')?.elementValue
                    if (elementValue) { state.form = JSON.parse(elementValue) }
                }
            }, {
                immediate: true
            }
        )

        // 获取国家列表
        const getAllCountry = () => {
            getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    if (res.data.length > 0) {
                        const tempArr = []
                        res.data.forEach(item => {
                            const lable = item.name + ' (' + item.countryCode + ')'
                            const value = item.countryCode
                            tempArr.push({
                                name: lable,
                                code: value,
                                countryCode: item.code,
                                countryName: item.name,
                            })
                        })
                        state.countryList = tempArr
                    }
                }
            })
        }

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

        const deleteItem = (index) => {
            state.form.list.splice(index, 1)
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
                    state.form.list[param[0]][param[1]] = res.data
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

        // 获取证件类型
        const getIdCardType = () => {
            getListByParentCode({ parentCode: 'id_card_type' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    state.idCardType = res.data
                }
            }).catch(res => {

            })
        }

        getIdCardType()
        // 获取国家列表
        getAllCountry()

        return {
            add,
            afterRead,
            formRef,
            deleteItem,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
.add {
    width: 100%;
    margin-top: 30px;
    color: #666;
    font-weight: bold;
    line-height: rem(100px);
    text-align: center;
    background: var(--bgColor);
    cursor: pointer;
}
</style>
