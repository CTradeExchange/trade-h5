<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :close-on-click-modal='false'
            :title="$t('fundInfo.applyRules')"
            width='520px'
        >
            <div class='rules-info'>
                <div class='list'>
                    <p class='row'>
                        <span class='no'>
                            1
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip1') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            2
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip2') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            3
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip4') }}
                        </span>
                    </p>
                    <p class='row'>
                        <span class='no'>
                            4
                        </span>
                        <span class='value'>
                            {{ $t('fundInfo.applyRule_tip3') }}
                        </span>
                    </p>
                </div>
                <div class='block'>
                    <p class='title'>
                        {{ $t('fundInfo.jz_formula') }}
                    </p>
                    <p class='text'>
                        1、{{ $t('fundInfo.jz_formulaContent') }}
                    </p>
                    <p class='text'>
                        2、{{ $t('fundInfo.fundRedeemFormula4') }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula5') }}
                    </p>
                    <p class='text'>
                        3、{{ $t('fundInfo.fundRedeemFormula6') }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula7',{ number: 'A' }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula8',{ number: 'A' }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula7',{ number: 'B' }) }}
                    </p>
                    <p class='text indent'>
                        {{ $t('fundInfo.fundRedeemFormula8',{ number: 'B' }) }}
                    </p>
                    <p class='text indent'>
                        ...
                    </p>
                </div>
                <div class='block'>
                    <h2 class='title'>
                        {{ $t('fundInfo.deductRuletit1') }}
                    </h2>
                    <h3 class='title1'>
                        {{ $t('fundInfo.deductRuletxt1') }}
                    </h3>
                    <div v-if='purchaseCurrencySetting !== {}' class=''>
                        <van-row v-for='(item,index) in purchaseCurrencySetting.value' :key='index' class='txt-row child'>
                            <van-col span='12'>
                                {{ item.currencyCode === ('self'|| 'SELF') ? $t('fundInfo.basketAssets') : item.currencyName }}
                            </van-col>
                            <van-col align='right' span='12'>
                                {{ item.purchaseFeeProportion? item.purchaseFeeProportion:0 }}%
                            </van-col>
                        </van-row>
                        <van-row class='txt-row'>
                            <van-col span='12'>
                                {{ $t('fundInfo.deductRuletxt2') }}
                            </van-col>
                            <van-col align='right' span='12'>
                                {{ fundData.value.managementFee? fundData.value.managementFee:0 }}% {{ $t('fundInfo.deductRuletxt3') }}
                            </van-col>
                        </van-row>
                    </div>
                    <p class='text'>
                        {{ $t('fundInfo.deductRuledesc',{ time: (fundData.value.dailySettlementTime?fundData.value.dailySettlementTime: '00:00') }) }}
                    </p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, defineExpose, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { div } from '@/utils/calculation'
import { getFundInfo } from '@/api/fund'

// 是否显示弹窗
const show = ref(false)
const fundId = ref()
const purchaseCurrencySetting = ref({})

// 打开弹窗
const open = (showType, id) => {
    show.value = showType
    fundId.value = id
    getFundInfoFn()
}
const fundData = ref({})
const { t } = useI18n({ useScope: 'global' })

// 获取基金产品详情
const getFundInfoFn = () => {
    const param = {
        fundId: fundId.value
    }
    getFundInfo(param).then(res => {
        if (res.check()) {
            if (res.data) {
                fundData.value = ref(res.data)
                purchaseCurrencySetting.value = ref(res.data.purchaseCurrencySetting)
            }
        }
    })
}

const divData = (value) => {
    return div(value, 100)
}

onMounted(() => {
    // 获取基金产品详情
    // getFundInfoFn()
})

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.rules-info {
    .row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .no {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            margin-right: 5px;
            color: #FFF;
            line-height: 1;
            background: var(--primary);
            border-radius: 50%;
        }
        .value {
            line-height: 18px;
        }
    }
    .block {
        margin-top: 20px;
        .title {
            color: var(--color);
            font-size: 20px;
        }
        .text {
            margin-top: rem(20px);
            &.indent {
                padding-left: 22px;
            }
        }
    }
    .txt-row {
        padding: rem(20px) 0 rem(20px) 0;
        font-size: 14px;
        border-bottom: 1px solid var(--lineColor);
        &.child {
            padding-left: rem(40px);
        }
    }
    .title1 {
        margin-top: 10px;
        font-weight: normal;
        font-size: 16px;
    }
    .title {
        font-weight: normal;
        font-size: 16px;
    }
}
</style>
