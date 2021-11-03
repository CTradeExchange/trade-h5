<template>
    <centerViewDialog class='loanPage'>
        <loanMain />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import loanMain from './components/loanMain'

export default {
    components: {
        centerViewDialog,
        loanMain
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindEmailPage {
    line-height: 50px;

}
</style>
