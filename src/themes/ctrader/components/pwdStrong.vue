<template>
    <div>
        <ul class='line' :class="['level'+levelNum]">
            <li class='item'></li>
            <li class='item'></li>
            <li class='item'></li>
            <li class='item'></li>
        </ul>
        <!-- <p>{{ text }}</p> -->
    </div>
</template>

<script>
export default {
    props: {
        levelNum: {
            type: Number,
            required: true,
        },
    },
}
</script>

<style lang="scss" >
@import '@/sass/mixin.scss';
.line{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 5px;
    margin-top: rem(10px);
    &.level0 .item:first-of-type{
        background: var(--red);
    }
    &.level1 .item:first-of-type{
        background: var(--red);
    }
    &.level2 .item:not(:nth-of-type(n+3)){
        background: var(--red);
    }
    &.level3 .item:not(:nth-of-type(n+4)){
        background: #ffd060;
    }
    &.level4 .item{
        background: #99cc00;
    }
    .item{
        height: 2px;
        background: var(--bdColor);
    }
}
</style>
