<template>
    <div class='languageDiv'>
        中文<i class='lang-icon cn'></i>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.languageDiv{
    padding: 0 rem(16px);
    height: rem(50px);
    line-height: rem(50px);
    color: var(--mutedColor);
    border: 1px solid var(--mutedColor);
    border-radius: rem(15px);
    box-sizing: content-box;
    .lang-icon{
        width:23px;
        height:15px;
        display:inline-block;
        background-repeat: no-repeat;
        background-size:100%;
        position: relative;
        top: 2px;
        margin-left: 6px;
    }
    .cn{
        background-image:url(~@public/images/cn.png);
    }
    .en{
        background-image:url(~@public/images/en.png);
    }
}
</style>
