<template>
    <van-popup
        v-model:show='visible'
        position='left'
        :style="{ height: '100%' }"
    >
        <div class='mainWrap'>
            <!-- <div class="flagWrap"> </div> -->
            <figure class='userFigure'>
                <span class='face'>
                    <img alt='' src='@ct/images/face.png' />
                </span>
                <figcaption>
                    <p class='platform'>Cats2.0 H5 Demo</p>
                    <p class='loginName'>qia75786@eveav.com</p>
                    <p class='accountName'>qia75786</p>
                    <a class='accountSetting' href='javascript:;'>
                        <i class='icon_zhanghushezhi'></i>
                    </a>
                </figcaption>
                <div class='accountRow'>
                    <a class='addAccountBtn' href='javascript:;'>
                        <i class='icon_jia'></i>
                    </a>
                    <topAccount />
                </div>
            </figure>
            <ul class='menuList'>
                <li class='item'> <i class='icon icon_cunkuan'></i> <strong>存款</strong> </li>
                <li class='item'> <i class='icon icon_qukuan'></i> <strong>取款</strong> </li>
                <li class='item' @click="visible=false;$router.push('/order')"> <i class='icon icon_xindingdan'></i> <strong>新订单</strong> </li>
                <li class='item' @click="visible=false;$router.push('/search')"> <i class='icon icon_sousuo'></i> <strong>Find & Add Symbols</strong> </li>
                <li class='item' @click="visible=false;$router.push('/setting')"> <i class='icon icon_shezhi'></i> <strong>设置</strong> </li>
                <li class='item' @click="visible=false;$router.push('/login')"> <i class='icon icon_tuichu'></i> <strong>退出</strong> </li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
import topAccount from './topAccount'
export default {
    components: {
        topAccount,
    },
    data () {
        return {
            visible: false
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.mainWrap {
    position: relative;
    width: 80vw;
    overflow: hidden;
}
.userFigure {
    position: relative;
    padding: rem(30px) 0;
    color: var(--white);
    font-size: rem(24px);
    line-height: 1.5;
    background: var(--primary);
    .face {
        position: absolute;
        top: rem(30px);
        left: rem(30px);
        width: rem(100px);
        height: rem(100px);
        img {
            width: rem(60px);
            height: rem(60px);
        }
    }
    figcaption {
        margin-left: rem(130px);
    }
    .platform {
        font-size: rem(40px);
        opacity: 0.6;
    }
    .loginName {
        margin-top: rem(20px);
        opacity: 0.6;
    }
    .accountName {
        font-size: rem(32px);
    }
    .accountManager {
        display: block;
        margin-top: rem(20px);
        color: var(--white);
    }
    .accountSetting {
        position: absolute;
        top: rem(120px);
        right: rem(30px);
        padding: 5px;
        color: var(--white);
        font-size: rem(50px);
        line-height: 1;
        background: rgba(0, 0, 0, 0.18);
        border-radius: 50%;
    }
    .accountRow {
        margin: rem(20px) rem(20px) 0;
    }
    .addAccountBtn {
        float: right;
        color: var(--white);
        font-size: rem(45px);
    }
}
.menuList {
    padding: rem(10px) 0;
    font-size: rem(26px);
    .item {
        @include active();
        padding: rem(19px) rem(30px);
        strong {
            vertical-align: middle;
        }
    }
    .icon {
        display: inline-block;
        margin-right: 0.8em;
        color: var(--mutedColor);
        font-size: rem(50px);
        vertical-align: middle;
    }
}
</style>
