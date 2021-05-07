<template>
    <auth-condition :level-code='levelCode' />
</template>

<script>
import authCondition from '@/themeCommon/components/authConditon'
export default {
    components: {
        authCondition
    },
    setup (props) {

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
