<template>
    <div v-loading='loading' class='page-wrap'>
        <el-steps :active='active' align-center finish-status='success'>
            <el-step v-for='item in authList' :key='item' :title='authMap[item]' />
        </el-steps>

        <basicInfo v-if='active === 0' ref='basicInfoRef' :form-data='formData' />
        <uploadFiles v-if='active === 1' ref='uploadFilesRef' :form-data='formData' />
        <certDirector v-if='active === 2' ref='certDirectorRef' :form-data='formData' />
        <beneficiary v-if='active === 3' ref='beneficiaryRef' :form-data='formData' />
        <accountHold v-if='active === 4' ref='accountHoldRef' :dialog-vis='dialogVis' :form-data='formData' @update:dialogVis='updateDialogVis' />
        <info v-if='active === 5' @update:protocol='updateProtocol' />
        <div class='oper-wrap'>
            <el-button v-if='active > 0' style='margin-top: 12px;' @click='prev'>
                上一步
            </el-button>
            <el-button v-if='draftVis' style='margin-top: 12px;' @click='save'>
                保存草稿
            </el-button>
            <el-button :disabled='nextBtnDisabled' style='margin-top: 12px;' type='primary' @click='next'>
                下一步
            </el-button>
        </div>
    </div>
</template>

<script>
import { ElIcon, ElMessage } from 'element-plus'
import { computed, reactive, ref, toRefs, unref } from 'vue'
import basicInfo from './components/basicInfo.vue'
import uploadFiles from './components/uploadFiles.vue'
import certDirector from './components/certDirector.vue'
import beneficiary from './components/beneficiary.vue'
import accountHold from './components/accountHold.vue'
import info from './components/info.vue'
import { useRouter, useRoute } from 'vue-router'

import { findAllLevelKyc, kycLevelApply, kycApply, findAllBizKycList } from '@/api/user'

export default {
    components: {
        basicInfo, uploadFiles, certDirector, beneficiary, accountHold, info
    },
    setup (props, context) {
        const router = useRouter()
        const route = useRoute()

        const basicInfoRef = ref(null)
        const uploadFilesRef = ref(null)
        const certDirectorRef = ref(null)
        const beneficiaryRef = ref(null)
        const accountHoldRef = ref(null)

        // const authMap = [
        //     'company_basic_info', 'company_upload_file', 'company_auth_director', 'company_auth_owner', 'company_account_owner'
        // ]
        const authMap = {
            'company_basic_info': '基础信息', // 企业认证-基础信息
            'company_upload_file': '上传文件', // 企业认证-上传文件
            'company_auth_director': '认证董事', // 企业认证-认证董事
            'company_auth_owner': '认证最终收益拥有人', // 企业认证-认证最终收益拥有人
            'company_account_owner': '账户持有人/交易员', // 企业认证-账户持有人/交易员
        }
        const { elementCode, selectCountry, levelCode, selectCompanyType, index } = route.query

        const state = reactive({
            active: Number(index) || 0,
            dialogVis: false,
            nextBtnDisabled: false,
            draftVis: true,
            accountHoldVis: false, // 用户点击状态，根据此状态判断是否进入下一步
            authList: elementCode.split(','), // 需要认证的步骤
            loading: false,
            formData: [], // 认证表单数据
        })

        // 当前认证code
        const currentCode = computed(() => state.authList[state.active])
        // 当前步骤组件
        const currentComp = computed(() => {
            if (currentCode.value === 'company_basic_info') {
                return basicInfoRef
            } else if (currentCode.value === 'company_upload_file') {
                return uploadFilesRef
            } else if (currentCode.value === 'company_auth_director') {
                return certDirectorRef
            } else if (currentCode.value === 'company_auth_owner') {
                return beneficiaryRef
            } else if (currentCode.value === 'company_account_owner') {
                return accountHoldRef
            }
            return null
        })

        const next = () => {
            if (state.active === 4 && !state.accountHoldVis) {
                state.dialogVis = true
            } else {
                state.active++
            }
            if (state.active === 5) {
                state.nextBtnDisabled = true
                state.draftVis = false
            }

            const query = { ...route.query, index: state.active }
            router.replace({ query })
        }
        const prev = () => {
            state.active--
            state.nextBtnDisabled = false
            state.draftVis = true
            const query = Object.assign({ index: state.active }, route.query)
            router.replace({ query })
        }
        const save = () => {
            currentComp.value.value.formRef.validate((valid, fields) => {
                if (valid) {
                    console.log('submit!')
                } else {
                    console.log('error submit!', fields)
                }
            })

            console.log('basicInfoRef', unref([currentComp.value]))
            state.loading = true
            const elementList = [{
                elementCode: currentCode.value,
                elementValue: JSON.stringify(currentComp.value.value.form)
            }]

            // 每次保存需要把其它认证步骤的数据取出来
            if (state.formData.length > 0) {
                state.formData.forEach(el => {
                    if (el.elementCode !== currentCode.value && el.elementValue) {
                        elementList.push({
                            elementCode: el.elementCode,
                            elementValue: el.elementValue
                        })
                    }
                })
            }

            kycLevelApply({
                selectCountry,
                levelCode,
                openAccountType: 1,
                selectCompanyType,
                commitTag: false,
                elementList
            }).then(res => {
                state.loading = false
                if (res.check()) {
                    ElMessage({
                        message: '保存草稿成功',
                        type: 'success',
                    })
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const updateDialogVis = (val) => {
            state.dialogVis = val[0]
            state.accountHoldVis = val[1]
        }

        const updateProtocol = (val) => {
            state.nextBtnDisabled = !val
        }

        // 读取已保存的kyc信息
        const getKycData = () => {
            findAllLevelKyc({
                levelCode,
                selectCountry,
                selectCompanyType,
                openAccountType: 1
            }).then(res => {
                // loading.value = false
                if (res.check()) {
                    if (res.data.length > 0) {
                        // const elementList = res.data[0].elementList
                        // const elementValue = elementList.find(el => el.elementCode === currentCode.value)?.elementValue
                        // if (elementValue) {
                        state.formData = res.data[0].elementList
                        console.log('form-data', state.formData)
                        // }
                    }
                }
            }).catch(err => {
                // loading.value = false
            })
        }

        getKycData()

        return {
            save,
            prev,
            next,
            basicInfoRef,
            uploadFilesRef,
            certDirectorRef,
            beneficiaryRef,
            accountHoldRef,
            authMap,
            updateDialogVis,
            updateProtocol,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 1200px;
    margin: rem(50px) auto;
    padding-top: rem(50px);
    background: var(--contentColor);
    .el-steps {
        margin: rem(100px);
    }
    .title {
        margin: rem(50px) 0 0 0;
        padding: rem(40px) 0;
        font-weight: bold;
    }
    :deep(.el-form) {
        margin: 0 rem(20px) rem(20px) rem(20px);
        padding: 0  rem(100px) 0 rem(100px);
        border-radius: rem(10px);
        h3 {
            margin-bottom: rem(50px);
        }
        .el-select {
            width: 100%;
        }
        .title {
            margin: rem(50px) 0  rem(50px) 0;
            font-weight: bold;
        }
        .icon-upload {
            margin: rem(60px) 0 0 0;
        }
        .el-upload__tip {
            color: var(--minorColor);
            .tips {
                line-height: rem(50px);
            }
        }
        .link {
            display: inline-block;
            width: 360px;
            overflow: hidden; // 超出隐藏
            white-space: nowrap; // 不换行
            text-overflow: ellipsis; //字体超出用省略号显示
        }
        .uploader {
            position: relative;
            box-sizing: border-box;
            width: 360px;
            height: 180px;
            overflow: hidden;
            text-align: center;
            background-color: #FFF;
            border: 1px dashed #D9D9D9;
            border-radius: 6px;
            cursor: pointer;
            .icon-upload {
                display: block;
                margin: rem(100px) auto 0;
            }
            .upload-tip {
                color: var(--primary);
            }
        }
    }
    .oper-wrap {
        padding: 0  rem(100px)  rem(100px) rem(120px);
    }
}
</style>
