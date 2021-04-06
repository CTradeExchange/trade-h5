<template>
    <div class='pageWrap'>
        <Top
            back
            left-icon='arrow-left'
            :menu='false'
            :right-action='rightAction'
            show-center='true'
            @rightClick='toDespositList'
        />
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
                <div class='amount-item' @click='otherAmountVis = !otherAmountVis'>
                    其它金额
                </div>
            </div>
            <div v-show='otherAmountVis' class='other-money'>
                <input class='input-amount' placeholder='请输入金额' type='number' />
                <span class='label-amount'>
                    美元
                </span>
            </div>
            <div class='pay-wrap'>
                <p class='bw-t'>
                    请选择支付方式
                </p>
                <div class='pay-type' @click='openSheet'>
                    <img alt='' :src='checkedType.icon' srcset='' />
                    <span class='pay-name'>
                        {{ checkedType.payName }}
                    </span>
                    <van-icon name='arrow-down' />
                </div>
                <p class='notice'>
                    <span class='left-val'>
                        存款时间 : 08:00 - 24:00
                    </span>
                    <span class='right-val'>
                        金额限制 : 50 - 1000 USDT
                    </span>
                </p>
            </div>
            <div class='pay-info'>
                <div class='pi-item'>
                    预计支付 50 USDT
                </div>
                <div class='pi-item'>
                    预计到账 54美元
                </div>
                <div class='line'></div>
                <div class='pi-item'>
                    赠送金额 5美元
                </div>
                <div class='pi-item'>
                    手续费 1美元
                </div>
            </div>
        </div>
    </div>
    <van-button block class='next-btn' type='primary' @click='next'>
        <span>下一步</span>
    </van-button>

    <van-action-sheet v-model:show='typeShow' round='false' title='选择支付方式'>
        <div class='pay-list'>
            <div v-for='(item, index) in payTypeList' :key='index' class='pay-type' @click='choosePayType(item)'>
                <img alt='' :src='item.icon' srcset='' />
                <span class='pay-name'>
                    {{ item.payName }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
        </div>
    </van-action-sheet>
</template>

<script>
import Top from '@/components/top'
import { reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
    components: {
        Top
    },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
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

        const checkedType = {
            icon: require('../../assets/logo.png'),
            payName: 'CoinBridge'
        }

        const payTypeList = [
            {
                icon: require('../../assets/logo.png'),
                payName: 'CoinBridge',
                checked: false
            },
            {
                icon: require('../../assets/logo.png'),
                payName: 'CoinBridge',
                checked: false
            },
            {
                icon: require('../../assets/logo.png'),
                payName: 'CoinBridge',
                checked: false
            }
        ]

        const state = reactive({
            otherAmountVis: false,
            currIndex: 0,
            typeShow: false

        })

        const checkAmount = (index) => {
            state.otherAmountVis = false
            state.currIndex = index
        }

        const toDespositList = () => {
            router.push({ path: '/despositRecord' })
        }
        const openSheet = () => {
            state.typeShow = true
        }

        const choosePayType = (item) => {
            checkedType.value = item
            payTypeList.map(item => { item.checked = false })
            item.checked = true
            state.typeShow = false
        }
        return {
            rightAction,
            amountList,
            checkAmount,
            toDespositList,
            openSheet,
            ...toRefs(state),
            payTypeList,
            checkedType,
            choosePayType
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
html {
    background-color: red;
}
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
        .other-money {
            display: flex;
            margin-top: rem(32px);
            padding-bottom: rem(35px);
            border-bottom: solid 1px var(--bdColor);
            .input-amount {
                flex: 1;
            }
            .label-amount {
                color: var(--color);
                font-size: rem(28px);
            }
        }
        .pay-wrap {
            .bw-t {
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(72px);
            }
            .notice {
                display: flex;
                justify-content: space-between;
                line-height: rem(72px);
                .left-val {
                    color: var(--mutedColor);
                }
                .right-val {
                    color: var(--mutedColor);
                }
            }
        }
        .pay-info {
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            margin-top: rem(20px);
            //border-top: solid rem(20px) var(--btnColor);
            .pi-item {
                flex: 0 0 50%;
                color: var(--mutedColor);
                font-size: rem(24px);
                line-height: rem(96px);
            }
            .line {
                width: 100%;
                height: 1px;
                background-color: var(--btnLine);
            }
        }
    }
}
.pay-type {
    display: flex;
    align-items: center;
    border: rem(2px) solid #E5E5E5;
    border-radius: rem(4px);
    .pay-name {
        flex: 1;
    }
    img {
        width: rem(55px);
        height: rem(55px);
        margin: rem(20px) rem(30px);
    }
    .van-icon {
        margin-right: rem(20px);
    }
}
.pay-list .pay-type {
    border-color: var(--bdColor);
    border-style: solid;
    border-width: 0 0 1px;
}
.next-btn {
    position: fixed;
    bottom: 0;
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}
</style>
