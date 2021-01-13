<template>
    <van-popup
        v-model:show='visible'
        position='left'
        :style="{ height: '100%' }"
    >
        <div class='mainWrap'>
            <!-- <div class="flagWrap"> </div> -->
            <span class='flag'>Demo</span>
            <figure class='userFigure of-1px-bottom'>
                <span class='face'>
                    <img alt='' src='@m/images/face.png' />
                </span>
                <figcaption>
                    <p><strong>Cats2.0 H5 Demo</strong></p>
                    <p>84769176 - MetaQuotes-Demo</p>
                    <a class='accountManager' href='javascript:;'>管理账户</a>
                </figcaption>
            </figure>
            <ul class='menuList'>
                <li class='item'> <i class='icon icon_hangqing'></i> <strong>行情</strong> </li>
                <li class='item'> <i class='icon icon_tubiao'></i> <strong>图表</strong> </li>
                <li class='item'> <i class='icon icon_jiaoyi'></i> <strong>交易</strong> </li>
                <li class='item'> <i class='icon icon_lishi'></i> <strong>历史</strong> </li>
                <li class='item'> <i class='icon icon_xinwen'></i> <strong>新闻</strong> </li>
                <li class='item'> <i class='icon icon_xinxi'></i> <strong>信息</strong> </li>
                <li class='item'> <i class='icon icon_shezhi'></i> <strong>设置</strong> </li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
export default {
    data () {
        return {
            visible: true
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mainWrap{
    position: relative;
    width: 70vw;
    overflow: hidden;
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

.userFigure{
    padding: rem(30px);
    display: flex;
    font-size: rem(24px);
    line-height: 1.5;
    .face{
        width: rem(100px);
        height: rem(100px);
        img{
            width: rem(60px);
            height: rem(60px);
        }
    }
    strong{
        font-size: rem(28px);
    }
    .accountManager{
        color: var(--primary);
        display: block;
        margin-top: rem(20px);
    }
}
.menuList{
    padding: rem(10px) 0;
    font-size: rem(26px);
    .item{
        padding: rem(19px) rem(30px);
        strong{
            vertical-align: middle;
        }
        @include active()
    }
    .icon{
        display: inline-block;
        margin-right: .8em;
        font-size: rem(52px);
        vertical-align: middle;
        color: var(--mutedColor);
    }
}
</style>
