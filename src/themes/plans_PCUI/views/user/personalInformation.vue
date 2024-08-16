<template>
    <centerViewDialog>
        <LayoutTop :custom-back='true' icon='icon_icon_close_big' @back='customBack' />
        <div class='page-wrapper'>
            <div class='container'>
                <div class='field'>
                    <div class='field-label require'>
                        {{ $t('common.nickname') }}
                    </div>
                    <el-input v-model.trim='userInfo.NickName' :clearable='true' :placeholder='$t("common.nicknamePlaceholder")' type='text' @input='handleChangeName' />
                </div>
                <div class='field'>
                    <div class='field-label'>
                        {{ $t('common.optionalAvatar') }}
                    </div>
                    <div class='avatar-block'>
                        <el-avatar class='avatar' :size='90' :src='userInfo?.HeadImg'>
                            <img :src='defaultAvatar' />
                        </el-avatar>

                        <div class='change-btn' @click='handleChangeAvatar'>
                            <span>{{ $t('common.change') }}</span>
                        </div>
                        <input ref='uploadRef' name='file' style='display: none;' type='file' @change='afterRead' />
                    </div>
                </div>
                <div class='field'>
                    <div class='field-label'>
                        {{ $t('common.area') }}
                    </div>
                    <div class='area-block'>
                        <div class='change-area' @click='changeCountry'>
                            <img
                                alt=''
                                class='icon-country'
                                :src='`${cdnUrl}/images/countries_flags/${userInfo.Country}.png`'
                                srcset=''
                            />
                            <!-- <el-icon :size='16'>
                                <ArrowDown />
                            </el-icon> -->
                        </div>
                    </div>
                </div>
                <div v-if='!isHaveIVcode && isEnableNewsInvite' class='field'>
                    <div class='field-label'>
                        {{ $t('common.optionalInvitationCode') }}
                    </div>
                    <el-input v-model.trim='userInfo.InvitationCode' :clearable='true' :placeholder="$t('common.inviteCodePlaceholder')" type='text' />
                    <div class='rules-title'>
                        {{ $t('common.inviteCodeRulesTitle') }}
                    </div>
                    <div class='rules-content'>
                        {{ $t('common.inviteCodeRulesContent') }}
                    </div>
                </div>
            </div>
            <div class='confirm-btn' @click='handSubmit'>
                <span>{{ $t('common.submit') }}</span>
            </div>
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import { cdnUrl } from '@/config'
import defaultAvatar from '@/assets/newPCUI/default-avatar.png'
import { onMounted, reactive, toRefs, computed, watch, ref } from 'vue'
import { getUserInfo, UpdateUserInfo } from '@/api/newApi'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { UploadOSS, createFileKey } from '@/utils/aliUpload'
import { sessionGet, sessionSet, sessionRemove, isEmpty } from '@/utils/util'

export default {
    components: { centerViewDialog },

    setup () {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const uploadRef = ref(null)
        const state = reactive({
            userInfo: (sessionGet('newsUserInfo') && JSON.parse(sessionGet('newsUserInfo'))) || {},
            loading: false,
            show: false,
            isHaveIVcode: false,
        })

        store.dispatch('getCountryListByParentCode')
        const countryList = computed(() => store.state.countryList)

        const isEnableNewsInvite = computed(() => {
            let isEnable = false
            const newsSysConfig = store.state._base.newsSysConfig
            const newsConfig = newsSysConfig && newsSysConfig.find((o) => o.Key === 'invitationConfig')
            const { Value } = newsConfig || {}
            try {
                if (!isEmpty(Value)) {
                    const { enable } = JSON.parse(Value) || {}
                    isEnable = enable
                }
            } catch (e) {}
            return isEnable
        })

        const handleChangeAvatar = (e) => {
            uploadRef.value && uploadRef.value.click()
        }
        // 上传图片
        const afterRead = (e) => {
            const files = e.target.files

            if (isEmpty(files)) return
            const file = files[0]
            state.loading = true
            const fileKey = createFileKey(file)
            UploadOSS({
                file,
                fileKey,
                onFinish: (status, { url }) => {
                    if (status === 'done') {
                        state.userInfo.HeadImg = url
                        Toast(t('auth.uploadSuccess'))
                    } else {
                    // Toast(t('auth.uploadSuccess'))
                    }
                    state.loading = false
                },
            })
        }

        const getInfo = () => {
            getUserInfo({ body: {} }).then(res => {
                const { Code, Data } = res || {}
                if (Code === 1000) {
                    const { InvitationCode } = Data || {}

                    sessionSet('newsUserInfo', JSON.stringify(Object.assign(Data, { isBack: false })))
                    state.userInfo = Data
                    state.isHaveIVcode = !!InvitationCode
                }
            }).catch(err => {

            })
        }

        const handleChangeName = (value) => {
            setTimeout(() => {
                state.userInfo.NickName = value.replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, '')
            }, 100)
        }

        const handSubmit = () => {
            const body = state.userInfo
            if (!body.NickName) return Toast(t('common.inputNickName'))
            if (state.isHaveIVcode) {
                delete body.InvitationCode
            }
            UpdateUserInfo({ body }).then(res => {
                if (state.userInfo.InvitationCode && !state.isHaveIVcode) {
                    state.isHaveIVcode = true
                }
                const { Code } = res || {}
                if (Code === 1000) {
                    Toast(t('common.submitSuccess'))
                    store.dispatch('_user/getNewUserInfo')
                }
                router.go(-1)
            }).catch(err => {
                const { Msg } = err || {}
                Toast(Msg)
            })
        }

        const changeCountry = () => {
            // sessionSet('newsUserInfo', JSON.stringify(state.userInfo))
            // router.push({
            //     path: route.path.slice(0, -19) + 'area',
            // })
        }

        const customBack = () => {
            sessionRemove('newsUserInfo')
            router.go(-1)
        }

        watch([() => countryList.value, () => state.userInfo], () => {
            if (!state.userInfo?.Country) {
                state.userInfo.Country = countryList.value[0]?.code
            }
        }, { immediate: true })

        onMounted(() => {
            if (state.userInfo.isBack) return
            getInfo()
        })

        return {
            isEnableNewsInvite,
            handleChangeName,
            customBack,
            uploadRef,
            handleChangeAvatar,
            countryList,
            cdnUrl,
            changeCountry,
            handSubmit,
            afterRead,
            defaultAvatar,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/sass/country_currency.scss";
@import "@/sass/mixin.scss";
.page-wrapper{
    flex:1;
    display: flex;
    flex-direction: column;
    height:0;
    .container{
        padding:20px;
        flex:1;
        @include scroll-bar-vertical;
        overflow-y: auto;
        .field{
            margin-bottom:20px;
            :deep{
                .el-input__inner{
                    height: 35px;
                }
            }
            .field-label{
                position: relative;
                margin-bottom: 3px;
                text-transform: capitalize;
                &.require{
                    &::after{
                        content:'*';
                        color:var(--primary);
                    }
                }
            }
            .avatar-block{
                display: flex;
                flex-direction: column;
                align-items: center;
                width:90px;
                margin:15px 0;
                .avatar{
                    width:68px;
                    height: 68px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom:15px;
                    :deep{
                        img{
                            width:100%;
                            height:100%
                        }
                    }
                }
                .change-btn{
                    cursor: pointer;
                    width: auto;
                    min-width: 90px;
                    height: 30px;
                    color:var(--contentColor);
                    background: var(--primary);
                    border-radius: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 1;
                    text-transform: capitalize;
                    padding: 0 8px;
                }
            }
            .rules-title{
                font-size: 12px;
                margin-top:10px;
            }
            .rules-content{
                font-size: 12px;

            }

            .change-area{
                cursor: pointer;
                display: flex;
                align-items: center;
                .icon-country{
                    width:75px;
                    margin-right:20px
                }
            }
            .area-block{
                display: flex;
            }
        }
    }
    .confirm-btn{
        height: 45px;
        box-shadow: 0px 0 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

    }
}

</style>
