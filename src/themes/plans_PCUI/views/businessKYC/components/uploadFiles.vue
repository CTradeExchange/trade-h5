<template>
    <el-form
        ref='formRef'
        v-loading='loading'
        label-position='top'
        label-width='auto'
        :model='form'
        :size='size'
    >
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='注册证书'>
                    <van-uploader :after-read='afterRead' name='regCertificate' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <a class='link' :href='form.regCertificate' target='_blank'>
                        {{ form.regCertificate }}
                    </a>
                    <!-- <el-upload
                        action='/upload'
                        class='upload-demo'

                        drag
                        method='handleUpload'
                        multiple
                    >
                        <img class='icon-upload' src='/images/upload.png' srcset='' />
                        <upload-filled />
                        <div class='el-upload__text'>
                            拖动文件或 <em>点击上传</em>
                        </div>
                    </el-upload> -->
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='公司章程'>
                    <van-uploader :after-read='afterRead' name='policy' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <a class='link' :href='form.policy' target='_blank'>
                        {{ form.policy }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='董事名册/董事职权证明书（注册代理人证书）/注册信息摘要'>
                    <van-uploader :after-read='afterRead' name='directorsList' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <div class='el-upload__tip'>
                        最近12个月内出具，且包含现任董事信息
                    </div>
                    <a class='link' :href='form.directorsList' target='_blank'>
                        {{ form.directorsList }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='董事名册/董事职权证明书（注册代理人证书）/注册信息摘要'>
                    <van-uploader :after-read='afterRead' name='directorsList2' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <div class='el-upload__tip'>
                        最近12个月内由政府网站出具的公司信息摘要，包含现任董事及股东信息
                    </div>
                    <a class='link' :href='form.directorsList2' target='_blank'>
                        {{ form.directorsList2 }}
                    </a>

                    <!-- <el-upload
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
                        <template #tip>
                            <div class='el-upload__tip'>
                                最近12个月内由政府网站出具的公司信息摘要，包含现任董事及股东信息
                            </div>
                        </template>
                    </el-upload> -->
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='所有权结构图'>
                    <van-uploader :after-read='afterRead' name='structure' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <div class='el-upload__tip'>
                        下载模板
                    </div>
                    <a class='link' :href='form.structure' target='_blank'>
                        {{ form.structure }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='制裁问卷'>
                    <van-uploader :after-read='afterRead' name='sanctionsQues' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <div class='el-upload__tip'>
                        下载模板
                    </div>
                    <a class='link' :href='form.sanctionsQues' target='_blank'>
                        {{ form.sanctionsQues }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='授权信'>
                    <el-form-item label='制裁问卷'>
                        <van-uploader :after-read='afterRead' name='authorizationLetter' result-type='file'>
                            <div class='uploader'>
                                <img class='icon-upload' src='/images/upload.png' srcset='' />
                                <p class='upload-tip'>
                                    点击上传
                                </p>
                            </div>
                        </van-uploader>
                        <div class='el-upload__tip'>
                            下载模板
                        </div>
                        <a class='link' :href='form.authorizationLetter' target='_blank'>
                            {{ form.authorizationLetter }}
                        </a>
                    </el-form-item>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='经营状况说明'>
                    <van-uploader :after-read='afterRead' name='businessConditions' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>

                    <div class='el-upload__tip'>
                        <p class='tips'>
                            请提供以下资料中的任意项（3个月内出具）：
                        </p>
                        <p class='tips'>
                            1）通过政府网站链接找到的公司信息截图，截图请包括电脑桌面的时间日期信息；
                        </p>
                        <p class='tips'>
                            2）董事职权证明书（注册代理人证书）
                        </p>
                        <p class='tips'>
                            3）良好存续证明
                        </p>
                    </div>
                    <a class='link' :href='form.businessConditions' target='_blank'>
                        {{ form.businessConditions }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='中间股东信息（如有直接/间接持有25%及以上的公司）'>
                    <van-uploader :after-read='afterRead' name='intermediateShareholders' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>

                    <div class='el-upload__tip'>
                        <p class='tips'>
                            1）股东名册/董事职权证明书（注册代理人证书）/注册信息摘要（包含现任股东信息）；
                        </p>
                        <p class='tips'>
                            2）良好存续证明/董事职权证明书（注册代理人证书）/注册信息摘要（证明公司现经营状况）
                        </p>
                    </div>
                    <a class='link' :href='form.intermediateShareholders' target='_blank'>
                        {{ form.intermediateShareholders }}
                    </a>
                </el-form-item>
            </el-col>
            <el-col :offset='0' :span='12'>
                <el-form-item label='补充资料'>
                    <van-uploader :after-read='afterRead' name='furtherInfo' result-type='file'>
                        <div class='uploader'>
                            <img class='icon-upload' src='/images/upload.png' srcset='' />
                            <p class='upload-tip'>
                                点击上传
                            </p>
                        </div>
                    </van-uploader>
                    <a class='link' :href='form.furtherInfo' target='_blank'>
                        {{ form.furtherInfo }}
                    </a>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter='20'>
            <el-col :offset='0' :span='12'>
                <el-form-item label='公司网站（如有，没有填写无'>
                    <el-input v-model='form.websit' />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
import { reactive, ref, computed, unref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { ElIcon, ElMessage } from 'element-plus'
import { upload, getListByParentCode } from '@/api/base'

export default {
    props: {
        formData: {
            type: Object,
            require: true
        }
    },
    setup (props, context) {
        const formRef = ref(null)
        const state = reactive({
            loading: false,
            form: {
                regCertificate: '',
                policy: '',
                directorsList: '',
                directorsList2: '',
                structure: '',
                sanctionsQues: '',
                authorizationLetter: '',
                businessConditions: '',
                intermediateShareholders: '',
                furtherInfo: '',
                websit: ''
            }

        })

        watch(
            () => props.formData, (val) => {
                if (val) {
                    const elementValue = val.find(el => el.elementCode === 'company_upload_file')?.elementValue
                    if (elementValue) { state.form = JSON.parse(elementValue) }
                }
            }, {
                immediate: true
            }
        )

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
                    state.form[detail.name] = res.data
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

        return {
            afterRead,
            formRef,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>

</style>
