<template>
    <router-view />
    <div class='page-wrap'>
        <el-form
            ref='formRef'
            v-loading='loading'
            label-position='top'
            label-width='auto'
            :model='form'
            :rules='rules'
            size='default'
        >
            <h2>企业KYC认证</h2>
            <el-form-item label='您当前所在国家/地区' prop='selectCountry'>
                <el-select
                    v-model='form.selectCountry'
                    placeholder='请选择您当前所在国家/地区'
                >
                    <el-option
                        v-for='item in countryList'
                        :key='item.countryCode'
                        :label='item.name'
                        :value='item.countryCode'
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label='企业类型'
                prop='selectCompanyType'
            >
                <el-select
                    v-model='form.selectCompanyType'
                    placeholder='请选择企业类型'
                >
                    <el-option v-for='item in businessType' :key='item.code' :label='item.displayName' :value='item.code' />
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
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { upload, getListByParentCode } from '@/api/base'
import { findAllLevelKyc, kycLevelApply, kycApply, findAllBizKycList } from '@/api/user'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { levelCode } = route.query

const businessType = ref([])
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
    selectCompanyType: '',
    selectCountry: ''
})

const rules = reactive({
    selectCountry: [
        { required: true, message: '请选择您当前所在国家/地区', trigger: 'blur' }
    ],
    selectCompanyType: [
        { required: true, message: '请选择企业类型', trigger: 'blur' }
    ]
})

// const getAllLevel = ()=>{
//     findAllBizKycList()
// }

// const onSubmit = () => {
// const params = {
//     businessCode: props.businessCode,
//     elementList: tempElementList,
//     openAccountType: 1
// }
// state.loading = true
// kycApply(params).then(res => {
//     state.loading = false
//     if (res.check()) {
//         if (props.platform === 'web') {
//             const parentPath = route.matched[route.matched.length - 2]
//             router.push({ path: parentPath.path + '/kycCommitted' })
//         } else {
//             router.replace({ name: 'KycCommitted' })
//         }
//         sessionStorage.removeItem('kycList')
//     }
// }).catch(err => {
//     state.loading = false
//     console.log(err)
// })

// router.push('/businessKYC/content')
// }

// 根据 levelCode 查询kyc认证元素
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            loading.value = true

            findAllLevelKyc({
                levelCode,
                selectCountry: form.selectCountry,
                selectCompanyType: form.selectCompanyType,
                openAccountType: 1
            }).then(res => {
                loading.value = false
                if (res.check()) {
                    if (res.data.length > 0) {
                        const elementList = res.data[0]?.elementList
                        const elementCode = elementList?.map(el => el.elementCode)
                        router.push({
                            path: '/businessKYC/content',
                            query: {
                                elementCode: elementCode.join(),
                                levelCode,
                                selectCountry: form.selectCountry,
                                selectCompanyType: form.selectCompanyType
                            }
                        })
                    }
                }
            }).catch(err => {
                loading.value = false
            })
        } else {
            console.log('error submit')
            return false
        }
    })
}

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

const getBusinessType = () => {
    getListByParentCode({ parentCode: 'EnterpriseType' }).then(res => {
        if (res.check()) {
            businessType.value = res.data
        }
    }).catch(res => {

    })
}
// 获取企业类型
getBusinessType()

// 获取国家列表
store.dispatch('getCountryListByParentCode')

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
        h2 {
            margin-bottom: rem(50px);
        }
    }
}
</style>
