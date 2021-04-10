<template>
    <div class='page-wrap'>
        <top left-icon='arrow-left' :menu='false' :right-action='false' show-center='true' />
        <div class='filed-wrap'>
            <van-cell-group>
                <van-field v-model='userName' label='持卡人姓名' placeholder='请输入持卡人姓名' />
                <van-field v-model='bankNo' label='银行卡号' placeholder='请输入银行卡号' type='number' />
                <van-field
                    v-model='bankName'
                    label='银行名称'
                    placeholder='请输入银行名称'
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
                    label='开户地址'
                    placeholder='请输入开户地址'
                    readonly
                    right-icon='arrow-down'
                    @click='areaShow = true'
                />
                <van-field v-model='bankArea' label='开户行地址' placeholder='请输入开户行地址' />
            </van-cell-group>
        </div>
        <van-button block class='confirm-btn' type='primary' @click='handleConfirm'>
            <span>确定</span>
        </van-button>
    </div>

    <van-action-sheet v-model:show='areaShow'>
        <van-area :area-list='areaList' columns-num='2' title='开户地址' @cancel='show=false' @confirm='handleAreaConfirm' />
    </van-action-sheet>
    <van-action-sheet
        v-model:show='currencyShow'
        :actions='currencyActions'
        cancel-text='取消'
        close-on-click-action
        @select='onSelectCurrency'
    />

    <van-action-sheet
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
    </van-action-sheet>
</template>

<script>
import { useRouter } from 'vue-router'
import top from '@/components/top'
import { onBeforeMount, reactive, toRefs } from 'vue'
import { areaList } from '@/utils/area'
import Rule from './addbank_rule'
import { useStore } from 'vuex'
import Schema from 'async-validator'
import { Toast } from 'vant'
import { addBank } from '@/api/user'
import CurrencyAction from '../../themes/mt4/views/register/components/currencyAction'

export default {
    components: {
        top,
        CurrencyAction
    },
    setup (props, { emit, attrs }) {
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            userName: '',
            bankNo: '',
            bankName: '',
            currency: 'USD',
            area: '',
            bankArea: '',
            areaShow: false,
            bankShow: false,
            banksActions: [
                { name: '招商银行' },
                { name: '建设银行' },
                { name: '农业银行' },

            ],
            currencyShow: false,
            currencyActions: [{ name: '人民币' }, { name: '美元' }
            ]
        })

        const handleAreaConfirm = (area) => {
            console.log(area)
            if (area) {
                state.area = area.map(item => item.name)
                state.areaShow = false
            }
        }
        const onSelectBank = (item) => {
            state.bankShow = false
            state.bankName = item.name
        }

        const onSelectCurrency = (item) => {
            state.currencyShow = false
            state.currency = item.name
        }

        // 提交处理
        const handleConfirm = () => {
            // bankAccountName	账户持有人姓名
            // bankCardNumber	银行卡号
            // bankCurrency	银行币种
            // bankName	银行名称
            // bankAddress	银行开户地址
            // bankBranch	银行支行
            // country	国家
            // province	省
            // city	市
            const params = {
                bankAccountName: state.userName,
                bankCardNumber: state.bankNo,
                bankName: state.bankName,
                bankCurrency: state.currency,
                bankAddress: state.bankArea,
                country: '中国',
                province: state.area[0],
                city: state.area[1]
            }
            const validator = new Schema(Rule)
            validator.validate(params, (errors, fields) => {
                if (errors) {
                    return Toast(errors[0].message)
                }
                handleAddBank(params)
            })
        }

        const handleAddBank = (params) => {
            addBank(params).then(res => {
                if (res.check()) {
                    Toast(res.msg)
                }
            })
        }

        store.dispatch('getBankDictList')

        onBeforeMount(() => {
            console.log(555)
        })

        return {
            areaList,
            onSelectBank,
            onSelectCurrency,
            handleAreaConfirm,
            ...toRefs(state),
            handleConfirm
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
.bank-item {
    font-size: rem(30px);
    line-height: rem(80px);
    text-align: center;
}
</style>
