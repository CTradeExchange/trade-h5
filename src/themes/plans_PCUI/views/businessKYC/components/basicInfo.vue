<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :rules='rules'
        :size='size'
    >
        <h4 class='tip'>
            请准确填写公司注册证书上的公司名称和公司注册号
        </h4>
        <p class='title'>
            账户信息
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='公司名称' prop='accountInfo.companyName'>
                    <el-input v-model='form.accountInfo.companyName' />
                </el-form-item>
            </el-col>
            <el-col :offset='0' prop='regNo' :span='12'>
                <el-form-item label='注册号' prop='accountInfo.regNo'>
                    <el-input v-model='form.accountInfo.regNo' />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='成立日期' prop='accountInfo.createTime'>
                    <el-date-picker
                        v-model='form.accountInfo.createTime'
                        placeholder='请选择成立日期'
                        style='width: 100%;'
                        type='date'
                    />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-row :gutter='20'>
                    <el-col :span='10'>
                        <el-form-item label='区号' prop='accountInfo.area'>
                            <el-select
                                v-model='form.accountInfo.area'
                                placeholder='请选择区号'
                            >
                                <el-option
                                    v-for='item in countryList'
                                    :key='item.countryCode'
                                    :label='item.name'
                                    :value='item.countryCode'
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col prop='phone' :span='14'>
                        <el-form-item label='联系电话' prop='accountInfo.phone'>
                            <el-input v-model='form.accountInfo.phone' type='number' />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='资金来源' prop='accountInfo.resource'>
                    <el-input v-model='form.accountInfo.resource' />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='业务性质' prop='accountInfo.nature'>
                    <el-select
                        v-model='form.accountInfo.nature'
                        placeholder='请选择业务性质'
                    >
                        <el-option v-for='item in businessNature' :key='item.code' :label='item.displayName' :value='item.code' />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='申请原因' prop='accountInfo.reason'>
                    <el-input v-model='form.accountInfo.reason' type='textarea' />
                </el-form-item>
            </el-col>
        </el-row>
        <p class='title'>
            注册地址
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='国家/地区' prop='regAddress.regCountry'>
                    <el-select
                        v-model='form.regAddress.regCountry'
                        placeholder='请选择国家/地区'
                    >
                        <el-option
                            v-for='item in countryList'
                            :key='item.countryCode'
                            :label='item.name'
                            :value='item.countryCode'
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='城市' prop='regAddress.regCity'>
                    <el-input v-model='form.regAddress.regCity' />
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='街道地址' prop='regAddress.regStreet'>
                    <el-input v-model='form.regAddress.regStreet' />
                </el-form-item>
            </el-col>
        </el-row>

        <p class='title'>
            商务运营地址
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='国家/地区' prop='opertion.opertionCountry'>
                    <el-select
                        v-model='form.opertion.opertionCountry'
                        placeholder='请选择国家/地区'
                    >
                        <el-option
                            v-for='item in countryList'
                            :key='item.countryCode'
                            :label='item.name'
                            :value='item.countryCode'
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='城市' prop='opertion.opertionCity'>
                    <el-input v-model='form.opertion.opertionCity' />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='街道地址' prop='opertion.opertionStreet'>
                    <el-input v-model='form.opertion.opertionStreet' />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
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

        const businessNature = ref([])
        const formRef = ref(null)
        const state = reactive({
            form: {
                accountInfo: {
                    companyName: '',
                    regNo: '',
                    createTime: '',
                    area: '',
                    phone: '',
                    resource: '',
                    nature: '',
                    reason: '',
                },
                regAddress: {
                    regCountry: '',
                    regCity: '',
                    regStreet: '',
                },
                opertion: {
                    opertionCountry: '',
                    opertionCity: '',
                    opertionStreet: ''
                }
            },
            countryList: [],
            rules: {
                accountInfo: {
                    companyName: [
                        { type: 'string', required: true, message: '请输入公司名称', trigger: 'blur' },

                    ],
                    regNo: [
                        { required: true, message: '请输入注册号', trigger: 'blur' },

                    ],
                    createTime: [
                        { required: true, message: '请输入成立日期', trigger: 'change' },

                    ],
                    area: [
                        { required: true, message: '请选择区号', trigger: 'change' },

                    ],
                    phone: [
                        { required: true, message: '请输入联系电话', trigger: 'blur' },
                    ],
                    resource: [
                        { required: true, message: '请输入资金来源', trigger: 'blur' },

                    ],
                    nature: [
                        { required: true, message: '请选择业务性质', trigger: 'change' },

                    ],
                    reason: [
                        { required: true, message: '请输入申请原因', trigger: 'blur' },

                    ],
                },
                regAddress: {
                    regCountry: [
                        { required: true, message: '请选择国家/地区', trigger: 'change' },

                    ],
                    regCity: [
                        { required: true, message: '请输入城市', trigger: 'blur' },

                    ],
                    regStreet: [
                        { required: true, message: '请输入街道地址', trigger: 'blur' },

                    ],
                },
                opertion: {
                    opertionCountry: [
                        { required: true, message: '请选择国家/地区', trigger: 'change' },

                    ],
                    opertionCity: [
                        { required: true, message: '请输入城市', trigger: 'blur' },

                    ],
                    opertionStreet: [
                        { required: true, message: '请输入街道地址', trigger: 'blur' },

                    ]
                }

            }
            // rules: {
            //     accountInfo: {
            //         type: 'object',
            //         required: true,
            //         fields: {
            //             companyName: [
            //                 { type: 'string', required: true, message: '请输入公司名称', trigger: 'blur' },

            //             ],
            //
            //         }

            //     }
            // }
        })

        watch(
            () => props.formData, (val) => {
                if (val) {
                    const elementValue = val.find(el => el.elementCode === 'company_basic_info')?.elementValue
                    if (elementValue) { state.form = JSON.parse(elementValue) }
                }
            }, {
                immediate: true
            }
        )

        // 获取业务性质
        const getBusinessNature = () => {
            getListByParentCode({ parentCode: 'Business_Nature' }).then(res => {
                if (res.check()) {
                    businessNature.value = res.data
                }
            }).catch(res => {

            })
        }

        const getAllCountry = () => {
            getCountryListByParentCode({ parentCode: '-1' }).then(res => {
                if (res.check()) {
                    if (res.data.length > 0) {
                        const tempArr = []
                        res.data.forEach(item => {
                            const lable = item.name + ' (' + item.countryCode + ')'
                            const value = item.countryCode
                            if (item.code !== 'other') {
                                tempArr.push({
                                    name: lable,
                                    code: value,
                                    countryCode: item.code,
                                    countryName: item.name,
                                })
                            }
                        })
                        state.countryList = tempArr
                    }
                }
            })
        }

        getBusinessNature()

        // 获取国家列表
        getAllCountry()

        return {
            ...toRefs(state),
            businessNature,
            formRef
        }
    }
}

</script>
