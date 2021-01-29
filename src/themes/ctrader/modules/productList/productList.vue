<template>
    <div class='productListWrap'>
        <productItem v-for='item in list' :key='item' @open='show=true' />
    </div>
</template>

<script>
import productItem from './productItem'
export default {
    components: {
        productItem,
    },
    data () {
        return {
            list: [...new Array(30)],
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.productListWrap {
    background: var(--white);
}
.popContainer {
    width: 80vw;
    background: var(--white);
    .title {
        padding: rem(35px) rem(30px);
        color: var(--primary);
        font-size: rem(40px);
        border-bottom: 2px solid var(--primary);
    }
    .menulist {
        .item {
            @include active();
            display: block;
            padding: 0 rem(30px);
            color: var(--color);
            line-height: rem(94px);
        }
    }
}
</style>
