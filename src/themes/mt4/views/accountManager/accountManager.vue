<template>
    <div class='accountManager'>
        <section class='accountBlock'>
            <span class='flag'>
                Demo
            </span>
            <figure class='userFigure'>
                <img alt='' class='face' src='@m/images/face.png' />
                <figcaption>
                    <!-- <p><strong>Cats2.0 H5 Demo</strong></p>
                    <p class='muted'>
                        {{ customInfo.customerNo }} - MetaQuotes-Demo
                    </p>
                    <p class='muted'>
                        Access Point EU 0, 1:100
                    </p>
                    <p class='amount'>
                        {{ mainAccount.balance }} USD
                    </p> -->
                    <p class='account-info'>
                        {{ customInfo.customerNo }} - {{ mainAccount.trade.name }}
                    </p>
                </figcaption>
            </figure>
            <!-- <i class='icon_tishi' @click='show=true'></i> -->
        </section>
        <p class='link'></p>
        <div v-for='(item, index) in accountList' :key='index' class='account-item' @click='handleSwitchAccount(item)'>
            <img alt='' class='face' src='@m/images/face.png' />
            {{ customInfo.customerNo }} - {{ mainAccount.trade.name }}
            <!-- <p>余额： {{ item.balance }}</p>
            <p>可取金额：{{ item.withdrawAmount }}</p>
            <p>锁定金额： {{ item.lockAmount }}</p> -->
        </div>
    </div>
    <van-dialog v-model:show='show' :confirm-button-text="$t('common.sure')" :title='$t("attrs")'>
        <div class='tishiDialog'>
            <p><strong>84769176 - Cats2.0 H5 Demo</strong></p>
            <p class='muted'>
                MetaQuotes Software Corp
            </p>
            <p class='muted'>
                1:100, USD 100 000.00
            </p>
            <p class='muted'>
                access point: Access Point EU 0
            </p>
        </div>
    </van-dialog>
</template>

<script>
import { useStore } from 'vuex'
import { Toast } from 'vant'

import { reactive, toRefs, ref, onBeforeMount, computed } from 'vue'
import { getArrayObj } from '@/utils/util'
export default {
    setup () {
        const store = useStore()
        const show = ref(false)
        // 获取账户信息
        const customInfo = computed(() => store.state._user.customerInfo)
        const tradeTypeList = computed(() => store.state._base.wpCompanyInfo.tradeTypeList)

        const state = reactive({
            mainAccount: {},
            accountList: []
        })

        const handleSwitchAccount = (item) => {
            const toast = Toast.loading({
                message: '加载中...',
                forbidClick: true,
            })
            const params = {
                accountId: item.accountId,
                tradeType: item.tradeType,
                currency: item.currency,
                digits: item.digits
            }
            store.dispatch('_user/switchAccount', params).then(res => {
                toast.clear()
                Toast('目前只有一个玩法，暂时不处理切换账号')
            })
        }

        onBeforeMount(() => {
            const list = customInfo.value.accountList
            list.forEach(item => {
                item.trade = getArrayObj(tradeTypeList.value, 'id', item.tradeType)
                if (item.accountId === customInfo.value.accountId) {
                    state.mainAccount = item
                } else {
                    state.accountList.push(item)
                }
            })
        })

        return {
            customInfo,
            tradeTypeList,
            show,
            handleSwitchAccount,
            ...toRefs(state)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.accountManager {
    position: relative;
    padding-top: rem(10px);
    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: rem(200px);
        background: var(--primary);
        content: '';
    }
    .accountBlock {
        position: relative;
        z-index: 1;
        margin: 0 rem(20px) rem(40px);
        padding: rem(40px);
        overflow: hidden;
        background: var(--white);
        border-radius: rem(10px);
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    }
    .account-item {
        margin: rem(30px);
        padding: rem(30px);
        border: solid 1px var(--bdColor);
        border-radius: rem(15px);
        .face {
            width: rem(80px);
            height: rem(80px);
            margin: 0 auto;
            margin-right: rem(10px);
            vertical-align: middle;
        }
    }
    .link {
        padding-left: rem(30px);
    }
}
.flag {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: rem(180px);
    height: rem(44px);
    color: #FFF;
    font-weight: bold;
    font-size: rem(24px);
    line-height: rem(44px);
    text-align: center;
    text-shadow: #267200 1px 0 0, #267200 0 1px 0, #267200 -1px 0 0, #267200 0 -1px 0;
    background: #4DC90F;
    transform: rotate(45deg) translate(rem(44px), rem(-20px));
}
.icon_tishi {
    position: absolute;
    right: rem(30px);
    bottom: rem(45px);
    font-size: rem(42px);
}
.tishiDialog {
    padding: rem(20px) 0;
    line-height: 1.5;
    text-align: center;
}
.userFigure {
    .face {
        display: block;
        width: rem(80px);
        height: rem(80px);
        margin: 0 auto;
    }
    figcaption {
        padding-top: rem(30px);
        line-height: 1.5;
        text-align: center;
    }
    .amount {
        margin-top: rem(20px);
        color: var(--olor);
        font-size: rem(40px);
    }
}
</style>
