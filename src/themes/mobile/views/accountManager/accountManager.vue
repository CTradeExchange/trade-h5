<template>
    <div class='accountManager'>
        <section class='accountBlock'>
            <span class='flag'>Demo</span>
            <figure class='userFigure'>
                <img alt='' class='face' src='@m/images/face.png' />
                <figcaption>
                    <p><strong>Cats2.0 H5 Demo</strong></p>
                    <p class='muted'>84769176 - MetaQuotes-Demo</p>
                    <p class='muted'>Access Point EU 0, 1:100</p>
                    <p class='amount'>100 000.00 USD</p>
                </figcaption>
            </figure>
            <i class='icon_tishi' @click='show=true'></i>
        </section>
    </div>
    <van-dialog v-model:show='show' title='属性'>
        <div class='tishiDialog'>
            <p><strong>84769176 - Cats2.0 H5 Demo</strong></p>
            <p class='muted'>MetaQuotes Software Corp</p>
            <p class='muted'>1:100, USD 100 000.00</p>
            <p class='muted'>access point: Access Point EU 0</p>
        </div>
    </van-dialog>
</template>

<script>
import { ref } from 'vue'
export default {
    setup () {
        const show = ref(false)
        return { show }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.accountManager{
    position: relative;
    padding-top: rem(10px);
    &::before{
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: rem(200px);
        background: var(--primary);
    }
    .accountBlock{
        position: relative;
        z-index: 1;
        overflow: hidden;
        margin: 0 rem(20px) rem(40px);
        padding: rem(40px);
        border-radius: rem(10px);
        background: var(--white);
        box-shadow: 1px 1px 5px rgba(0,0,0,.2);
    }
}
.flag{
    position: absolute;
    display: block;
    right: 0;
    top: 0;
    color: #fff;
    background: #4dc90f;
    width: rem(180px);
    height: rem(44px);
    line-height: rem(44px);
    text-align: center;
    font-size: rem(24px);
    text-shadow:#267200 1px 0 0,#267200 0 1px 0,#267200 -1px 0 0,#267200 0 -1px 0;
    font-weight: bold;
    transform: rotate(45deg) translate(rem(44px), rem(-20px));
}
.icon_tishi{
    position: absolute;
    bottom: rem(45px);
    right: rem(30px);
    font-size: rem(42px);
}
.tishiDialog{
    padding: rem(20px) 0;
    line-height: 1.5;
    text-align: center;
}
.userFigure{
    .face{
        display: block;
        margin: 0 auto;
        width: rem(80px);
        height: rem(80px);
    }
    figcaption{
        padding-top: rem(30px);
        text-align: center;
        line-height: 1.5;
    }
    .amount{
        margin-top: rem(20px);
        color: var(--olor);
        font-size: rem(40px);
    }
}
</style>
