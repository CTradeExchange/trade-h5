<template>
    <div class='float-content'>
        <a href='https://www.baidu.com' target='_blank'>
            <img alt='' src='../../../../assets/floatBtn.png' srcset='' />
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.float-content{
    position: fixed;
    top: rem(600px);
    z-index: 9999;
    width: rem(96px);
    height: rem(96px);
    right: rem(30px);
    img{
        width: 100%;
    }
}
</style>
