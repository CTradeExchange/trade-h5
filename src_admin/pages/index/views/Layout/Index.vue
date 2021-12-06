<template>
    <div class='g-layout'>
        <router-view />
    </div>
</template>

<script>
import { onMounted , reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
     name: 'layout',
    setup (props) {
        const route = useRoute()
        const state = reactive({
            activeLang: route.query.language || 'zh-CN',
        })
        const { locale } = useI18n()
        onMounted(() => {
            locale.value = state.activeLang;
        })
    }
     
}
</script>
