<template>
    <Top back :menu='false' />
    <auth-condition :business-code='businessCode' />
</template>

<script>
import Top from '@m/layout/top'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import authCondition from '@/themeCommon/components/authConditon'
export default {
    components: {
        authCondition,
        Top
    },
    setup (props) {
        const route = useRoute()
        const businessCode = computed(() => route.query.businessCode)

        return {
            businessCode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.notice {
    margin-bottom: rem(20px);
    padding-left: rem(30px);
}
</style>
