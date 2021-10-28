<template>
    <div class='guide-module auto-width'>
        <h3 class='title'>
            新手指引
        </h3>
        <p class='subhead'>
            开启数字货币交易学习
        </p>
        <ul class='guide-ul'>
            <li>
                <img src='@planspc/images/home/guide-1.png' />
                <p>如何购买数字货币</p>
            </li>
            <li>
                <img src='@planspc/images/home/guide-2.png' />
                <p>急速了解交易规则</p>
            </li>
            <li>
                <img src='@planspc/images/home/guide-3.png' />
                <p>小白进场适合买什么数字货币</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.guide-module {
    margin-top: 90px;
    color: var(--color);
    .title {
        font-size: 32px;
        font-weight: bold;
    }
    .subhead {
        margin-top: 5px;
        font-size: 16px;
    }
    .guide-ul {
        display: flex;
        margin-top: 46px;
        li {
            width: 390px;
            margin-right: 16px;
            cursor: pointer;
            &:last-of-type {
                margin-right: 0;
            }
            img {
                display: block;
                width: 100%;
                height: 192px;
            }
            p {
                margin-top: 20px;
                font-size: 16px;
            }
        }
    }
}
</style>
