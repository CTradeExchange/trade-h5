<template>
    <section class='productInfo'>
        <div class='productBar'>
            <i class='icon_guanzhu'></i>
            <i class='icon_dui'></i>
            <div class='center'>
                <p class='name'>AUDUSD</p>
                <p class='desc'>L: 0.75829 S: 0.9 H:0.76878</p>
            </div>
            <div class='end'>
                <p class='big'>+1.03%</p>
                <p>+77.9</p>
            </div>
        </div>
        <div class='btnBox'>
            <div class='col left'>
                <p class='text'>卖出</p>
                <p align='right' class='price'>0.76778</p>
            </div>
            <div class='col right'>
                <p class='text'>买入</p>
                <p class='price'>0.76778</p>
            </div>
            <div class='volums'>
                <span class='inputWrap of-1px-bottom'>
                    <input v-model='volum' type='text' />
                </span>
                <span class='volText' @click='volumSheetVisible = true'>手数</span>
                <i class='icon_xiala muted'></i>
            </div>
        </div>
    </section>
    <van-action-sheet v-model:show='volumSheetVisible' :actions='volumSheet' teleport='body' @select='volumSheetSelected' />
</template>

<script>
export default {
    data () {
        return {
            volum: 0.4,
            volumSheetVisible: false,
            volumSheet: [
                { name: '选项一' },
                { name: '选项一' },
                { name: '选项一' },
            ]
        }
    },
    methods: {
        volumSheetSelected (item) {
            this.volumSheetVisible = false
            console.log(item)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.productInfo {
    margin: rem(20px);
    padding: rem(30px);
    background: var(--white);
    border: 1px solid var(--bdColor);
    border-radius: 3px;
}
.productBar {
    display: flex;
    color: var(--mutedColor);
    font-size: rem(24px);
    line-height: 1.4;
    .center {
        flex: 1;
    }
    .end {
        text-align: right;
    }
    .name,
    .big {
        font-weight: bold;
        font-size: rem(34px);
    }
    .icon_guanzhu {
        margin-right: rem(20px);
        color: var(--primary);
        font-size: rem(60px);
    }
    .icon_dui {
        margin-right: rem(20px);
        color: var(--warn);
        font-size: rem(60px);
    }
}
.btnBox {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: rem(20px);
    .col {
        width: 49%;
        background: var(--bgerColor);
        border-radius: 2px;
    }
    .volums {
        position: absolute;
        top: 0;
        left: 50%;
        width: 50%;
        height: rem(120px);
        padding-top: rem(40px);
        text-align: center;
        background: var(--white);
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        transform: translateX(-50%);
        .inputWrap {
            display: inline-block;
            padding-bottom: rem(10px);
            input {
                width: rem(140px);
                text-align: right;
            }
        }
        .volText {
            display: inline-block;
            padding: 0 rem(15px);
        }
    }
    .text {
        width: 50%;
        height: rem(120px);
        line-height: rem(120px);
        text-align: center;
    }
    .right .text {
        margin-left: 50%;
    }
    .price {
        height: rem(120px);
        padding: 0 rem(34px);
        font-weight: bold;
        font-size: rem(50px);
        line-height: rem(120px);
    }
}
</style>
