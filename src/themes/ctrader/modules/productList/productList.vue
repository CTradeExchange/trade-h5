<template>
    <div>
        <productItem v-for='item in list' :key='item' @open='show=true' />
    </div>
    <van-popup v-model:show='show'>
        <section class='popContainer'>
            <p class='title'>UERUSD</p>
            <div class='menulist'>
                <a class='item of-1px-bottom ' href='javascript:;' @click="$router.push('/order')">新交易</a>
                <a class='item of-1px-bottom ' href='javascript:;' @click="show=false;$router.push('/chart')">打开图表</a>
                <a class='item of-1px-bottom ' href='javascript:;' @click="$router.push('/contract')">交易品种属性</a>
                <a v-if='quoteMode===2' class='item of-1px-bottom ' href='javascript:;' @click='switchQuoteMode'>简单查看模式</a>
                <a v-else class='item of-1px-bottom ' href='javascript:;' @click='switchQuoteMode'>高级查看模式</a>
            </div>
        </section>
    </van-popup>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import productItem from './productItem'
export default {
    components: {
        productItem,
    },
    data () {
        return {
            list: [...new Array(30)],
            show: false,
        }
    },
    computed: {
        ...mapState(['quoteMode'])
    },
    methods: {
        ...mapMutations(['Update_quoteMode']),
        switchQuoteMode () {
            this.Update_quoteMode(this.quoteMode === 1 ? 2 : 1)
            this.show = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.popContainer{
    background: var(--white);
    width: 80vw;
    .title{
        border-bottom: 2px solid var(--primary);
        color: var(--primary);
        font-size: rem(40px);
        padding: rem(35px) rem(30px);
    }
    .menulist{
        .item{
            display: block;
            padding: 0 rem(30px);
            line-height: rem(94px);
            color: var(--color);
            @include active()
        }
    }
}
</style>
