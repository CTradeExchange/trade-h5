<template>
    <div class='orderWrap'>
        <top
            back
            :menu='false'
            sub-title='Eur vs US Dollar'
            title='UERUSD'
        />
        <!-- 订单类型 -->
        <div class='cell openType'>
            <p class='title' @click='dropdownWrap=!dropdownWrap'>即时执行</p>
            <div v-show='dropdownWrap' class='dropdownWrap' @click='dropdownWrap=false'>
                <a class='item of-1px-bottom' href='javascript:;'>即时执行</a>
                <a class='item of-1px-bottom' href='javascript:;'>买入限价</a>
                <a class='item of-1px-bottom' href='javascript:;'>卖出限价</a>
                <a class='item of-1px-bottom' href='javascript:;'>买入止损</a>
                <a class='item of-1px-bottom' href='javascript:;'>卖出止损</a>
            </div>
        </div>

        <!-- 订单手数 -->
        <div class='cell volumn'>
            <a class='item' href='javascript:;'>-0.1</a>
            <a class='item' href='javascript:;'>-0.01</a>
            <span class='item'>
                <input v-model='volumn' class='volumnInput' type='text' />
            </span>
            <a class='item' href='javascript:;'>+0.01</a>
            <a class='item' href='javascript:;'>+0.1</a>
        </div>

        <!-- 买卖价格 -->
        <div class='cell priceCell'>
            <div class='col fallColor'>
                <Price />
            </div>
            <div class='col riseColor'>
                <Price />
            </div>
        </div>

        <!-- 价格设置 -->
        <div class='cell priceSet'>
            <div class='col'>
                <van-stepper v-model='value' class='priceStepper' :decimal-length='3' step='0.01' />
            </div>
            <div class='col'>
                <van-stepper v-model='value' class='priceStepper' :decimal-length='3' step='0.01' />
            </div>
        </div>

        <!-- 图表 -->
        <div class='chart'> 这里是图表 </div>

        <!-- 底部下单按钮 -->
        <div class='footerBtn'>
            <div class='col'>
                <button class='btn sellColor' @click="$router.push('/order/pending')">SELL</button>
            </div>
            <div class='col'>
                <button class='btn buyColor' @click="$router.push('/order/pending')">BUY</button>
            </div>
        </div>
    </div>
</template>

<script>
import top from '@m/layout/top'
import Price from '@m/components/price'
export default {
    components: {
        Price,
        top,
    },
    data () {
        return {
            dropdownWrap: false,
            volumn: 0.01,
            value: 3,
            value2: '',
            option1: [
                { text: '全部商品', value: 0 },
                { text: '新款商品', value: 1 },
                { text: '活动商品', value: 2 },
            ],
        }
    },

}
</script>

<style lang="scss" scoped>
@import "~@/sass/mixin.scss";
.orderWrap {
    position: relative;
    height: 100%;
    padding-bottom: rem(100px);
    .cell {
        margin-left: rem(30px);
        margin-right: rem(30px);
    }
}
.openType {
    margin-top: rem(20px);
    padding: 1px;
    text-align: center;
    @include ftbd();
    .title{
        padding: rem(15px) 0 rem(5px);
        font-size: rem(28px);
    }
    .dropdownWrap{
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: var(--bgColor);
        box-shadow: 1px 1px rem(15px) rgba(0,0,0,.3);
        .item{
            display: block;
            line-height: rem(80px);
            color: inherit;
            font-size: rem(28px);
        }
    }
}
.volumn{
    margin-top: rem(40px);
    padding: 1px;
    line-height: rem(44px);
    text-align: center;
    display: flex;
    position: relative;
    padding-bottom: rem(10px);
    @include ftbd();
    .item{
        flex: 1;
        font-size: rem(26px);
        @include active();
    }
    .volumnInput{
        width: 100%;
        text-align: center;
    }
}
.priceCell{
    margin-top: rem(30px);
    display: flex;
    justify-content: center;
    .col{
        &:first-of-type{
            margin-right: rem(40px);
        }
    }
}
.priceSet{
    margin-top: rem(40px);
    display: flex;
    .col{
        flex: 1;
        @include ftbd();

        &:first-of-type{
            margin-right: rem(40px);
            &::before{
                border-color: var(--sellColor);
            }
        }
        &:last-of-type{
            &::before{
                border-color: var(--buyColor);
            }
        }
    }
}
.priceStepper{
    width: 100%;
    display: flex;
    :deep{
        .van-stepper__input{
            flex: 1;
        }
        .van-stepper__minus,.van-stepper__plus{
            background: none;
            color: var(--primary);
        }
        .van-stepper__input{
            background: none;
        }
    }
}
.chart{
    margin-top: rem(40px);
    background: var(--bdColor);
    height: rem(500px);
    line-height: rem(500px);
    text-align: center;
    color: var(--color);
    font-size: rem(30px);
}
.footerBtn{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    &::before{
        content: '';
        position: absolute;
        left: 50%;
        top: 20%;
        bottom: 20%;
        width: 1px;
        background: rgba(0,0,0,.15);
    }
    .col{
        flex: 1;
    }
    .btn{
        height: rem(100px);
        line-height: 1;
        text-align: center;
        width: 100%;
        font-size: rem(28px);
        font-weight: bold;
        @include active()
    }
}
</style>
