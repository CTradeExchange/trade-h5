<template>
    <div class='pageWrap'>
        <Top back :menu='false' :right-action='rightAction' @rightClick='toWithdrawList' />
        <div class='wrap'>
            <p class='header-text'>
                请选择充值金额
            </p>
            <div class='amount-list'>
                <div v-for='(item,index) in amountList' :key='index' class='amount-item' :class='{ active: currIndex === index }' @click='checkAmount(index)'>
                    <p class='t1'>
                        {{ item.amount }}美元
                    </p>
                    <p class='t2'>
                        赠送${{ item.present }}
                    </p>
                </div>
                <div class='amount-item'>
                    其它金额
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Top from '@/components/top'
import { ref } from 'vue'
export default {
    components: {
        Top
    },
    setup (props) {
        const rightAction = {
            title: '取款记录'
        }
        const amountList = [
            {
                amount: 50,
                present: 5
            },
            {
                amount: 100,
                present: 10
            }, {
                amount: 500,
                present: 50
            }, {
                amount: 1000,
                present: 100
            }, {
                amount: 2000,
                present: 200
            }
        ]
        const currIndex = ref(0)

        const checkAmount = (index) => {
            currIndex.value = index
        }
        return {
            rightAction,
            amountList,
            checkAmount,
            currIndex
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .wrap {
        padding: 0 rem(30px);
        .header-text {
            margin-top: rem(46px);
            margin-bottom: rem(40px);
            color: var(--color);
            font-size: rem(28px);
        }
        .amount-list {
            display: flex;
            flex-flow: row wrap;
            flex-wrap: wrap;
            align-content: flex-start;
            align-items: center;
            justify-content: space-between;
            .amount-item {
                display: flex;
                flex: 1;
                flex-basis: rem(30px);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 47%;
                min-width: 47%;
                max-width: 47%;
                height: 50px;
                margin-bottom: rem(30px);
                text-align: center;
                border: rem(2px) solid var(--bdColor);
                border-radius: rem(10px);
                .t1 {
                    color: var(--color);
                    font-size: rem(28px);
                }
                .t2 {
                    color: var(--btnSelected);
                    font-size: rem(20px);
                }
                &.active {
                    border: rem(2px) solid var(--btnSelected);
                }
            }
        }
    }
}
</style>
