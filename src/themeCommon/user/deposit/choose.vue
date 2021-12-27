<template>
    <div class='page-wrap'>
        <!-- 头部导航栏 -->
        <LayoutTop
            :custom-style='{
                "background": $style.bgColor
            }'
            :title='$t("trade.desposit")'
        />
        <!-- 页面加载状态 -->
        <Loading :show='loading' />
        <!-- 页面内容 -->
        <div class='page-content'>
            <!-- 资产账户 -->
            <div class='asset-account'>
                <h3 class='title'>
                    {{ $t('deposit.assetAccount') }}
                </h3>
                <div class='action-bar' @click='pickerShow = true'>
                    <div v-if='accountInfo' class='left'>
                        <img alt='' class='icon' :src='getCurrencyIcon(accountInfo.currency)' srcset='' />
                        <div class='name'>
                            <p class='t1'>
                                {{ accountInfo?.currency }}
                            </p>
                            <p class='t2'>
                                {{ accountInfo?.fullName }}
                            </p>
                        </div>
                    </div>
                    <div v-else class='left'>
                        <img alt='' class='icon' src='../../../assets/currency_icon/all.png' srcset='' />
                        <div class='name'>
                            <p class='t1'>
                                {{ $t('deposit.chooseCurrency') }}
                            </p>
                        </div>
                    </div>

                    <van-icon name='arrow' />
                </div>
            </div>
            <!-- 充值操作 -->
            <div class='recharge-handle'>
                <h3 class='title'>
                    {{ $t('deposit.rechargeWay') }}
                </h3>
                <div class='recharge-way'>
                    <div :class="['item', { 'active': way === 1, 'disable': disable || directDisable }]" @click='switchDirect'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <i class='icon icon_zhichong'></i>
                        <div class='text'>
                            <span class='name'>
                                {{ $t('deposit.direct') }}
                            </span>
                            <span class='des'>
                                {{ $t('deposit.directDes') }}
                            </span>
                        </div>
                    </div>
                    <div :class="['item', { 'active': way === 2, 'disable': disable || exchangeDisable }]" @click='switchExchange'>
                        <div class='check'>
                            <van-icon color='#fff' name='success' />
                        </div>
                        <i class='icon icon_huidui'></i>
                        <div class='text'>
                            <span class='name'>
                                {{ $t('deposit.exchange') }}
                            </span>
                            <span class='des'>
                                {{ $t('deposit.exchangeDes') }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class='btn-wrap'>
            <div :class="['recharge-btn', { 'disable': disable }]" @click='goRecharge'>
                <span>{{ $t('deposit.immediateRecharge') }}</span>
                <van-icon class='arrow' name='arrow' />
            </div>
        </div>
    </div>

    <!-- 资产列表 -->
    <assetsList
        v-if='pickerShow'
        :currency='accountInfo?.currency'
        :show='pickerShow'
        :trade-type='tradeType'
        @update:currency='onCurrencyConfirm'
        @update:show='updatePopupVis'
    />
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { queryPayType } from '@/api/user'
import { localSet } from '@/utils/util'
import { Toast, Dialog } from 'vant'
import assetsList from '@/themeCommon/components/assetsList/assetsList.vue'
export default {
    components: {
        assetsList
    },
    setup () {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            // 页面加载状态
            loading: false,
            // 玩法类型
            tradeType: route.query.tradeType,
            // 支付通道列表
            paymentTypes: [],
            // 当前选中币中账户
            accountInfo: '',
            // 当前选中充值方式 1.直充 2.汇兑
            way: '',
            // 是否禁用所有按钮
            disable: true,
            // 直充是否禁用
            directDisable: true,
            // 汇兑是否禁用
            exchangeDisable: true,
            // 当前直充支付通道
            paymentInfo: '',
            pickerShow: false,
            selectedCurrency: ''
        })
        const style = computed(() => store.state.style)
        // 客户信息
        const customerInfo = computed(() => store.state._user.customerInfo)

        // 获取支付通道
        const getPayTypes = () => {
            const accountInfo = state.accountInfo
            const params = {
                tradeType: state.tradeType,
                companyId: customerInfo.value.companyId,
                customerNo: customerInfo.value.customerNo,
                customerGroupId: customerInfo.value.customerGroupId,
                country: customerInfo.value.country,
                clientType: 'mobile',
                accountCurrency: accountInfo.currency,
                accountId: accountInfo.accountId
            }
            queryPayType(params).then(res => {
                if (res.check()) {
                    state.paymentTypes = res.data
                    filterPayment()
                } else {
                    state.paymentTypes = []
                    filterPayment()
                }
            })
        }

        // 过滤支付通道数据
        const filterPayment = () => {
            const paymentTypes = state.paymentTypes
            if (paymentTypes.length === 0) {
                state.disable = true
                state.way = ''
            } else {
                state.disable = false
                state.directDisable = true
                state.exchangeDisable = true
                paymentTypes.map(elem => {
                    // 直充
                    if (elem.rechargeType?.indexOf('1') !== -1) {
                        state.directDisable = false
                        if (!state.paymentInfo) state.paymentInfo = elem
                    }
                    // 汇兑
                    if (elem.rechargeType?.indexOf('2') !== -1) {
                        state.exchangeDisable = false
                    }
                })
                // 设置默认选中充值方式
                state.way = state.directDisable ? 2 : 1
            }
        }

        // 充值方式切换为直充
        const switchDirect = () => {
            if (state.disable || state.directDisable) return
            state.way = 1
        }

        // 充值方式切换汇兑
        const switchExchange = () => {
            if (state.disable || state.exchangeDisable) return
            state.way = 2
        }

        // 跳转到充值页面
        const goRecharge = () => {
            switch (state.way) {
                // 跳转到直充页面
                case 1:
                    localSet('paymentInfo', JSON.stringify(state.paymentInfo))
                    router.push({
                        path: '/depositDirect',
                        query: {
                            currency: state.accountInfo.currency,
                            paymentCode: state.paymentInfo.paymentCode
                        }
                    })
                    break
                // 跳转到汇兑页面
                case 2:
                    router.push({
                        path: '/deposit',
                        query: {
                            tradeType: state.tradeType,
                            currency: state.accountInfo.currency,
                            accountId: state.accountInfo.accountId
                        }
                    })
                    break
            }
        }

        const onCurrencyConfirm = val => {
            state.accountInfo = val
            // 获取支付通道
            getPayTypes()
            state.pickerShow = false
        }
        const updatePopupVis = val => {
            state.pickerShow = val
        }
        const getCurrencyIcon = (currency) => {
            try {
                return require('@/assets/currency_icon/' + currency + '.png')
            } catch (error) {
                return require('@/assets/currency_icon/default.png')
            }
        }
        const bgColor = style.value.primary + '0D'

        return {
            ...toRefs(state),
            switchDirect,
            switchExchange,
            goRecharge,
            updatePopupVis,
            onCurrencyConfirm,
            getCurrencyIcon,
            bgColor
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: rem(110px);
}
.page-content {
    flex: 1;
    overflow-y: auto;
    position: relative;
    padding: 0 rem(30px);

}
// 资产账户
.asset-account {

    margin-top: rem(30px);
    .title {
        line-height: 1;
        margin-bottom: rem(32px);
        font-size: rem(48px);
        font-weight: normal;
        color: var(--color);
    }
    .action-bar{
        background: var(--contentColor);
        margin-bottom: rem(80px);
        border-radius: rem(10px);
        padding: 0 rem(30px);
        height: rem(110px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--color);
        .left{
            display: flex;
            align-items: center;
            .icon{
                width: rem(48px);
                height: rem(48px);
                margin-right: rem(20px);
                vertical-align: middle;

            }
            .name{
                .t1{
                    font-size: rem(32px);
                    vertical-align: middle;
                }
                .t2{
                    color: var(--minorColor);
                }
            }

        }
        .van-icon{
            color: var(--minorColor);
        }
    }
    .list {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            display: flex;
            align-items: center;
            width: rem(330px);
            height: rem(110px);
            margin-bottom: rem(30px);
            padding-left: rem(30px);
            background: var(--contentColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            img {
                width: rem(48px);
                height: rem(48px);
                margin-right: rem(20px);
                background: var(--assistColor);
                border-radius: 50%;
            }
            .text {
                display: flex;
                flex-direction: column;
                .name {
                    font-size: rem(32px);
                    color: var(--color);
                }
                .alias {
                    margin-top: rem(4px);
                    font-size: rem(24px);
                    color: var(--minorColor);
                }
            }
        }
        .active {
            background: v-bind(bgColor);
            border: 1px solid var(--primary);
            position: relative;
            .check {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                position: absolute;
                top: -1px;
                right: -1px;
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
    }
}
// 充值操作
.recharge-handle {
    margin-top: rem(80px);
    .title {
        line-height: 1;
        margin-bottom: rem(32px);
        font-size: rem(48px);
        font-weight: normal;
        color: var(--color);
    }
    .recharge-way {
        .item {
            display: flex;
            align-items: center;
            height: rem(130px);
            margin-bottom: rem(30px);
            padding: 0 rem(36px);
            background: var(--contentColor);
            border: 1px solid transparent;
            border-radius: rem(10px);
            position: relative;
            &:last-of-type {
                margin-bottom: 0;
            }
            .check {
                display: none;
            }
            .icon {
                margin-right: rem(36px);
                font-size: rem(40px);
                color: var(--color);
            }
            .text {
                display: flex;
                flex-direction: column;
                .name {
                    font-size: rem(32px);
                    color: var(--color);
                }
                .des {
                    margin-top: rem(4px);
                    font-size: rem(24px);
                    color: var(--minorColor);
                }
            }
        }
        .active {
            background: v-bind(bgColor);
            border: 1px solid var(--primary);
            .check {
                display: flex;
                justify-content: center;
                align-items: center;
                width: rem(30px);
                height: rem(30px);
                background: var(--primary);
                border-radius: 0 rem(10px) 0 rem(10px);
                position: absolute;
                top: -1px;
                right: -1px;
                &:deep(.van-icon) {
                    margin-top: rem(-5px);
                }
            }
        }
        .disable {
            background: var(--lineColor);
            opacity: .5;
        }
    }

}
.btn-wrap{
    padding: 0 rem(30px);
    position: absolute;
    bottom: rem(30px);
    width: 100%;
    .recharge-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: rem(80px);
        background: var(--primary);
        border-radius: rem(6px);
        span {
            margin-right: rem(10px);
            font-size: rem(30px);
            color: #fff;
        }
        .arrow {
            margin-top: rem(-6px);
            font-size: rem(30px);
            color: #fff;
        }
        &.disable {
            opacity: .5;
        }
    }
}

</style>
