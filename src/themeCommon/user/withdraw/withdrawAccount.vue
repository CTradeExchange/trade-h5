<template>
    <div class='page-wrap'>
        <LayoutTop />
        <div class='page-content'>
            <p class='head-text'>
                {{ $t('withdraw.outAccount') }}
            </p>
            <div class='actionBar' @click='selectCurrency'>
                <span class='currencySpan'>
                    {{ outCurrency }}
                </span>
                <van-icon name='arrow' />
            </div>
            <p class='head-text'>
                {{ $t('withdraw.inAccount') }}
            </p>
            <div class='actionBar' @click='selectInCurrency'>
                <span class='currencySpan'>
                    {{ inCurrency }}
                </span>
                <van-icon name='arrow' />
            </div>

            <div class='footerBtn'>
                <van-button block type='primary' @click='next'>
                    {{ $t('common.nextStep') }}
                </van-button>
            </div>
        </div>
    </div>

    <van-popup v-model:show='outPickerShow' class='assetsPicker' position='bottom'>
        <van-picker
            :columns='columns'
            :columns-field-names='customFieldName'
            :default-index='0'
            :title="$t('withdraw.outAccount')"
            @cancel='outPickerShow = false'
            @confirm='onPickerConfirm'
        />
    </van-popup>

    <van-popup v-model:show='inPickerShow' class='assetsPicker' position='bottom'>
        <van-picker
            :columns='inCurrencyList'
            :columns-field-names='customFieldName'
            :default-index='0'
            :title=" $t('withdraw.inAccount')"
            @cancel='inPickerShow = false'
            @confirm='onInPickerConfirm'
        />
    </van-popup>
</template>

<script>
import { computed, toRefs, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { withdrawCurrencyList } from '@/api/user'

export default {
    setup () {
        const router = useRouter()
        const route = useRoute()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        const state = reactive({
            tradeType: route.query.tradeType,
            outPickerShow: false,
            inPickerShow: false,
            outCurrency: '',
            inCurrency: '',
            inCurrencyList: [],
            withdrawMethod: ''

        })

        const { value: customInfo } = computed(() => store.state._user.customerInfo)
        // 当前币种
        const columns = computed(() => accountList.value.filter(item => item.tradeType === Number(state.tradeType)).map(el => {
            return {
                currency: el.currency,
                accountId: el.accountId
            }
        })
        )

        const accountList = computed(() => store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(state.tradeType)))

        state.outCurrency = columns.value[0].currency
        // 自定义picker字段
        const customFieldName = {
            text: 'currency',
            children: 'cities',
        }

        const onPickerConfirm = val => {
            state.outPickerShow = false
            state.outCurrency = val.currency
        }

        const onInPickerConfirm = val => {
            state.inPickerShow = false
            state.inCurrency = val.currency
        }

        // 显示选币弹窗
        const selectCurrency = val => {
            state.outPickerShow = true
        }

        const selectInCurrency = val => {
            state.inPickerShow = true
        }

        const next = () => {
            router.push({
                path: 'withdraw',
                query: {
                    currency: 'USDT',
                    currentTab: 'coin'
                }
            })
        }

        // 获取到账币种
        withdrawCurrencyList({
            customerGroupId: customInfo.customerGroupId,
            customerNo: customInfo.customerNo
        }).then(res => {
            console.log(res)
            state.currencyList = res.data
            if (res.check() && res.data.length > 0) {
                state.inCurrencyList = res.data.map(el => {
                    return {
                        currency: el.currency,
                        withdrawMethod: el.withdrawMethod
                    }
                })
                state.inCurrency = res.data[0].currency
            }
        }).catch(err => {
            state.loadingMore = false
            state.loading = false
        })

        return {
            accountList,
            columns,
            onPickerConfirm,
            next,
            selectCurrency,
            selectInCurrency,
            onInPickerConfirm,
            customFieldName,
            ...toRefs(state)
        }
    }
}

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    width: 100%;
    height: 100%;
    margin-top: rem(90px);
    overflow: auto;
    background: var(--contentColor);
    .page-content {
        margin-top: rem(20px);
        padding: 0 rem(30px);
        background: var(--contentColor);
        .head-text {
            color: var(--minorColor);
            font-size: rem(28px);
            line-height: rem(90px);
        }
        .actionBar {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: rem(80px);
            margin-bottom: rem(30px);
            padding: 0 rem(30px);
            color: var(--color);
            font-size: rem(28px);
            line-height: rem(80px);
            background: var(--assistColor);
            .icon_icon_arrow {
                margin-left: rem(10px);
                font-size: rem(24px);
            }
            .input {
                flex: 1;
                height: rem(40px);
            }
            .all {
                position: absolute;
                top: 0;
                right: rem(20px);
                bottom: 0;
                margin: auto;
                color: var(--primary);
                font-size: rem(24px);
            }
            .currencySpan {
                margin-right: rem(10px);
            }
            .muted {
                margin-right: rem(15px);
            }
        }
        .footerBtn {
            position: fixed;
            bottom: 0;
            left: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            width: 100%;
            .van-button {
                //width: 45%;
                flex: 1;
                height: rem(80px);
                margin: rem(20px);
                //margin-bottom: rem(20px);
                color: #FFF;
                font-size: rem(30px);
            }
        }
    }
}
</style>
