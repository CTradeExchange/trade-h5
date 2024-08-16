<template>
    <centerViewDialog>
        <LayoutTop />
        <div class='record'>
            <capitalList />
        </div>
    </centerViewDialog>
</template>

<script>
import centerViewDialog from '@planspc/layout/centerViewDialog'
import capitalList from './components/capitalList'

export default {
    components: {
        capitalList,
        centerViewDialog
    },
}
</script>
<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.record {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    user-select: none;
}
</style>
