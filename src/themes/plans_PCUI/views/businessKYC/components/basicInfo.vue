<template>
    <el-form
        ref='formRef'
        label-position='top'
        label-width='auto'
        :model='form'
        :rules='rules'
        :size='size'
    >
        <p class='title'>
            账户信息
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='公司名称'>
                    <el-input v-model='form.accountInfo.companyName' />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='注册号'>
                    <el-input v-model='form.accountInfo.regNo' />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='成立日期'>
                    <el-date-picker
                        v-model='form.accountInfo.createTime'
                        placeholder='请选择成立日期'
                        style='width: 100%;'
                        type='date'
                    />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='联系电话'>
                    <el-row :gutter='20'>
                        <el-col :span='10'>
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
                        </el-col>
                        <el-col :span='14'>
                            <el-input v-model='form.accountInfo.phone' type='number' />
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='资金来源'>
                    <el-input v-model='form.accountInfo.resource' />
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='业务性质'>
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
                <el-form-item label='申请原因'>
                    <el-input v-model='form.accountInfo.reason' type='textarea' />
                </el-form-item>
            </el-col>
        </el-row>
        <p class='title'>
            注册地址
        </p>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='国家/地区'>
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
                <el-form-item label='城市'>
                    <el-input v-model='form.regAddress.regCity' />
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='街道地址'>
                    <el-input v-model='form.regAddress.regStreet' />
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
                <el-form-item label='城市'>
                    <el-input v-model='form.opertion.opertionCity' />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='街道地址'>
                    <el-input v-model='form.opertion.opertionStreet' />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { upload, getListByParentCode } from '@/api/base'

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
            }
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

        // 表单验证
        const rules = reactive({
            companyName: [
                { required: true, message: 'Please input Activity name', trigger: 'blur' },

            ],
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

        // 获取业务性质
        const getBusinessNature = () => {
            getListByParentCode({ parentCode: 'Business_Nature' }).then(res => {
                if (res.check()) {
                    businessNature.value = res.data
                }
            }).catch(res => {

            })
        }
        getBusinessNature()
        // 获取国家列表
        store.dispatch('getCountryListByParentCode')

        return {
            ...toRefs(state),
            businessNature,
            countryList,
            rules,
            formRef
        }
    }
}

</script>

<style lang="scss" scoped>

</style>
