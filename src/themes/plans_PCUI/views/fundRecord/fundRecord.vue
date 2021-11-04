<template>
    <centerViewDialog class='fundRecordPage'>
        <fundRecordMain />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import fundRecordMain from './components/fundRecordMain'

export default {
    components: {
        centerViewDialog,
        fundRecordMain
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.fundRecordPage {
    line-height: 50px;
}
</style>
