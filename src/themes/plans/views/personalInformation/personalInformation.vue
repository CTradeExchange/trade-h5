<template>
    <LayoutTop :custom-back='true' :title='$t("cRoute.personalInformation")' @back='customeBack' />
    <Loading :show='loading' />
    <div class='page-wrapper'>
        <div class='page-content'>
            <div class='container'>
                <div class='label nickname'>
                    {{ $t('common.nickname') }}
                </div>
                <div class='input-div'>
                    <input v-model='nickname' maxlength='25' :placeholder="$t('common.nicknamePlaceholder')" @input='handleChangeName' />
                </div>

                <div class='label'>
                    {{ $t('common.optionalAvatar') }}
                </div>
                <div class='avatar-div'>
                    <van-image class='avatar' round :src='avatar || defaultAvatar'>
                        <template #loading>
                            <van-loading size='20' type='spinner' />
                        </template>
                    </van-image>
                    <van-uploader :after-read='afterRead'>
                        <div class='change-btn'>
                            <span>{{ $t('common.change') }}</span>
                        </div>
                    </van-uploader>
                </div>
                <div class='label'>
                    {{ $t('common.area') }}
                </div>
                <div class='area-div'>
                    <div v-if='!cdnUrl || !countryCode' class='icon-country'></div>
                    <img
                        v-else
                        alt=''
                        class='icon-country'
                        :src='`${cdnUrl}/images/countries_flags/${countryCode}.png`'
                        srcset=''
                        @click='changeCountry'
                    />
                </div>
                <div v-if='!isHaveIVcode && isEnableNewsInvite'>
                    <div class='label'>
                        {{ $t('common.optionalInvitationCode') }}
                    </div>
                    <div class='input-div'>
                        <input v-model='inviteCode' :placeholder="$t('common.inviteCodePlaceholder')" />
                    </div>
                    <div class='rules-title'>
                        {{ $t('common.inviteCodeRulesTitle') }}
                    </div>
                    <div class='rules-content'>
                        {{ $t('common.inviteCodeRulesContent') }}
                    </div>
                </div>
            </div>
        </div>
        <div class='footer'>
            <div class='confirm-btn' @click='handSubmit'>
                <span>{{ $t('common.submit') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { cdnUrl } from '@/config'
import defaultAvatar from '@/assets/newPCUI/default-avatar.png'
import { onMounted, reactive, toRefs, computed, watch } from 'vue'
import { getUserInfo, UpdateUserInfo } from '@/api/newApi'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { UploadOSS, createFileKey } from '@/utils/aliUpload'
import { isEmpty } from '@/utils/util'

export default {

    setup () {
        const router = useRouter()
        const route = useRoute()
        const { t } = useI18n({ useScope: 'global' })
        const store = useStore()
        const { countryCode, nickname, inviteCode, avatar, isBack } = route.params || {}
        const state = reactive({
            userInfo: {},
            countryCode: countryCode || '',
            nickname: nickname || '',
            inviteCode: inviteCode || '',
            avatar: avatar || '',
            userId: '',
            loading: false,
            show: false,
            isHaveIVcode: !!inviteCode
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

        // 上传图片
        const afterRead = ({ file }) => {
            state.loading = true
            const fileKey = createFileKey(file)
            UploadOSS({
                file,
                fileKey,
                onFinish: (status, { url }) => {
                    if (status === 'done') {
                        state.avatar = url
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
                    const { Country, HeadImg, ID, InvitationCode, NickName } = Data || {}
                    state.nickname = NickName
                    if (Country) {
                        state.countryCode = countryList.value.find(i => i.code === Country)?.code
                    } else {
                        state.countryCode = countryList.value[0]?.code
                    }
                    state.avatar = HeadImg
                    state.userId = ID
                    state.inviteCode = InvitationCode
                    state.isHaveIVcode = !!InvitationCode
                }
            })
        }

        const handleChangeName = (e) => {
            const value = e.target.value
            setTimeout(() => {
                state.nickname = value.replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, '')
            }, 100)
        }

        const handSubmit = () => {
            const body = {
                NickName: state.nickname,
                Country: countryCode,
                HeadImg: state.avatar,
            }
            if (!body.NickName) return Toast(t('common.inputNickName'))
            if (!state.isHaveIVcode && state.inviteCode) {
                body.InvitationCode = state.inviteCode
            }
            UpdateUserInfo({ body }).then(res => {
                if (state.inviteCode && !state.isHaveIVcode) {
                    state.isHaveIVcode = true
                }
                Toast(t('common.submitSuccess'))
                router.replace('/mine')
                store.dispatch('_user/getNewUserInfo')
            }).catch(err => {
                const { Msg } = err || {}
                Toast(Msg)
            })
        }

        const changeCountry = () => {
            // 禁止修改个人信息的地区
            // router.push({
            //     name: 'Area',
            //     params: {
            //         back: 'PersonalInformation',
            //         nickname: state.nickname,
            //         avatar: state.avatar,
            //         inviteCode: state.inviteCode,
            //         countryCode: state.countryCode
            //     }
            // })
        }

        const customeBack = () => {
            router.push('/mine')
        }

        watch([() => countryList.value, () => state.countryCode], () => {
            if (!state.countryCode) {
                state.countryCode = countryList.value[0]?.code
            }
        }, { immediate: true })

        onMounted(() => {
            if (isBack) return
            getInfo()
        })

        return {
            isEnableNewsInvite,
            handleChangeName,
            customeBack,
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
.page-wrapper{
    padding:rem(20px) 0;
    flex:1;
    display: flex;
    flex-direction: column;
    .page-content{
        flex:1;
    }
    .container{

        background: var(--contentColor);
        padding:rem(30px) rem(30px) rem(70px) rem(30px);
        .label{
            position: relative;
            font-size: rem(32px);
            color:var(--mainColor);
            text-transform:capitalize;
            &.nickname{
                &::after{
                    position: absolute;
                    content:'*';
                    color:var(--primary);
                }
            }
        }
        .input-div{
            margin:rem(15px) rem(30px) rem(40px) rem(30px);
            border:1px solid #ebebeb;
            border-radius:rem(10px);
            height: rem(90px);
            display: flex;
            align-items: center;
            padding:0 rem(20px);
            &>input{
                outline: none;
                border:none;
                flex:1;
                font-size: rem(28px);
            }
        }
        .avatar-div{
            margin:rem(40px) 0 rem(70px) 0;
            display: flex;
            flex-direction: column;
            .avatar{
                width:rem(136px);
                height: rem(136px);
                border-radius: 50%;
                object-fit: cover;
                overflow: hidden;
                :deep{
                    .errorDiv{
                        img{
                            width: 100%;

                            max-width: unset;
                        }
                    }
                }
            }

            .change-btn{
                width: auto;
                min-width:rem(136px);
                display: flex;
                justify-content: center;
                align-items: center;
                background: var(--primary);
                color:var(--contentColor);
                height: rem(50px);
                border-radius: rem(25px);
                margin-top: rem(20px);
                text-transform:capitalize;
                padding: 0 rem(16px);
            }
        }
        .area-div{
            padding: rem(26px) 0 rem(40px) 0;
            .icon-country{
                width:rem(150px);
                height: rem(110px);
                vertical-align: middle;
                border: solid 1px var(--lineColor);
            }
            .area-flag{
                width:rem(150px);
                height: rem(110px);
            }
            // .area-icon{
            //     transform: scale(2);
            // }
        }
        .rules-title,.rules-content{
            font-size: rem(22px);
            color:#585757;
            margin:0 rem(30px);
            line-height: rem(26px);
        }
        .rules-title{
            margin-top:rem(-20px)
        }

    }
    .footer{
            padding: 0 rem(30px);
            .confirm-btn{
                height: rem(90px);
                display: flex;
                justify-content: center;
                align-items: center;
                color:var(--contentColor);
                font-size: rem(28px);
                background: var(--primary);
                border-radius: rem(8px);
            }
        }
}
</style>
