<template>
    <div class='login-telegram'>
        <div ref='telegramRef' class='telegram'></div>
        <a class='login'>
            <el-button class='icon' type='primary'>
                Login with Telegram
                <!--<img alt='telegram' class='telegramIcon' src='../../../../themes/plans_PCUI/images/telegramIcon.jpg' />Log in with Telegram-->
            </el-button>
        </a>
    </div>
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
import { reactive, toRefs, computed, watch, ref, watchEffect } from 'vue'
import hooks from '../loginHooks'
import { useStore } from 'vuex'
export default {
    // props: {
    //     loginType: {
    //         type: String,
    //         required: true
    //     }
    // },
    setup (props) {
        const telegramRef = ref(null)
        const store = useStore()
        // const state = reactive({
        //     bindAddShow: false,
        //     userId: '',
        //     thirdSource: '',
        //     customerGroupId: '',
        //     country: '',
        //     loading: false,
        //     loginType: props.loginType
        // })
        const state = reactive({
            bindAddShow: false,
            userId: '',
            thirdSource: '',
            customerGroupId: '',
            country: '',
            loading: false,
            loginType: 'telegram'
        })

        // const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === state.loginType)?.clientId)
        const appId = computed(() => store.state._base.thirdLoginConfig.find(el => el.thirdSource === 'telegram')?.clientId)

        const { handleCBLogin, onSelectCountry, areaActions } = hooks(state)

        const dataLayer = window.dataLayer || []

        const onTelegramAuth = (res) => {
            handleCBLogin(res)
            dataLayer.push({ 'event': 'click', 'gtm.elementClasses': 'thirdPartLogin', 'gtm.elementId': 'telegram', })
        }

        const onTgUnauth = () => {
            dataLayer.push({ 'event': 'click', 'gtm.elementClasses': 'thirdPartLogin', 'gtm.elementId': 'telegram', })
        }

        const renderBtn = () => {
            const script = document.createElement('script')
            script.async = true
            script.src = 'https://telegram.org/js/telegram-widget.js?19'
            script.setAttribute('data-size', 'large')
            script.setAttribute('data-telegram-login', appId.value)
            script.setAttribute('data-request-access', 'write')
            window.onTelegramAuth = onTelegramAuth
            script.setAttribute('data-onunauth', 'window.onTgUnauth()')
            window.onTgUnauth = onTgUnauth
            script.setAttribute('data-onauth', 'window.onTelegramAuth(user)')
            telegramRef.value?.appendChild(script)
        }

        watchEffect(() => {
            if (appId.value) {
                renderBtn()
            }
        })

        return {
            telegramRef,
            onTelegramAuth,
            areaActions,
            onSelectCountry,
          ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.login-telegram{
    cursor: pointer;
    display: inline-block;
    position: relative;
    overflow: hidden;
    margin-top: 20px;
    margin-left: 20px;
    box-shadow: 0.00px 1.00px 20px 0px rgba(125,43,196,1);
    border-radius: 30px !important;
    .telegram{
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
      box-shadow: 0.00px 1.00px 20px 0px rgba(125,43,196,1);
      background: #A238FF;
      width: 100%;
      color: #fff;
      border-radius: 30px !important;
      height: 50px;
      font-size: 18px;
      border: unset !important;
      .telegramIcon{
        width: 40px;
        margin-right: 10px;
      }
    }
    .icon:hover{
      background-color: #fff !important;
      color: #000;
      border: 1px solid #000 !important;
    }
}

@media screen and (max-width: 620px) {
  .login-telegram{
    margin-left: unset !important;
    margin-top: 20px;
  }
}
</style>
