<template>
    <Loading :show='loading' />
    <div class='page-wrap'>
        <slot name='notice'></slot>
        <div class='conditon-wrap'>
            <div v-for='(item,index) in elementList' :key='index' class='c-item'>
                <van-field
                    v-if="item.showType === 'input'"
                    v-model='conditionModel[item.elementCode]'
                    clearable
                    :label='item.elementName'
                    :placeholder='$t("common.input")+item.elementName'
                    :type='item.elementCode === "phone" ? "number" : "text"'
                />

                <div v-if="item.showType === 'image'">
                    <van-uploader :after-read='afterRead' :name='item.elementCode' result-type='file'>
                        <img :id='item.elementCode' alt='' class='upload-img' :src='require("../../assets/auth/" + item.elementCode + ".png")' srcset='' />
                        <p class='upload-text'>
                            {{ item.elementName }}
                        </p>
                    </van-uploader>
                </div>
                <div v-if="item.showType === 'inputGroup'">
                    <van-field
                        v-model='typeValue'
                        clickable
                        :label='$t("register.certificateType")'
                        :placeholder='$t("register.chooseCertificateType")'
                        readonly
                        @click='showPicker = true'
                    />
                    <van-field v-model='conditionModel[typeCode]' :label='$t("register.certificateNo")' :placeholder="$t('register.pleaseEnter')+ typeValue" />
                </div>
            </div>
            <van-button class='confirm-btn' @click='onConfirm'>
                {{ $t('common.submit') }}
            </van-button>
        </div>
    </div>

    <van-popup v-model:show='showPicker' position='bottom' round>
        <van-picker
            :columns='columns'
            :columns-field-names='columnsFields'
            @cancel='showPicker = false'
            @confirm='handleConfirm'
        />
    </van-popup>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { toRefs, reactive, onBeforeMount, onBeforeUnmount } from 'vue'
import { Toast } from 'vant'
import { findAllLevelKyc, kycLevelApply, kycApply } from '@/api/user'
import { getArrayObj, isEmpty } from '@/utils/util'
import { upload, getListByParentCode } from '@/api/base'
import { useI18n } from 'vue-i18n'

export default {
    props: {
        businessCode: {
            type: String
        }
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const levelCode = route.query.levelCode

        const state = reactive({
            area: '',
            pathCode: '',
            loading: false,
            list: [],
            elementList: [],
            conditionVis: true,
            conditionModel: {},
            typeValue: '',
            showPicker: false,
            value1: '',
            columns: [],
            typeCode: '',
            extendsMap: {} // 字段和正则对应

        })
        const columnsFields = { text: 'name' }

        const getConditon = () => {
            state.loading = true

            findAllLevelKyc({
                levelCode: levelCode
            }).then(res => {
                state.loading = false

                state.list = res.data
                // 只有一个路径的时候默认选中
                if (Number(res.data.length === 1)) {
                    state.area = res.data[0].pathName
                    state.pathCode = res.data[0].pathCode
                    state.elementList = getArrayObj(state.list, 'pathCode', state.pathCode).elementList

                    state.areaShow = false
                    getInputGroupList()
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 有inputGroup证件类型的时候 请求类型列表
        const getInputGroupList = () => {
            const typeObj = getArrayObj(state.elementList, 'showType', 'inputGroup')
            if (!isEmpty(typeObj)) {
                getInputGroupData()
            }

            state.elementList.forEach(item => {
                state.extendsMap[item.elementCode] = {
                    name: item.elementName,
                    extend: item.extend
                }
            })
        }

        const getInputGroupData = () => {
            getListByParentCode({ parentCode: 'id_card_type' }).then(res => {
                if (res.check() && res.data.length > 0) {
                    state.columns = res.data
                    if (res.data.length > 0) {
                        res.data.forEach(item => {
                            state.extendsMap[item.code] = {
                                name: item.name,
                                extend: item.extend
                            }
                        })
                    }
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
                    document.getElementById(detail.name).src = res.data
                    state.conditionModel[detail.name] = res.data
                    Toast(t('auth.uploadSuccess'))
                }
            }).catch(err => {
                state.loading = false
                console.log(err)
            })
        }

        const onConfirm = () => {
            const tempElementList = []
            if (!isEmpty(state.conditionModel)) {
                for (const key in state.conditionModel) {
                    if (state.conditionModel.hasOwnProperty(key)) {
                        if (!isEmpty(state.extendsMap[key].extend)) {
                            const valueReg = new RegExp(state.extendsMap[key].extend)
                            if (!valueReg.test(state.conditionModel[key])) {
                                return Toast(`${state.extendsMap[key].name}` + t('register.incorrectlyFormed'))
                            }
                        }

                        tempElementList.push({
                            elementCode: key,
                            elementValue: state.conditionModel[key]
                        })
                    }
                }
            }

            if (tempElementList.length < state.elementList.length) {
                return Toast(t('auth.allAuthPlease'))
            }

            let params
            /* 具体业务的kyc认证 */
            if (!isEmpty(props.businessCode)) {
                params = {
                    businessCode: props.businessCode,
                    elementList: tempElementList,
                    levelCode
                }
                state.loading = true
                kycApply(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        router.replace({ name: 'KycCommitted' })
                        sessionStorage.removeItem('kycList')
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            } else {
                params = {
                    levelCode,
                    elementList: tempElementList
                }
                state.loading = true
                kycLevelApply(params).then(res => {
                    state.loading = false
                    if (res.check()) {
                        router.replace({ name: 'KycCommitted' })
                    }
                }).catch(err => {
                    state.loading = false
                    console.log(err)
                })
            }
        }

        const deleterepeatData = () => {
            const tempDelData = state.columns.filter((item) => item.code !== state.typeCode)
            if (tempDelData.length > 0) {
                tempDelData.forEach(item => {
                    delete state.conditionModel[item.code]
                })
            }
        }

        const handleConfirm = (value) => {
            state.typeValue = value.name
            state.typeCode = value.code
            state.showPicker = false
            // 类型为证件类型的时候处理重复数据
            deleterepeatData()
        }

        onBeforeMount(() => {
            // 注册进来的kyc
            const kycList = sessionStorage.getItem('kycList')
            if (!isEmpty(kycList)) {
                state.elementList = JSON.parse(kycList)[0].elementList
                getInputGroupList()
            } else {
                getConditon()
            }
        })

        onBeforeUnmount(() => {
            sessionStorage.removeItem('kycList')
        })

        return {
            ...toRefs(state),
            onConfirm,
            getConditon,
            afterRead,
            handleConfirm,
            columnsFields
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    height: 100%;
    padding-top: rem(30px);
    overflow: auto;
    background-color: var(--bgColor);
    .notice {
        margin-top: rem(58px);
        padding-left: rem(30px);
        .title {
            color: var(--minorColor);
            font-size: rem(28px);
            line-height: rem(36px);
        }
        ul {
            padding-left: rem(30px);
            li {
                margin-top: rem(20px);
                list-style-type: disc;
            }
        }
    }
    .conditon-wrap {
        padding-bottom: rem(50px);
        .c-item {
            text-align: center;
            background: var(--contentColor);
            border-bottom: solid 1px var(--lineColor);
            :deep(.van-cell) {
                background-color: var(--contentColor);
                .van-cell__title {
                    color: var(--normalColor);
                }
                .van-cell__value {
                    color: var(--color);
                }
                .van-field__control {
                    color: var(--color);
                }
            }
            .upload-img {
                width: rem(400px);
                height: rem(260px);
            }
            .upload-text {
                margin-top: rem(20px);
            }
            .van-uploader {
                margin-top: rem(50px);
                margin-bottom: rem(50px);
            }
            &:last-of-type {
                //border-bottom: none;
            }
        }
    }
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--contentColor);
    }
}
</style>
