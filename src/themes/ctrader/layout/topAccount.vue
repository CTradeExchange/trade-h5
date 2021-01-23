<template>
    <div class='topAccount' @click='show'>
        <span class='curLevel'>D</span>
        <span class='curNo'>3102816</span>
        <i class='arrowDown'></i>
        <transition name='van-slide-down'>
            <div v-show='visible' class='accountPopup' @click.stop='hide'>
                <a class='item' href='javascript:;'>
                    <span class='level'>D</span>
                    <p class='no'>3102816</p>
                    <p class='currency'>EUR</p>
                </a>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data () {
        return {
            visible: false
        }
    },
    methods: {
        show () {
            this.visible = true
        },
        hide () {
            this.visible = false
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.topAccount{
    position: relative;
    margin-left: 1em;
    display: flex;
    align-items: center;
    .curLevel{
        padding: rem(6px) rem(10px);
        line-height: 1;
        font-size: rem(28px);
        text-align: center;
        border: 1px solid var(--white);
        border-radius: rem(5px);
    }
    .curNo{
        margin-left: 1em;
        font-size: rem(32px);
    }
    .arrowDown{
        margin-left: 1em;
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid var(--white);
        border-radius: 3px;
        border-width: 6px 6px 0 6px;
        border-color: var(--white) transparent transparent transparent;
    }
}
.accountPopup{
    position: absolute;
    left: 0;
    top: 100%;
    background: var(--white);
    color: var(--color);
    width: rem(400px);
    text-align: center;
    box-shadow: 0 rem(5px) rem(15px) rgba(0,0,0,.5);
    .item{
        display: block;
        position: relative;
        background: var(--bgerColor);
        color: var(--color);
        padding: rem(20px) 0 rem(20px) rem(100px);
        text-align: left;
        .level{
            position: absolute;
            left: rem(30px);
            top: rem(30px);
            padding: rem(6px) rem(10px);
            line-height: 1;
            font-size: rem(28px);
            text-align: center;
            border: 1px solid var(--color);
            border-radius: rem(5px);
        }
        .no{
            font-size: rem(32px);
        }
        .currency{
            font-size: rem(24px);
        }
    }
}
</style>
