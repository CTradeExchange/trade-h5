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
                <div v-for='(item,index) in amountList' :key='index' class='amount-item' :class='{ active: currIndex === index }' @click='checkAmount(index,item.amount)'>
                    <p class='t1'>
                        {{ item.amount }}美元
                    </p>
                    <p class='t2'>
                        赠送${{ item.present }}
                    </p>
                </div>
                <div class='amount-item' :class='{ active: currIndex === 99 }' @click='openOtherMoney'>
                    其它金额
                </div>
            </div>
            <div v-show='otherAmountVis' class='other-money'>
                <input v-model='amount' class='input-amount' placeholder='请输入金额' type='number' />
                <span class='label-amount'>
                    美元
                </span>
            </div>
            <div class='pay-wrap'>
                <p class='bw-t'>
                    请选择支付方式
                </p>

                <div class='pay-item'>
                    <div v-if='PayTypes.length > 0' class='pay-type' @click='openSheet'>
                        <img alt='' :src='checkedType.icon' srcset='' />
                        <span class='pay-name'>
                            {{ checkedType.paymentCode }}
                        </span>
                        <van-icon name='arrow-down' />
                    </div>
                    <div v-else class='pay-type no-data'>
                        暂无可用的支付通道
                    </div>
                    <p class='notice'>
                        <span class='left-val'>
                            存款时间 : {{ checkedType.startTime }} - {{ checkedType.endTime }}
                        </span>
                        <span class='right-val'>
                            金额限制 : {{ checkedType.singleLowAmount }} - {{ checkedType.singleHighAmount }} USDT
                        </span>
                    </p>
                </div>
            </div>

            <div class='pay-info'>
                <div class='pi-item'>
                    预计支付 {{ amount }} USDT
                </div>
                <div class='pi-item'>
                    预计到账 54美元
                </div>
                <div class='line'></div>
                <div class='pi-item'>
                    赠送金额 5美元
                </div>
                <div class='pi-item'>
                    手续费 {{ checkedType.fee }}美元
                </div>
            </div>
        </div>
    </div>
    <van-button block class='next-btn' type='primary' @click='next'>
        <span>下一步</span>
    </van-button>

    <van-action-sheet v-model:show='typeShow' round='false' title='选择支付方式'>
        <div class='pay-list'>
            <div v-for='(item,index) in PayTypes' :key='index' class='pay-type' @click='choosePayType(item)'>
                <img alt='' :src='item.icon' srcset='' />
                <span class='pay-name'>
                    {{ item.paymentCode }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
        </div>
    </van-action-sheet>
</template>

<script>
import Top from '@/components/top'
import { onBeforeMount, reactive, ref, computed, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { queryPayType, queryDepositExchangeRate, handleDesposit } from '@/api/user'
import { useStore } from 'vuex'
import { Toast } from 'vant'
export default {
    components: {
        Top
    },
    setup (props) {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
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

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

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
            amount: 50,
            typeShow: false,
            PayTypes: [],
            checkedType: '',
            rateConfig: ''

        })

        const checkAmount = (index, amount) => {
            state.otherAmountVis = false
            state.currIndex = index
            state.amount = amount
        }

        const toDespositList = () => {
            router.push({ path: '/despositRecord' })
        }
        const openSheet = () => {
            state.typeShow = true
        }

        const choosePayType = (item) => {
            state.checkedType = item
            payTypeList.map(item => { item.checked = false })
            item.checked = true
            state.typeShow = false
        }

        const openOtherMoney = () => {
            state.otherAmountVis = !state.otherAmountVis
            state.amount = ''
            state.currIndex = 99
        }

        // 获取支付通道
        const getPayTypes = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                customerGroupId: customInfo.value.customerGroupId,
                clientType: 'mobile',
                paymentCurrency: 'CNY', // 暂时只支持CNY
                accountCurrency: customInfo.value.currency,
            }
            queryPayType(params).then(res => {
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        state.PayTypes = res.data
                        state.checkedType = state.PayTypes[0]
                    }
                } else {
                    Toast(res.msg)
                }
            })
        }

        // 获取存款货币对汇率
        const getDepositExchangeRate = () => {
            const param = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                accountCurrency: customInfo.value.currency,
                paymentCurrency: 'CNY', // 暂时只支持CNY
            }
            queryDepositExchangeRate(param).then(res => {
                if (res.check()) {
                    state.rateConfig = res.data
                } else {
                    Toast(res.msg)
                }
            })
        }

        const next = () => {
            if (!state.amount) {
                return Toast('请输入存款金额')
            }
            if (Number(state.amount) < Number(state.checkedType.singleLowAmount)) {
                return Toast(`存款金额不能小于${state.checkedType.singleLowAmount}`)
            }
            if (Number(state.amount > Number(state.checkedType.singleHighAmount))) {
                return Toast(`存款金额不能大于${state.checkedType.singleHighAmount}`)
            }

            // companyId	Long	必填	公司ID
            // customerNo	String	必填	客户编号
            // accountId	Long	必填	账户ID
            // customerGroupId	Long	必填	客户组id
            // depositRateSerialNo	String	必填	存款费率流水号
            // paymentCurrency	String	必填	存款货币编码
            // accountCurrency	String	必填	账户货币编码
            // exchangeRate	BigDecimal	选填	汇率
            // paymentChannelCode	String	必填	支付渠道编码
            // paymentChannelClientType	String	必填	支付通道客户端类型pc、mobile
            // depositAmount	BigDecimal	必填	账户存款金额,币种类型和账户币种一致
            // country	String	必填	国家(客户账号开户所属国家)
            // channelCode	String	必填	广告来源(客户账号开户渠道编码)
            // depositFrom	String	必填	存款来源,取值H5、H5_Android、H5_IOS、PCUI_Windows、PCUI_Mac、APP_Android、APP_IOS
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                depositRateSerialNo: state.rateConfig.depositRateSerialNo,
                paymentCurrency: state.rateConfig.paymentCurrency,
                accountCurrency: state.rateConfig.accountCurrency,
                exchangeRate: state.rateConfig.exchangeRate,
                paymentChannelCode: state.checkedType.paymentCode,
                paymentChannelClientType: 'mobile',
                depositAmount: state.amount,
                country: 'IOS_3166_156',
                channelCode: '1',
                depositFrom: 'h5'
            }
            handleDesposit(params).then(res => {
                if (res.check()) {
                    if (res.data.browserOpenUrl) {
                        window.open(res.data.browserOpenUrl)
                    }
                } else {
                    Toast(res.msg)
                }
            })
        }

        onBeforeMount(() => {
            getPayTypes()
            getDepositExchangeRate()
        })

        return {
            rightAction,
            amountList,
            checkAmount,
            toDespositList,
            openSheet,
            ...toRefs(state),
            payTypeList,
            choosePayType,
            openOtherMoney,
            getDepositExchangeRate,
            next
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    background-color: #F6F6F6;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .wrap {
        background-color: var(--bgColor);
        .header-text {
            padding: rem(46px) rem(30px) rem(40px) rem(30px);
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
            padding: 0 rem(30px);
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
            padding: 0 rem(30px) rem(35px) rem(30px);
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
            padding: 0 rem(30px);
            border-top: solid rem(20px) var(--btnColor);
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
    }
    .pay-info {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        margin-top: rem(20px);
        padding: 0 rem(30px);
        background-color: #FFF;
        border-top: solid rem(20px) var(--btnColor);
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
.pay-type {
    display: flex;
    align-items: center;
    justify-content: center;
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
    &.no-data {
        line-height: rem(80px);
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
