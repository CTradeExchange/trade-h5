<template>
    <van-popup
        v-model:show="captchaShow"
        :close="hideCaptcha"
        closeable
        :style="{ overflow: 'hidden', paddingTop: '20vh' }"
    >
        <div ref="captchaIframe"></div>
    </van-popup>
</template>

<script>
// aws验证码 提供 showCaptcha 显示验证码 和 on-callback 回调方法
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

export default {
    emits: ['on-callback'],
    setup (props, { expose, emit }) {
        const captchaIframe = ref(null)
        const captchaShow = ref(false)

        const showCaptcha = async (response) => {
            if (
                response?.status === 405 &&
                response.headers &&
                response.headers['x-amzn-waf-action'] === 'captcha' &&
                response?.data
            ) {
                captchaShow.value = true
                await nextTick()
                captchaIframe.value.innerHTML = ''
                const iframe = document.createElement('iframe')
                iframe.style.width = '100vw'
                iframe.style.height = '100vh'
                captchaIframe.value.appendChild(iframe)
                let html = response.data.replace(
                    'window.location.reload(true);',
                    'window.parent.postMessage({type: "CAPTCHA_SUCCESS", data: voucher}); '
                )
                html = html.replace(
                    '<div id="captcha-container"></div>',
                    '<div id="captcha-container"></div><style >html,body{padding:0; margin:0}</style>'
                )
                html = html.replace(
                    'const container = document.querySelector("#captcha-container");',
                    `const container = document.querySelector('#captcha-container');
                    var timer = setInterval(()=>{
                        const btn= document.querySelector('#amzn-captcha-verify-button')
                        if(btn){
                            btn.click();
                            clearInterval(timer)
                        }
                    }, 5)`
                )
                iframe.contentWindow.document.open()
                iframe.contentWindow.document.write(html)
                iframe.contentWindow.document.close()
            }
        }

        const hideCaptcha = () => {
            captchaShow.value = false
            captchaIframe.value.innerHTML = ''
        }

        const checkVerifyCode = (e) => {
            if (e?.data?.type === 'CAPTCHA_SUCCESS' && e?.data?.data) {
                hideCaptcha()
                emit('on-callback', e.data.data)
            }
        }

        onMounted(() => {
            window.addEventListener('message', checkVerifyCode)
        })

        onUnmounted(() => {
            window.removeEventListener('message', checkVerifyCode)
        })

        expose({
            showCaptcha
        })
        return {
            captchaShow,
            captchaIframe,
            hideCaptcha
        }
    }
}
</script>
