<template>
    <div class='authConditionWrapper'>
        <LayoutTop :custom-back='true' bottomLine :menu='false' :title='$t("cRoute.regKyc")' @back='back' />
        <auth-condition :business-code='businessCode' :platform='platform' />
    </div>
</template>

<script>
import authCondition from '@/themeCommon/components/authConditon'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
    components: {
        authCondition
    },
    props: {
        platform: {
            type: String,
            default: 'h5'
        }
    },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const businessCode = computed(() => route.query.businessCode)

        const back = () => {
            router.replace('/authentication')
        }

        return {
            back,
            businessCode
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.authConditionWrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>
