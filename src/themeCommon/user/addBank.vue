<template>
    <div class='page-wrap'>
        <top left-icon='arrow-left' :menu='false' :right-action='false' :show-center='true' />
        <div class='filed-wrap'>
            <van-cell-group>
                <van-field v-model='userName' :label='$t("bank.bankPersonName")' :placeholder='$t("bank.inputBankPersonName")' />
                <van-field v-model='bankNo' :label='$t("bank.bankNo")' :placeholder='$t("bank.inputBankNo")' type='number' />
                <van-field
                    v-model='bankName'
                    :label='$t("bank.bankName")'
                    :placeholder='$t("bank.inputBankName")'
                    readonly
                    right-icon='arrow-down'
                    @click='bankShow = true'
                />
                <!-- <van-field
                    v-model='currency'
                    label='银行卡币种'
                    placeholder='请输入银行卡币种'
                    readonly
                    right-icon='arrow-down'
                    @click='currencyShow=true'
                /> -->
                <CurrencyAction v-model='currency' v-model:show='currencyShow' class='cellRow' input-align='left' />
                <van-field
                    v-model='area'
                    :label='$t("bank.openAddress")'
                    :placeholder='$t("bank.inputOpenAddressText")'
                    readonly
                    right-icon='arrow-down'
                    @click='areaShow = true'
                />
                <van-field v-model='bankArea' :label='$t("bank.branchAddress")' :placeholder='$t("bank.inputBranchAddress")' />
            </van-cell-group>
        </div>
        <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
            <span>{{ $t('common.sure') }}</span>
        </van-button>
    </div>

    <van-action-sheet v-model:show='areaShow'>
        <van-area :area-list='areaList' columns-num='2' :title='$t("bank.openAddress")' @cancel='show=false' @confirm='handleAreaConfirm' />
    </van-action-sheet>
    <van-action-sheet
        v-model:show='currencyShow'
        :actions='currencyActions'
        :cancel-text='$t("common.cancel")'
        close-on-click-action
        @select='onSelectCurrency'
    />

    <van-popup v-model:show='bankShow' position='right' :style="{ height: '100%' }">
        <div class='bank-list'>
            <div v-for='item in bankDict' :key='item.code' class='bank-item' @click='onSelectBank(item)'>
                <i class='bank-icons-sm' :class="'bk-'+ item.code"></i>
                {{ item.name }}
            </div>
        </div>
    </van-popup>

    <van-dialog
        v-model:show='addSuccessShow'
        class-name='add-success'
        :confirm-button-text='$t("common.sure")'
        :show-cancel-button='showCancel'
        @cancel='cancel'
        @confirm='toBankList'
    >
        <i class='icon_success'></i>
        <p class='title'>
            {{ $t('common.tip') }}
        </p>
        <p class='content'>
            {{ $t('bank.submitSuccessTips') }}
        </p>
    </van-dialog>

    <!-- <van-action-sheet
        v-model:show='bankShow'
        cancel-text='取消'
        close-on-click-action
        @select='onSelectBank'
    >
        <van-search
            v-model='value'
            background='#fff'
            placeholder='请输入银行名称关键词'
            show-action
            @cancel='onCancel'
            @search='onSearch'
        />
        <div v-for='(item, index) in banksActions' :key='index' class='bank-item' @click='onSelectBank(item)'>
            {{ item.name }}
        </div>
    </van-action-sheet> -->
</template>

<script>
import { useRouter } from 'vue-router'
import top from '@/components/top'
import { reactive, toRefs, computed } from 'vue'
import { areaList } from '@/utils/area'
import RuleFn from './addbank_rule'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import { Toast } from 'vant'
import { addBank } from '@/api/user'
import CurrencyAction from '@/components/currencyAction'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        top,
        CurrencyAction
    },
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })
        const bankDict = computed(() => store.state.bankDict)
        const customInfo = computed(() => store.state._user.customerInfo)

        const state = reactive({
            userName: '',
            bankNo: '',
            bankName: '',
            currency: 'USD',
            area: '',
            bankArea: '',
            areaShow: false,
            bankShow: false,
            checkedBankCode: '',
            currencyShow: false,
            addSuccessShow: true,
            showCancel: false,
            currencyActions: [{ name: t('common.RMB') }, { name: t('common.dollar') }
            ]
        })

        const handleAreaConfirm = (area) => {
            if (area) {
                state.area = area.map(item => item.name)
                state.areaShow = false
            }
        }
        const onSelectBank = (item) => {
            state.bankShow = false
            state.bankName = item.name
            state.checkedBankCode = item.code
        }

        const onSelectCurrency = (item) => {
            state.currencyShow = false
            state.currency = item.name
        }

        // 提交处理
        const handleConfirm = () => {
            // bankAccountName账户持有人姓名
            // bankCardNumber银行卡号
            // bankCurrency银行币种
            // bankName银行名称
            // bankAddress银行开户地址
            // bankBranch银行支行
            // country国家
            // province省
            // city市
            const province = state.area.split(',')[0]
            const city = state.area.split(',')[1]
            const params = {
                bankAccountName: state.userName,
                bankCardNumber: state.bankNo,
                bankName: state.bankName,
                bankCurrency: state.currency,
                bankAddress: province + city,
                bankBranch: state.bankArea,
                country: customInfo.value.country,
                province: province,
                city: city,
                bankCode: state.checkedBankCode
            }

            const validator = new Schema(RuleFn(t))

            validator.validate(params, (errors, fields) => {
                if (errors) {
                    return Toast(errors[0].message)
                }
                handleAddBank(params)
            })
        }

        const handleAddBank = (params) => {
            const toast = Toast.loading({
                message: t('common.loading'),
                forbidClick: true,
            })
            addBank(params).then(res => {
                toast.clear()
                if (res.check()) {
                    state.addSuccessShow = true
                }
            })
        }

        const toBankList = () => {
            router.push('/bankList')
        }

        const cancel = () => {
            state.userName = ''
            state.bankNo = ''
            state.currency = ''
            state.bankName = ''
            state.bankArea = ''
            state.area = ''
        }

        store.dispatch('getBankDictList')

        return {
            areaList,
            onSelectBank,
            onSelectCurrency,
            handleAreaConfirm,
            ...toRefs(state),
            handleConfirm,
            toBankList,
            bankDict,
            cancel
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
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
.bank-list {
    min-width: rem(400px);
    //min-width: 2.66667rem;
    padding: rem(30px) rem(50px) 0 rem(50px);
    overflow-y: auto;
    .bank-item {
        position: relative;
        padding: rem(15px) 0 rem(15px) 0;
        font-size: rem(30px);
        line-height: rem(80px);
        line-height: rem(60px);
        text-align: left;
        &::after {
            position: absolute;
            top: 0;
            left: 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 200%;
            height: 200%;
            border-bottom: 1px solid #E3E3E3;
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            content: '';
            pointer-events: none;
        }
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
