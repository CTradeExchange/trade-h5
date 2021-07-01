<template>
    <div class='authConditionWrapper'>
        <LayoutTop back :menu='false' />
        <auth-condition :business-code='businessCode' />
    </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import authCondition from '@/themeCommon/components/authConditon'
export default {
    components: {
        authCondition,
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
.authConditionWrapper {
    padding-top: rem(100px);
}
</style>
