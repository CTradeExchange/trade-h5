<template>
    <div class='pending'>
        <p class='iconMain'>
            <i class='icon_paidui'></i>
        </p>
        <p class='title'>
            订单正在进行排队处理...
        </p>
        <p class='desc'>
            {{data.direction===1?'buy':'sell'}}
            {{orderVolume +' '+ product.symbolName }} at
            {{requestPrice}} <br />
            sl: {{sl}}
            tp: {{tp}}
        </p>
        <div class='footerBtn of-1px-top'>
            <button class='btn' @click='$emit("onHide")'>
                隐藏
            </button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { getDecimalNum } from '@/utils/calculation';
export default {
    props: ['data','product'],
    setup(props){
        const orderVolume = computed(()=>{
            const volumeDigit = getDecimalNum(props.product.minVolume)
            return (props.data.requestNum/props.product.contractSize).toFixed(volumeDigit);
        });
        const requestPrice = computed(()=> (props.data.requestPrice/Math.pow(10, props.product.symbolDigits)).toFixed(props.product.symbolDigits));
        const sl = computed(()=> {
            if(!props.data.stopLoss) return Number(0).toFixed(props.product.symbolDigits)
            return (props.data.stopLoss/Math.pow(10, props.product.symbolDigits)).toFixed(props.product.symbolDigits)
        });
        const tp = computed(()=> {
            if(!props.data.takeProfit) return Number(0).toFixed(props.product.symbolDigits)
            return (props.data.takeProfit/Math.pow(10, props.product.symbolDigits)).toFixed(props.product.symbolDigits)
        });
        return {
            orderVolume,
            requestPrice,
            sl,
            tp,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.pending {
    position: relative;
    height: 100%;
}
.iconMain {
    padding-top: rem(50px);
}
.icon_paidui {
    display: block;
    width: rem(200px);
    margin: 0 auto;
    color: var(--primary);
    font-size: rem(200px);
    opacity: 0.8;
}
.title {
    padding-top: rem(30px);
    font-size: rem(50px);
    text-align: center;
}
.desc {
    padding-top: rem(30px);
    color: var(--mutedColor);
    font-size: rem(30px);
    line-height: 1.5;
    text-align: center;
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btn {
        @include active();
        width: 100%;
        height: rem(100px);
        color: var(--color);
        font-size: rem(28px);
        text-align: center;
        background: var(--bgColor);
    }
}
</style>
