<template>
    <localeComponent />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })

const localeComponent = defineAsyncComponent(() => {
    try {
        return import(`./${locale.value}.vue`)
    } catch (err) {
        return import(`./en-US.vue`)
    }
})
</script>

