<template>
    <centerViewDialog class='bindEmailPage'>
        <bindEmailComponent type='bind' />
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import bindEmailComponent from './components/bindEmailComponent'

export default {
    components: {
        centerViewDialog,
        bindEmailComponent
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.bindEmailPage {
    line-height: 50px;

}
</style>
