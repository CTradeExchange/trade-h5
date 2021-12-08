<template>
    <div class='g-layout'>
        <router-view />
    </div>
</template>

<script>
import { onMounted , reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {localSet} from '@/utils/util';
import I18n, { setI18nLanguage, loadLocaleMessages } from '../../i18n/i18n.js'

export default {
     name: 'layout',
    setup (props) {
        const route = useRoute()
        const state = reactive({
            activeLang: route.query.language || route.query.lang || 'zh-CN',
        })
        const { locale } = useI18n()
        onMounted(() => {
            setI18nLanguage(I18n, state.activeLang)
            loadLocaleMessages(I18n, state.activeLang)
        })
    }
     
}
</script>
