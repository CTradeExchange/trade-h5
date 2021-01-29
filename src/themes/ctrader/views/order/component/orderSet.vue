<template>
    <div class='orderSet'>
        <p>交易商品</p>
        <div class='productRow of-1px-bottom'>
            <span class='icon_gou'></span>
            <vueSelect v-model='productListType' :actions='productListTypes' close='取消' value='val' />
        </div>
        <p v-if='type>1' class='priceRow'>
            Bid: 0.76280; Ask: 0.76281
        </p>
        <div class='orderBtns'>
            <button class='item sellColor' :class='{ active:orderType===1 }' @click='orderType=1'>
                卖出
                <p v-if='type===1'>0.76946</p>
            </button>
            <button class='item buyColor' :class='{ active:orderType===2 }' @click='orderType=2'>
                买入
                <p v-if='type===1'>0.76946</p>
            </button>
        </div>
        <p class='tips'>Change: -7.0 (-0.06%); High: 0.77198; Low: 0.76690</p>

        <!-- 交易数量、市场区间 -->
        <div class='configRow'>
            <div class='col'>
                <p class='volumeText'>
                    <span>数量</span>
                    <span>手数</span>
                </p>
                <div class='volumes'>
                    <span class='inputCol of-1px-bottom'><input v-model='volume' class='input' type='text' /></span>
                    <span class='icon_xiala'></span>
                </div>
                <p class='desc'>
                    预计卖盘所需保证金：$25.34
                </p>
                <p class='desc'>
                    Volume: 澳元 20 000.00
                </p>
            </div>
            <div v-if='type===1' class='col'>
                <van-checkbox v-model='marketZone' :checked-color='$store.state.style.primary' shape='square'>市场区间</van-checkbox>
                <div v-if='marketZone' class='marketZonePanel'>
                    <p class='muted'>点数</p>
                    <Steper v-model='dot' class='of-1px-bottom' />
                </div>
            </div>
            <div v-else class='col'>
                <p>开仓价格</p>
                <Steper v-model='dot' class='of-1px-bottom' />
                <p class='error'>买入限价订单的“买入价”必须小于卖出价(0.76711)</p>
                <p class='desc'>距离：-1.5</p>
            </div>
        </div>

        <!-- 过期 -->
        <div class='expireRow'>
            <van-checkbox v-model='expireEnabled' :checked-color='$store.state.style.primary' shape='square'>过期</van-checkbox>
            <template v-if='expireEnabled'>
                <p class='muted mtop20'>选择日期</p>
                <button class='expireButton of-1px-bottom' @click='expirePopup=true'>{{ expireDateText }}</button>
                <van-popup v-model:show='expirePopup' class='expirePopup' position='bottom'>
                    <van-datetime-picker
                        v-model='expireDate'
                        :max-date='maxDate'
                        :min-date='minDate'
                        title=''
                        type='datetime'
                        @cancel='expirePopup=false'
                        @confirm='confirmExpire'
                    />
                </van-popup>
            </template>
        </div>

        <!-- 止盈止损 -->
        <div class='profitLossRow'>
            <div class='col'>
                <van-checkbox v-model='profitEnable' :checked-color='$store.state.style.primary' shape='square'>止损</van-checkbox>
                <div v-if='profitEnable'>
                    <p class='mtop10 muted'>点数</p>
                    <Steper v-model='profitDot' class='of-1px-bottom' />
                    <p class='mtop20 muted'>预计价格</p>
                    <div class='dotAmount of-1px-bottom'>
                        <input v-model='previewProfitPrice' disabled type='text' />
                    </div>
                    <p class='desc'>账户余额：-1.65%</p>
                    <p class='desc'>盈利：$-16.56</p>
                    <p class='mtop10 muted'>触发方向</p>
                    <div class='of-1px-bottom'>
                        <vueSelect v-model='launchTrade' :actions='launchTradeOpts' close='取消' value='val' />
                    </div>
                    <van-checkbox v-model='moveLoss' :checked-color='$store.state.style.primary' class='mtop10' shape='square'>移动止损</van-checkbox>
                </div>
            </div>
            <div class='col'>
                <van-checkbox v-model='lossEnable' :checked-color='$store.state.style.primary' shape='square'>止盈</van-checkbox>
                <div v-if='lossEnable'>
                    <p class='mtop10 muted'>点数</p>
                    <Steper v-model='lossDot' class='of-1px-bottom' />
                    <p class='mtop20 muted'>预计价格</p>
                    <div class='dotAmount of-1px-bottom'>
                        <input v-model='previewLossPrice' disabled type='text' />
                    </div>
                    <p class='desc'>账户余额：-1.65%</p>
                    <p class='desc'>盈利：$-16.56</p>
                </div>
            </div>
        </div>
        <div class='comment'>
            <vInput v-model='comment' clear label='评论' />
        </div>
    </div>
    <div class='footerBtn'>
        <button class='btn'>
            <p class='btnText'>下单</p>
            <p>买入 0.20 手数 of AUDUSD</p>
        </button>
    </div>
</template>

<script>
import vInput from '@ct/components/form/input'
import vueSelect from '@ct/components/select'
import Steper from '@ct/components/steper'
import dayjs from 'dayjs'
export default {
    components: {
        vueSelect,
        vInput,
        Steper
    },
    props: {
        type: {
            type: Number,
            default: 1
        },
    },
    data () {
        return {
            orderType: 1,
            marketZone: true,
            volume: 0.2,
            dot: 0.2,
            profitDot: 0.2,
            lossDot: 0.2,
            productListType: 1,
            productListTypes: [
                { name: 'AUDUSD', val: 1 },
                { name: 'GBPUSD', val: 2 },
                { name: 'USDJPY', val: 3 },
            ],
            profitEnable: true,
            lossEnable: true,
            launchTrade: 1,
            launchTradeOpts: [
                { name: '交易', val: 1 },
                { name: '反向', val: 2 },
                { name: '交易方向', val: 3 },
                { name: '反向两计', val: 4 },
            ],
            moveLoss: false,
            expireEnabled: true,
            comment: '',
            expirePopup: false,
            expireDate: new Date(),
            expireDateConfirm: '',
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
        }
    },
    computed: {
        previewProfitPrice () {
            return 2.3
        },
        previewLossPrice () {
            return 2.3
        },
        expireDateText () {
            return this.expireDateConfirm && dayjs(this.expireDateConfirm).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    mounted () {
        console.log(this.$refs.dotSteper)
    },
    methods: {
        confirmExpire ($val) {
            this.expirePopup = false
            this.expireDateConfirm = $val
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.orderSet {
    padding: rem(40px) rem(30px) rem(120px);
}
.productRow {
    display: flex;
    align-items: center;
    margin-top: rem(40px);
    margin-bottom: rem(50px);
    padding-bottom: rem(10px);
    .icon_gou {
        color: var(--success);
        font-size: rem(34px);
    }
}
.priceRow {
    color: var(--mutedColor);
    font-size: rem(24px);
    text-align: center;
}
.orderBtns {
    display: flex;
    justify-content: space-between;
    margin-top: rem(10px);
    .item {
        width: 48%;
        height: 44px;
        padding: 3px;
        line-height: 1.3;
        text-align: center;
        background: var(--bgColor);
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.18);
        &.active.buyColor {
            background: var(--white);
            border: 1px solid var(--buyColor);
        }
        &.active.sellColor {
            background: var(--white);
            border: 1px solid var(--sellColor);
        }
    }
}
.tips {
    margin-top: rem(30px);
    color: var(--mutedColor);
    font-size: rem(24px);
    text-align: center;
}
.configRow {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: rem(40px);
    .col {
        width: 46%;
    }
    .volumeText {
        display: flex;
        justify-content: space-between;
    }
    .volumes {
        display: flex;
        align-items: center;
        margin-top: rem(20px);
        .inputCol {
            flex: 1;
        }
        .input {
            width: 100%;
            height: rem(55px);
        }
        .icon_xiala {
            width: rem(50px);
            color: var(--mutedColor);
            font-size: rem(26px);
            text-align: right;
        }
    }
    .marketZonePanel {
        margin-top: rem(20px);
    }
}
.desc {
    margin-top: rem(10px);
    color: var(--mutedColor);
    font-size: rem(22px);
}
.error {
    margin-top: rem(10px);
    color: var(--red);
    font-size: rem(22px);
}
.steper {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: rem(10px);
    .inputCol {
        flex: 1;
        input {
            width: 100%;
        }
    }
    .icon {
        padding: rem(10px);
        color: var(--color);
        font-size: rem(38px);
    }
}
.expireRow {
    margin-top: rem(40px);
    .expireButton {
        width: 100%;
        height: 44px;
        margin-top: rem(20px);
        font-size: rem(26px);
        text-align: center;
        background: none;
    }
}
.profitLossRow {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: rem(40px);
    .col {
        width: 46%;
    }
}
.dotAmount {
    margin-top: rem(10px);
    input {
        display: block;
        width: 100%;
        padding: rem(15px) 0;
        color: var(--mutedColor);
        background: none;
    }
}
.comment {
    margin-top: rem(60px);
}
:deep(.expirePopup) {
    position: absolute !important;
}
.footerBtn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    .btn {
        display: block;
        width: 100%;
        height: rem(110px);
        color: var(--white);
        background: var(--primary);
    }
}
</style>
