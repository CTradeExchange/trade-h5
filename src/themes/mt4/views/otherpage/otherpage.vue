<template>
    <top left-icon='arrow-left' :right-action='false' :title='title' />
    <my-iframe
        ref='contentIframe'
        :class="{ 'hasheader': !$route.query.hidehead }"
        page-url='about:blank'
        @onerror='pageOnLoad'
        @onload='pageOnLoad'
    />
    <div>
    </div>
</template>

<script>
import top from '@/components/top'
import myIframe from '@m/components/iframe'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
export default {
    components: {
        top,
        myIframe,
    },
    setup () {
        const route = useRoute()
        const contentIframe = ref(null)
        const state = reactive({
            loading: true,
            title: route.query.pageTitle || '',
        })
        let timer = null
        onMounted(() => {
            contentIframe.value.setIframeUrl(decodeURIComponent(route.query.url))
            timer = window.setTimeout(() => {
                state.loading = false
            }, 8000)
        })
        const pageOnLoad = () => {
            if (timer) window.clearTimeout(timer)
            state.loading = false
        }
        return {
            ...toRefs(state),
            pageOnLoad,
            contentIframe,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
