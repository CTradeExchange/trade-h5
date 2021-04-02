<template>
    <div class='pageWrap'>
        <Top back :menu='false' :right-action='rightAction' @rightClick='toWithdrawList' />
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
                <span>最大可取 {{ maxAmount }} 美元</span>
                <span>手续费 0.10美元</span>
            </div>
            <div class='bank-wrap'>
                <p class='bw-t'>
                    收款银行卡
                </p>
                <div class='bank' @click='openSheet'>
                    <img alt='' :src='checkedBank.icon' srcset='' />
                    <span class='bank-no'>
                        {{ checkedBank.bankName }} {{ checkedBank.bankNo }}
                    </span>
                    <van-icon name='arrow-down' />
                </div>
                <p class='bw-t2'>
                    预计到账 54美元
                </p>
            </div>
        </div>
    </div>

    <van-button block class='confirm-btn' type='primary' @click='confirm'>
        <span>确定</span>
    </van-button>
    <van-action-sheet v-model:show='show' round='false' title='选择收款银行卡'>
        <div class='bank-list'>
            <div v-for='(item, index) in bankList' :key='index' class='bank' @click='chooseBank(item)'>
                <img alt='' :src='item.icon' srcset='' />
                <span class='bank-no'>
                    {{ item.bankName }} {{ item.bankNo }}
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
</template>

<script>
import Top from '@/components/top'
import {
    reactive, ref, computed, toRefs, onMounted,
    onBeforeMount,
    onBeforeUpdate,
    onUpdated,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { handleWithdraw, queryWithdrawConfig, queryWithdrawRate } from '@/api/user'
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
            amount: 0,
            show: false,
            maxAmount: 5005.55,
            checkedBank: {
                icon: require('../../assets/logo.png'),
                bankName: '招商银行',
                bankNo: '6388 **** **** 1222'
            },
            bankList: [
                {
                    icon: require('../../assets/logo.png'),
                    bankName: '招商银行',
                    bankNo: '6388 **** **** 1222',
                    checked: false
                },
                {
                    icon: require('../../assets/logo.png'),
                    bankName: '建设银行',
                    bankNo: '6225 **** **** 4443',
                    checked: false
                },
                {
                    icon: require('../../assets/logo.png'),
                    bankName: '工商银行',
                    bankNo: '6225 **** **** 1543',
                    checked: false
                }
            ]
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

        const toWithdrawList = () => {
            router.push({ path: '/withdrawRecord' })
        }

        const toAddBank = () => {
            router.push('/addBank')
        }

        // 全部取出
        const getAll = () => {
            state.amount = state.maxAmount
        }

        const confirm = () => {
            if (state.amount <= 0) {
                return Toast('请输入正确的金额')
            }
            handleWithdraw({
                aaa: 111
            }).then(res => {
                Toast(res)
                console.log('res', res)
            })
        }

        console.log('1-开始创建组件-----setup()')

        onBeforeMount(() => {
            getWithdrawConfig()
            console.log('2-组件挂载到页面之前执行-----onBeforeMount()')
        })

        onMounted(() => {
            console.log('3-组件挂载到页面之后执行-----onMounted()')
        })

        onBeforeUpdate(() => {
            console.log('4-组件更新之前-----onBeforeUpdate()')
        })

        onUpdated(() => {
            console.log('5-组件更新之后-----onUpdated()')
        })

        // 获取取款限制配置
        const getWithdrawConfig = () => {
            // companyId 公司ID
            // customerNo 客户编号
            // accountId 账户ID
            // customerGroupId 客户组ID
            // accountCurrency 账户货币编码

            const params = {
                customerNo: customInfo.value.customerNo,
                accountId: customInfo.value.accountId,
                customerGroupId: customInfo.value.customerGroupId,
                accountCurrency: customInfo.value.currency
            }
            debugger
            queryWithdrawConfig(params).then(res => {
                console.log(res)
                if (res.check()) {

                } else {
                    Toast(res.msg)
                }
            })
        }

        return {
            rightAction,
            toWithdrawList,
            ...toRefs(state),
            openSheet,
            chooseBank,
            getAll,
            toAddBank,
            confirm,
            getWithdrawConfig,
            customInfo
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
    img {
        width: rem(55px);
        height: rem(55px);
        margin: rem(20px) rem(30px);
    }
    .van-icon {
        margin-right: rem(20px);
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
