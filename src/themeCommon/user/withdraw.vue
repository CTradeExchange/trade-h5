<template>
    <div class='pageWrap'>
        <Top
            back
            left-icon='arrow-left'
            :menu='false'
            :right-action='rightAction'
            :show-center='true'
            @rightClick='$router.push({ path: "/withdrawRecord" })'
        />
        <Loading :show='loading' />
        <div class='wrap'>
            <p class='header-text'>
                取款金额
            </p>
            <div class='field-wrap'>
                <input v-model='amount' placeholder='请输入取款金额' type='number' />
                <van-button class='get-btn' plain round size='small' @click='getAll'>
                    全部取出
                </van-button>
            </div>
            <div class='notice'>
                <span>最大可取 {{ withdrawConfig.withdrawAmount }} 美元</span>
                <span>手续费 {{ fee }} 美元</span>
            </div>
            <div class='bank-wrap'>
                <p class='bw-t'>
                    收款银行卡
                </p>
                <div v-if='bankList.length > 0' class='bank' @click='openSheet'>
                    <i class='bank-icons-sm' :class="'bk-'+ checkedBank.bankCode"></i>
                    <span class='bank-no'>
                        {{ checkedBank.bankName }} {{ hideMiddle(checkedBank.bankCardNumber) }}
                    </span>
                    <van-icon name='arrow-down' />
                </div>
                <div v-else class='bank no-data'>
                    <span>暂无银行卡</span>
                    <van-button plain round size='mini' type='success' @click='toAddBank'>
                        去添加
                    </van-button>
                </div>
                <p class='bw-t2'>
                    预计到账 {{ amount }}美元
                </p>
            </div>
        </div>
    </div>

    <van-button block class='confirm-btn' type='primary' @click='confirm'>
        <span>确定</span>
    </van-button>
    <van-action-sheet v-model:show='show' :round='false' title='选择收款银行卡'>
        <div class='bank-list'>
            <div v-for='(item, index) in bankList' :key='index' class='bank' @click='chooseBank(item)'>
                <i class='bank-icons-sm' :class="'bk-'+ item.bankCode"></i>
                <span class='bank-no'>
                    {{ item.bankName }} {{ hideMiddle(item.bankCardNumber) }}
                </span>
                <van-icon v-if='item.checked' class='icon-success' color='#53C51A' name='success' />
            </div>
            <div class='add-bank' @click='toAddBank'>
                <van-icon class='icon-plus' name='plus' size='13' />
                <span> 新增银行卡</span>
                <van-icon class='icon-arrow' name='arrow' size='13' />
            </div>
        </div>
    </van-action-sheet>
    <van-dialog
        v-model:show='withdrawSuccess'
        class-name='add-success'
        confirm-button-text='返回首页'
        show-cancel-button='false'
        @confirm='$router.push("/quote")'
    >
        <i class='icon_success'></i>
        <p class='title'>
            提交成功
        </p>
        <p class='content'>
            提交成功，等待客服审核
        </p>
    </van-dialog>
</template>

<script>
import Top from '@/components/top'
import {
    reactive,
    computed,
    toRefs,
    onBeforeMount,
    watchEffect
} from 'vue'
import { useRouter } from 'vue-router'
import { Toast, Dialog } from 'vant'
import { isEmpty } from '@/utils/util'
import { useStore } from 'vuex'
import { handleWithdraw, queryWithdrawConfig, queryWithdrawRate, queryBankList, computeWithdrawFee, checkKycApply } from '@/api/user'
export default {
    components: {
        Top
    },
    setup (props) {
        const store = useStore()
        const router = useRouter()
        // const route = useRoute()
        const rightAction = {
            title: '取款记录'
        }

        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            amount: '',
            fee: 0,
            loading: false,
            show: false,
            maxAmount: 5005.55,
            checkedBank: {
                // icon: require('../../assets/logo.png'),
                // bankName: '招商银行',
                // bankNo: '6388 **** **** 1222'
            },
            withdrawRate: '',
            withdrawConfig: '',
            bankList: [],
            fun: null,
            withdrawSuccess: false
        })

        const getWithdrawFee = (amount) => {
            const params = {
                customerNo: customInfo.value.customerNo, // 客户编号
                accountId: customInfo.value.accountId, // 账户ID
                customerGroupId: customInfo.value.customerGroupId, // 客户组ID
                accountCurrency: customInfo.value.currency, // 账户货币编码
                amount: parseFloat(state.amount)
            }
            state.fee = '计算中...'
            computeWithdrawFee(params).then(res => {
                if (res.check()) {
                    state.fee = res.data
                } else {
                    state.fee = ''
                }
            })
        }

        const debounceFn = () => {
            if (!isEmpty(state.amount)) {
                return setTimeout(getWithdrawFee, 1000)
            }
        }

        /* 防抖 */
        watchEffect((onInvalidate) => {
            const timer = debounceFn()// 再重新生成定时器
            console.log('change', state.amount)
            onInvalidate(() => { // watchEffect里面先执行这个函数，即是清除掉之前的定时器
                clearTimeout(timer)
            })
        })

        const openSheet = () => {
            state.show = true
        }

        // 选择银行卡
        const chooseBank = (item) => {
            state.checkedBank = item
            state.bankList.map(item => { item.checked = false })
            item.checked = true
            state.show = false
        }

        const toAddBank = () => {
            router.push('/addBank')
        }

        // 全部取出
        const getAll = () => {
            state.amount = state.withdrawConfig.withdrawAmount
        }

        const confirm = () => {
            if (!state.withdrawConfig.enableWithdraw) {
                return Toast('该用户暂不可取款')
            }

            if (state.amount <= 0) {
                state.amount = 0
                return Toast('请输入正确的金额')
            }

            if (isEmpty(state.checkedBank)) {
                return Toast('请选择取款银行卡')
            }

            if (parseFloat(state.amount) < parseFloat(state.withdrawConfig.withdrawAmountConfig.singleLowAmount)) {
                return Toast(`取款金额不能小于${state.withdrawConfig.withdrawAmountConfig.singleLowAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmountConfig.singleHighAmount)) {
                return Toast(`取款金额不能大于${state.withdrawConfig.withdrawAmountConfig.singleHighAmount}`)
            }

            if (parseFloat(state.amount) > parseFloat(state.withdrawConfig.withdrawAmount)) {
                return Toast('余额不足')
            }
            state.loading = true

            const params = {
                customerNo: customInfo.value.customerNo, // 客户编号
                accountId: customInfo.value.accountId, // 账户ID
                customerGroupId: customInfo.value.customerGroupId, // 客户组ID
                accountCurrency: customInfo.value.currency, // 账户货币编码
                withdrawCurrency: state.withdrawRate.withdrawCurrency, // 收款货币
                amount: state.amount, // 提案金额
                rate: state.withdrawRate.exchangeRate, // 发送给平台CATS2使用的取款汇率
                withdrawRateSerialNo: state.withdrawRate.withdrawRateSerialNo, // 取款费率流水号
                bankAccountName: state.checkedBank.bankAccountName, // 银行卡持有者姓名
                bankName: state.checkedBank.bankName, // 银行卡银行名称
                bankCardNo: state.checkedBank.bankCardNumber, // 银行卡号
                country: 'IOS_3166_156' // country
            }

            handleWithdraw(params).then(res => {
                state.loading = false
                if (res.check()) {
                    console.log('res', res)
                    state.amount = ''
                    state.withdrawSuccess = true
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 获取取款汇率
        const getWithdrawRate = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                accountCurrency: customInfo.value.currency,
                withdrawCurrency: 'CNY', // 暂时只支持CNY
            }
            queryWithdrawRate(params).then(res => {
                if (res.check()) {
                    state.withdrawRate = res.data
                } else {
                    Toast(res.msg)
                }
            })
        }

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: customInfo.value.currency // 账户货币编码
            }

            queryWithdrawConfig(params).then(res => {
                if (res.check()) {
                    state.withdrawConfig = res.data
                } else {
                    Toast(res.msg)
                }
            })
        }

        const getBankList = () => {
            state.loading = true
            queryBankList().then(res => {
                console.log(res)
                state.loading = false
                if (res.check()) {
                    if (res.data && res.data.length > 0) {
                        state.bankList = res.data
                        state.checkedBank = res.data[0]
                    } else {
                        Dialog.confirm({
                            title: '提示',
                            message: '暂无银行卡，是否去添加?',
                        }).then(() => {
                            router.push('/addBank')
                        }).catch(() => {
                        })
                    }
                }
            }).catch(err => {
                state.loading = false
            })
        }

        // 处理银行卡号显示
        const hideMiddle = (value) => {
            return `${value.substring(0, 4)} ${'*'.repeat(value.length - 8).replace(/(.{4})/g, '$1 ')}${value.length % 4 ? ' ' : ''}${value.slice(-4)}`
        }

        const checkKyc = () => {
            checkKycApply({
                businessCode: 'withdraw'
            }).then(res => {

            }).catch(err => {
                console.log(err)
            })
        }

        onBeforeMount(() => {
            // 检测kyc是否通过
            checkKyc()
            // 获取取款配置
            getWithdrawConfig()
            // 获取取款汇率
            getWithdrawRate()
            // 获取银行卡列表
            getBankList()
        })

        return {
            rightAction,
            ...toRefs(state),
            openSheet,
            chooseBank,
            getAll,
            toAddBank,
            confirm,
            customInfo,
            hideMiddle,
            getWithdrawFee
        }
    }

}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrap {
    position: relative;
    height: 100%;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: rem(40px) rem(30px);
    }
    .pageTitle {
        margin-bottom: rem(10px);
        font-weight: normal;
        font-size: rem(50px);
    }
    .wrap {
        padding: 0 rem(30px);
        .header-text {
            margin-top: rem(46px);
            margin-bottom: rem(73px);
            color: var(--color);
            font-size: rem(28px);
        }
        .field-wrap {
            display: flex;
            padding-bottom: rem(18px);
            border-bottom: solid 1px var(--bdColor);
            input {
                flex: 1;
            }
            .get-btn{

            }
        }
        .notice {
            display: flex;
            margin-top: rem(30px);
            margin-bottom: rem(40px);
            span {
                flex: 1;
                color: var(--assistColor);
                font-size: rem(24px);
            }
        }
        .bank-wrap {
            margin-top: rem(20px);
            .bw-t {
                color: var(--color);
                font-size: rem(28px);
                line-height: rem(72px);
            }
            .bw-t2 {
                color: var(--assistColor);
                font-size: rem(24px);
                line-height: rem(60px);
            }
        }
    }
}
.confirm-btn {
    position: absolute;
    bottom: 0;
    background: var(--bdColor);
    border-color: var(--bdColor);
    span {
        color: var(--color);
        font-size: rem(34px);
    }
}
.bank {
    display: flex;
    align-items: center;
    border: rem(2px) solid #E5E5E5;
    border-radius: rem(4px);
    .bank-no {
        flex: 1;
    }
    .bank-icons-sm {
        margin: rem(30px);
    }
    .van-icon {
        margin-right: rem(20px);
    }
    &.no-data {
        justify-content: center;
        line-height: rem(90px);
        span {
            margin-right: rem(20px);
            vertical-align: middle;
        }
        .van-button {
            padding: 0 rem(20px);
            vertical-align: middle;
        }
    }
}
.bank-list .bank {
    border-color: var(--bdColor);
    border-style: solid;
    border-width: 0 0 1px;
}
.add-bank {
    display: flex;
    align-items: center;
    height: rem(96px);
    .icon-plus {
        margin: rem(20px) rem(45px);
        vertical-align: middle;
    }
    span {
        flex: 1;
        vertical-align: middle;
    }
    .icon-arrow {
        margin-right: rem(30px);
    }
}

</style>

<style lang="scss">
@import '@/sass/mixin.scss';
.add-success {
    padding: rem(30px) rem(30px) 0 rem(30px);
    text-align: center;
    .icon_success {
        color: var(--success);
        font-size: rem(96px);
    }
    .title {
        line-height: rem(80px);
    }
    .content {
        margin: rem(20px) 0;
        color: var(--mutedColor);
        font-size: rem(28px);
    }
}
</style>
