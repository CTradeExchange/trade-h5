<template>
    <section class='registerSuccess'>
        <div class='icon'>
            <i class='icon_chenggong'></i>
        </div>
        <div class='container'>
            <h2>恭喜！您的账号已经开立成功</h2>
            <p>客户编号：<span class='accountNo'>89000056</span></p>
        </div>
    </section>
    <p class='tips'>首次登录请使用注册填写的【手机/邮箱+验证码】登录</p>
    <div class='btnBox'>
        <button class='btn' @click="$router.push('/quote')">
            立即体验
        </button>
        <button class='highBtn'>
            去存款
            <p class='smallRow'>
                <span>现在存款最高<i>赠1000USD</i></span>
            </p>
        </button>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.registerSuccess{
    display: flex;
    padding: rem(80px) rem(40px)  rem(40px);
    .icon{
        width: rem(200px);
        font-size: rem(120px);
        color: var(--success);
        text-align: center;
    }
    h2{
        font-size: rem(32px);
        font-weight: normal;
        margin: rem(15px) 0 rem(20px);
    }
    .accountNo{
        color: var(--success);
    }
}
.tips{
    margin-top: rem(20px);
    font-size: rem(26px);
    color: var(--mutedColor);
    text-align: center;
}
.btnBox{
    margin: rem(60px) rem(80px);
    display: flex;
    text-align: center;
    .btn,.highBtn{
        flex: 1;
        height: rem(100px);
        background: #f3f8fe;
        color: var(--primary);
        margin-right: rem(20px);
        border-radius: rem(10px);
        line-height: 1.5;
        @include active()
    }
    .highBtn{
        background: var(--primary);
        color: var(--white);
    }
    .smallRow{
        font-size: rem(20px);
        i{
            color: #fffc00;
        }
    }
}
</style>
