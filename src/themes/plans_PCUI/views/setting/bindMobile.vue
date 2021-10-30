<template>
    <centerViewDialog class='bindMobilePage'>
        <bindMobileComponent type='bind' />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import bindMobileComponent from '@/themeCommon/components/bindMobileComponent'

export default {
    components: {
        centerViewDialog,
        bindMobileComponent
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindMobilePage {
    line-height: 50px;

}
</style>
