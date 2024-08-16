<template>
    <LayoutTop :back='true' :custom-back='false' :menu='false' :title='$t("cRoute.personalInformation")' />
    <div class='page-wrapper'>
        <div class='page-content'>
            <div class='container'>
                <div class='label nickname'>
                    {{ $t('common.nickname') }}
                </div>
                <div class='input-div'>
                    <input v-model='nickname' maxlength='25' :placeholder="$t('common.nicknamePlaceholder')" />
                </div>

                <div class='label'>
                    {{ $t('common.optionalAvatar') }}
                </div>
                <div class='avatar-div'>
                    <img class='avatar' :src='fileDataBase64 || avatar' />
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
                    <img
                        alt=''
                        class='icon-country'
                        :src='`${cdnUrl}/images/countries_flags/${countryCode}.png`'
                        srcset=''
                        @click='changeCountry'
                    />
                </div>
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
        <div class='footer'>
            <div class='confirm-btn'>
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
export default {
    setup () {
        const state = reactive({
            nickname: '',
            inviteCode: '',
            avatar: defaultAvatar,
            file: '',
            fileDataBase64: ''
        })

        const afterRead = (files) => {
            // 此时可以自行将文件上传至服务器
            const { file, content } = files || {}
            const formData = new FormData()
            formData.append('object', file)
            state.fileDataBase64 = content
        }
        return {
            afterRead,
            cdnUrl,
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
            }
            .change-btn{
                width: auto;
                width:rem(136px);
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
            .area-flag{
                width:rem(150px);
                height: rem(110px);
            }
        }
        .rules-title,.rules-content{
            font-size: rem(22px);
            color:#585757;
            margin: 0 rem(30px);
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
