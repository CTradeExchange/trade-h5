<template>
    <div>
        <AwsCaptcha ref="awsCaptchaRef" @onCallback="handleCaptcha" />
    </div>
</template>

<script>
import AwsCaptcha from '@/components/form/awsCaptcha'
import { ref, onBeforeMount, reactive, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
    components: {
        AwsCaptcha
    },
    setup () {
        const state = reactive({
            captchaResponse: null
        })
        const route = useRoute()
        const awsCaptchaRef = ref(null)
        const { isUniapp } = route.query

        watch(
            [() => state.captchaResponse, () => awsCaptchaRef.value],
            (arr) => {
                const [data, refs] = arr
                if (data && refs) {
                    const useData = typeof data === 'object' ? data : JSON.parse(data)
                    refs.showCaptcha(useData)
                }
            },
            {
                immediate: false
            }
        )

        onBeforeMount(() => {
            window.addEventListener(
                'message',
                function (e) {
                    const { data, type } = e.data || {}
                    if (type === 'send_verify') {
                        state.captchaResponse = data
                    }
                },
                false
            )
        })

        const handleCaptcha = (res) => {
            if (isUniapp && uni) {
                uni.postMessage({
                    data: {
                        action: 'message',
                        type: 'captcha_finish',
                        params: res
                    }
                })
            }
        }

        return {
            ...toRefs(state),
            handleCaptcha,
            awsCaptchaRef
        }
    }
}
</script>