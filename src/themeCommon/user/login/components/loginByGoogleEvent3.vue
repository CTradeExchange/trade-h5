<template>
    <a class='login-google' @click='click_listener'>
        <div ref='googleRef' class='google'></div>
        <a class='login'>
            <el-button class='icon' type='primary'>
                <img alt='google' class='googleIcon' src='../../../../themes/plans_PCUI/images/googleIcon.png' />Log in with Google
            </el-button>
        </a>
    </a>
    <Loading :show='loading' />
    <!-- 请补充您所在国家信息 -->
    <!-- <van-action-sheet
        v-model:show='bindAddShow'
        :actions='areaActions'
        class='loginAreaActionsheet'
        teleport='#app'
        :title='$t("login.inputCountry")'
        @close='loading = false'
        @select='onSelectCountry'
    /> -->
</template>

<script>
import { reactive, toRefs, computed, ref, watch, getCurrentInstance } from 'vue'
import loadScript from '@/utils/loadScript'
import { useI18n } from 'vue-i18n'
import hello from 'hellojs/dist/hello.all.min.js'
import { useStore } from 'vuex'
import hooks from '../loginHooks'
export default {
    setup (props, context) {
        const store = useStore()
        const googleRef = ref(null)
        const { t } = useI18n({ useScope: 'global' })
        var auth2 = ''
        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === 'google')?.clientId)
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            loading: false,
            idToken: '',
            loginType: 'google'
        })

        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)

        const renderBtn = () => {
            loadScript('https://accounts.google.com/gsi/client').then(() => {
                startApp()
            })
        }

        const attachSignin = (element) => {
            const code = element.credential
            handleCBLogin(code)
        }

        const click_listener = () => {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({
                'event': 'click',
                'gtm.elementClasses': 'thirdPartLogin',
                'gtm.elementId': 'google'
            })
        }

        const startApp = () => {
            window.google.accounts.id.initialize({
                // 主要就是填写client_id
                client_id: appId.value,
                auto_select: false,
                callback: attachSignin,
            })

            // 设置按钮的样式等
            window.google.accounts.id.renderButton(
                googleRef.value,
                {
                    theme: 'filled_blue',
                    size: 'large',
                    type: 'standard',
                    text: 'signin_with',
                    click_listener: click_listener
                }
            )
        }

        watch(
            () => appId.value, (val) => {
                if (val) {
                    renderBtn()
                }
            }, {
                immediate: true
            }
        )

        return {
            googleRef,
            areaActions,
            onSelectCountry,
            click_listener,
          // login_google,
          ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login-google{
    cursor: pointer;
    display: inline-block;
    position: relative;
    overflow: hidden;
    .google{
        overflow: hidden;
        opacity: 0.00001;  // 透明度为0的时候firefox无法触发点击事件
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
}
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  .icon{
      background-color: #A80C0C !important;
      color: #fff;
      border-radius: unset !important;
      min-width: 244px;
      height: 50px;
      font-size: 18px;
      border: unset !important;
      .googleIcon{
        width: 30px;
        margin-right: 10px;
      }
    }
    .icon:hover{
      background-color: #fff !important;
      color: #000;
      border: 1px solid #000 !important;
    }
}

@media screen and (max-width: 1000px) {
  .login {
  .icon{
    width: 244px !important;
    }
  }
}
</style>
