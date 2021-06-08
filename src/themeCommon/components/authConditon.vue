<template>
    <Loading :show='loading' />
    <div class='page-wrap'>
        <slot name='notice'></slot>
        <div v-if='conditionVis' class='auth-condition'>
            <van-field
                v-model='area'
                input-align='right'
                :label='$t("auth.country")'
                :placeholder='$t("auth.countrySelect")'
                readonly
                right-icon='arrow-down'
                @click='areaShow = true'
            />
            <div class='notice'>
                <p class='title'>
                    {{ $t('auth.info') }}
                </p>
                <ul>
                    <li v-for='(item,index) in elementList' :key='index'>
                        {{ item.elementName }}
                    </li>
                </ul>
            </div>
            <van-button class='confirm-btn' @click='beginAuth'>
                {{ $t('auth.startValid') }}
            </van-button>
        </div>
        <div v-else>
            <div class='conditon-wrap'>
                <div v-for='(item,index) in elementList' :key='index' class='c-item'>
                    <!-- <van-cell-group v-if="item.showType === 'input'"> -->
                    <van-field
                        v-if="item.showType === 'input'"
                        v-model='conditionModel[item.elementCode]'
                        clearable
                        :label='item.elementName'
                        :placeholder='$t("common.input")+item.elementName'
                        :type='item.elementCode === "phone" ? "number" : "text"'
                    />
                    <!-- </van-cell-group> -->
                    <div v-if="item.showType === 'image'">
                        <van-uploader :after-read='afterRead' :name='item.elementCode' result-type='file'>
                            <img :id='item.elementCode' alt='' class='upload-img' :src='require("../../assets/auth/" + item.elementCode + ".png")' srcset='' />
                            <p class='upload-text'>
                                {{ item.elementName }}
                            </p>
                        </van-uploader>
                    </div>
                </div>
                <van-button class='confirm-btn' @click='onConfirm'>
                    {{ $t('common.submit') }}
                </van-button>
            </div>
        </div>
    </div>
    <van-action-sheet v-model:show='areaShow' :actions='countryActions' @select='onSelect' />
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { toRefs, reactive, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { Toast, Dialog } from 'vant'
import { findAllLevelKyc, kycLevelApply, kycApply } from '@/api/user'
import { getArrayObj, isEmpty } from '@/utils/util'
import { upload } from '@/api/base'
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
            areaShow: false,
            area: '',
            pathCode: '',
            loading: false,
            list: [],
            elementList: [],
            countryActions: [],
            conditionVis: true,
            conditionModel: {}
        })

        const getConditon = () => {
            state.loading = true

            findAllLevelKyc({
                levelCode: levelCode
            }).then(res => {
                state.loading = false
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        state.countryActions.push({
                            name: item.pathName,
                            code: item.pathCode
                        })
                    })
                }
                state.list = res.data
                // 只有一个路径的时候默认选中
                if (Number(res.data.length === 1)) {
                    state.area = res.data[0].pathName
                    state.pathCode = res.data[0].pathCode
                    state.elementList = getArrayObj(state.list, 'pathCode', state.pathCode).elementList
                    state.areaShow = false
                }
            }).catch(err => {
                state.loading = false
            })
        }

        const onSelect = (item) => {
            try {
                state.area = item.name
                state.pathCode = item.code
                state.elementList = getArrayObj(state.list, 'pathCode', item.code).elementList
                state.areaShow = false
            } catch (error) {
                console.log(error)
            }
        }

        const beginAuth = () => {
            if (!state.area) {
                return Toast(t('auth.countrySelect'))
            }
            state.conditionVis = false
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
            const elementList = []
            if (!isEmpty(state.conditionModel)) {
                for (const key in state.conditionModel) {
                    if (state.conditionModel.hasOwnProperty(key)) {
                        elementList.push({
                            elementCode: key,
                            elementValue: state.conditionModel[key]
                        })
                    }
                }
            }

            if (elementList.length < state.elementList.length) {
                return Toast(t('auth.allAuthPlease'))
            }

            let params
            /* 具体业务的kyc认证 */
            if (!isEmpty(props.businessCode)) {
                params = {
                    pathCode: state.pathCode,
                    businessCode: props.businessCode,
                    elementList: elementList,
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
                    pathCode: state.pathCode,
                    levelCode,
                    elementList: elementList
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

        onBeforeMount(() => {
            // 注册进来的kyc

            const kycList = sessionStorage.getItem('kycList')
            if (!isEmpty(kycList)) {
                state.list = JSON.parse(kycList)
                state.list.forEach(item => {
                    state.countryActions.push({
                        name: item.pathName,
                        code: item.pathCode
                    })
                })
            } else {
                getConditon()
            }
        })
        onBeforeUnmount(() => {
            sessionStorage.removeItem('kycList')
        })

        return {
            ...toRefs(state),
            onSelect,
            onConfirm,
            getConditon,
            beginAuth,
            afterRead

        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    padding-top: rem(30px);
    overflow: auto;
    .notice {
        margin-top: rem(58px);
        padding-left: rem(30px);
        .title {
            color: var(--mutedColor);
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
            border-bottom: solid 1px var(--bdColor);
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
        }
    }
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--btnColor);
    }
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--btnColor);
    }
}
</style>
