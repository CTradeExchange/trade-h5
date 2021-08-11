<template>
    <div class='orderHandicap'>
        <div class='titleBar'>
            <span class='hd'>
                价格
            </span>
            <span class='ft'>
                数量
            </span>
        </div>
        <div class='priceMultiGear sell'>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
        </div>
        <div class='curPrice'>
            0.0000312
        </div>
        <div class='priceMultiGear buy'>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
            <p class='item'>
                <span class='hd'>
                    0.0000326
                </span>
                <span class='ft'>
                    312654
                </span>
            </p>
        </div>
        <van-popover v-model:show='showPopover' :actions='actions' @select='onSelect'>
            <template #reference>
                <button class='selectBtn'>
                    0.01
                    <i class='icon_arrow'></i>
                </button>
            </template>
        </van-popover>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const state = reactive({
            showPopover: false,
            actions: [
                { text: '选项一' },
                { text: '选项二' },
                { text: '选项三' },
            ],
        })

        // 切换深度报价小数位的长度
        const onSelect = (val) => {
            console.log(val)
        }

        return {
            ...toRefs(state),
            onSelect,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderHandicap {
    .titleBar {
        display: flex;
        justify-content: space-between;
        margin-top: rem(20px);
        color: var(--placeholdColor);
    }
    .priceMultiGear {
        margin-top: rem(20px);
        font-size: rem(24px);
        line-height: rem(40px);
        &.sell {
            color: var(--fallColor);
        }
        &.buy {
            color: var(--riseColor);
        }
        .item {
            display: flex;
            justify-content: space-between;
            .ft {
                color: var(--normalColor);
            }
        }
    }
    .curPrice {
        margin-top: rem(20px);
        font-size: rem(30px);
    }
    .selectBtn {
        position: relative;
        height: rem(40px);
        margin-top: rem(10px);
        padding: 0 rem(60px) 0 rem(15px);
        color: var(--minorColor);
        font-size: rem(22px);
        line-height: 1;
        border-radius: rem(4px);
    }
    .icon_arrow {
        position: absolute;
        top: 8px;
        right: 8px;
        display: inline-block;
        width: 0;
        height: 0;
        border: 5px solid var(--minorColor);
        border-color: var(--minorColor) transparent transparent transparent;
        border-width: 5px 5px 0;
        border-radius: 3px;
    }
}
</style>
