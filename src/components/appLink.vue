<template>
    <a v-if='isExternal' :href='to' rel='external nofollow' target='_blank'>
        <slot></slot>
    </a>
    <router-link v-else-if='!isExternal && !!to' v-bind='$props'>
        <slot></slot>
    </router-link>
    <slot name='jwt'></slot>
</template>

<script>
import { computed } from 'vue'

export default {
    props: {
        to: {
            type: String,
            default: ''
        }
    },
    setup (props) {
        const isExternal = computed(() => {
            return typeof props.to === 'string' && props.to.startsWith('http')
        })

        return {
            isExternal
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
