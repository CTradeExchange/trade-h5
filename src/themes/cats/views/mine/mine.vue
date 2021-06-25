<template>
    <div class='page-wrap'>
        <Person />
        <Menulist />
    </div>
</template>

<script>
import Person from './components/person'
import Menulist from './components/menulist'
export default {
    components: {
        Person,
        Menulist,
    },
    setup () {       return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    height: 100%;
    background: var(--bgColor);
}

</style>
