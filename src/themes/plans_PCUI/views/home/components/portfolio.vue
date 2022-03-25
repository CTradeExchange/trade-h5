<template>
    <div class='portfolio'>
        <h2 class='h2title'>
            立即创建您的加密货币投资组合
        </h2>
        <p class='titleDesc'>
            我们具有多种功能，使其成为开始交易的最佳场所
        </p>
        <div class='list'>
            <div class='row'>
                <i class='icon icon1'></i>
                <p class='title'>
                    简洁高效
                </p>
                <p class='desc'>
                    买卖流行的数字货币，在一个地方跟踪它们。
                </p>
            </div>
            <div class='row'>
                <i class='icon icon2'></i>
                <p class='title'>
                    美观大方
                </p>
                <p class='desc'>
                    清爽的界面始终将内容清晰地呈现给您。
                </p>
            </div>
            <div class='row'>
                <i class='icon icon3'></i>
                <p class='title'>
                    无处不在
                </p>
                <p class='desc'>
                    使用适用于 Android 或 iOS 设备，随时随地让您保持市场领先地位。
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.portfolio{
    width: 1200px;
    margin: 110px auto 40px;
    background: url('../../../images/home/portfolio.png') no-repeat right 160px;
    .h2title{
        font-family: "Microsoft Yahei";
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 20px;
    }
    .titleDesc{
        padding-bottom: 70px;
        text-align: center;
        font-size: 16px;
    }
    .list{
        margin-top: 30px;
    }
    .row{
        position: relative;
        padding-left: 110px;
        padding-bottom: 60px;
        .icon{
            position: absolute;
            left: 0;
            top: 0;
            width: 78px;
            height: 78px;
            background-size: contain;
            background-repeat: no-repeat;
            border-radius: 50%;
        }
        .icon1{
            background-image: url('../../../images/home/portfolio-icon1.png');
        }
        .icon2{
            background-image: url('../../../images/home/portfolio-icon2.png');
        }
        .icon3{
            background-image: url('../../../images/home/portfolio-icon3.png');
        }
    }
    .title{
        padding-bottom: 15px;
        font-size: 20px;

    }
}
</style>
