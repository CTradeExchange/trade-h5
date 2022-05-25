<template>
    <div class='fundRules'>
        <LayoutTop :back='true' :menu='false' />
        <van-tabs v-model:active='active' class='mtop10'>
            <van-tab :title='$t("fundInfo.applyRules")' />
            <van-tab :title='$t("fundInfo.redeemRules")' />
        </van-tabs>

        <!-- 申购规则 -->
        <div v-if='active===0'>
            <section class='block'>
                <h2 class='title'>
                    {{ $t("fundInfo.applyRules") }}
                </h2>
                <ol class='olList'>
                    <li>
                        <i class='n'>
                            1
                        </i>{{ $t('fundInfo.applyRule_tip1') }}
                    </li>
                    <li>
                        <i class='n'>
                            2
                        </i>{{ $t('fundInfo.applyRule_tip2') }}
                    </li>
                    <li>
                        <i class='n'>
                            3
                        </i>
                        {{ $t('fundInfo.applyRule_tip4') }}
                    </li>
                    <li>
                        <i class='n'>
                            4
                        </i>{{ $t('fundInfo.applyRule_tip3') }}
                    </li>
                </ol>
            </section>
            <section class='block'>
                <h2 class='jz_formula'>
                    {{ $t('fundInfo.jz_formula') }}
                </h2>
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
            </section>
            <section class='block'>
                <h2 class='title'>
                    {{ $t('fundInfo.deductRuletit1') }}
                </h2>
                <h3 class='title1'>
                    {{ $t('fundInfo.deductRuletxt1') }}
                </h3>
                <van-row v-for='(item,index) in fundData.value.purchaseCurrencySetting' :key='index' class='txt-row child'>
                    <van-col span='12'>
                        {{ item.currencyCode === 'self' ? $t('fundInfo.basketAssets') : item.currencyName }}
                    </van-col>
                    <van-col align='right' span='12'>
                        {{ item.purchaseFeeProportion? divData(item.purchaseFeeProportion):0 }}%
                    </van-col>
                </van-row>
                <van-row class='txt-row'>
                    <van-col span='12'>
                        {{ $t('fundInfo.deductRuletxt2') }}
                    </van-col>
                    <van-col align='right' span='12'>
                        {{ fundData.managementFee? divData(fundData.managementFee):0 }}% {{ $t('fundInfo.deductRuletxt3') }}
                    </van-col>
                </van-row>
                <p class='text'>
                    {{ $t('fundInfo.deductRuledesc',{ time: fundData.dailySettlementTime?fundData.dailySettlementTime: '00:00' }) }}
                </p>
            </section>
        </div>

        <!-- 赎回规则 -->
        <div v-else-if='active===1'>
            <section class='block'>
                <h2 class='title'>
                    {{ $t('fundInfo.redeemRules') }}
                </h2>
                <div class='tDate'>
                    <div class='start'>
                        <p>{{ $t('fundInfo.tDate') }}</p>
                        <p>{{ $t('fundInfo.redeemSubmit') }}</p>
                    </div>
                    <div class='center'>
                        <p>{{ $t('fundInfo.tDate') }}+1</p>
                    </div>
                    <div class='end'>
                        <p>{{ $t('fundInfo.tDate') }}+2</p>
                        <p>{{ $t('fundInfo.fundArrive') }}</p>
                    </div>
                </div>
                <ol class='olList'>
                    <li>
                        <i class='n'>
                            1
                        </i>{{ $t('fundInfo.redeem_tip1') }}
                    </li>
                    <li>
                        <i class='n'>
                            2
                        </i>{{ $t('fundInfo.redeem_tip2') }}
                    </li>
                    <li>
                        <i class='n'>
                            3
                        </i>{{ $t('fundInfo.redeem_tip3') }}
                    </li>
                    <li>
                        <i class='n'>
                            4
                        </i>
                        {{ $t('fundInfo.fundRedeemFormula9') }}
                    </li>
                </ol>
            </section>
            <section class='block'>
                <h2 class='title'>
                    {{ $t('fundInfo.jz_formula') }}
                </h2>
                <p class='text'>
                    1、{{ $t('fundInfo.jz_formulaContent') }}
                </p>
                <p class='text'>
                    2、{{ $t('fundInfo.fundRedeemFormula10') }}
                </p>
                <p class='text indent'>
                    {{ $t('fundInfo.fundRedeemFormula11') }}
                </p>
                <p class='text'>
                    3、{{ $t('fundInfo.fundRedeemFormula12') }}
                </p>
                <p class='text indent'>
                    {{ $t('fundInfo.fundRedeemFormula13',{ number: 'A' }) }}
                </p>
                <p class='text indent'>
                    {{ $t('fundInfo.fundRedeemFormula14',{ number: 'A' }) }}
                </p>
                <p class='text indent'>
                    {{ $t('fundInfo.fundRedeemFormula13',{ number: 'B' }) }}
                </p>
                <p class='text indent'>
                    {{ $t('fundInfo.fundRedeemFormula14',{ number: 'B' }) }}
                </p>
                <p class='text indent'>
                    ...
                </p>
            </section>

            <section class='block'>
                <h2 class='title'>
                    {{ $t('fundInfo.deductRuletit1') }}
                </h2>
                <h3 class='title1'>
                    {{ $t('fundInfo.deductRuletxt4') }}
                </h3>
                <van-row v-for='(item,index) in fundData.value.redemptionCurrencySetting' :key='index' class='txt-row child'>
                    <van-col span='12'>
                        {{ item.currencyCode === 'self' ? $t('fundInfo.basketAssets') : item.currencyName }}
                    </van-col>
                    <van-col align='right' span='12'>
                        {{ item.redemptionFeeProportion? divData(item.redemptionFeeProportion):0 }}%
                    </van-col>
                </van-row>

                <p class='text'>
                    {{ $t('fundInfo.deductRuledesc2') }}
                </p>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { div } from '@/utils/calculation'
import { getFundInfo } from '@/api/fund'

const route = useRoute()
const active = ref(route.query.direction === 'buy' ? 0 : 1)
const { fundId } = route.query
const fundData = ref({})
const { t } = useI18n({ useScope: 'global' })

// 获取基金产品详情
const getFundInfoFn = () => {
    getFundInfo({ fundId }).then(res => {
        if (res.check()) {
            console.log(res)
            if (res.data) {
                fundData.value = ref(res.data)
            }
            console.log(fundData.value)
        }
    })
}

const divData = (value) => {
    return div(value, 100)
}

onMounted(() => {
    // 获取基金产品详情
    getFundInfoFn()
})

</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fundRules {
    height: 100%;
    margin-top: rem(110px);
    overflow-y: auto;

    --van-tabs-bottom-bar-color: var(--primary);
    .block {
        margin-top: 10px;
        padding: rem(10px) rem(30px);
        line-height: 1.6;
        background: var(--contentColor);
        .title {
            padding: 10px 0;
            .text {
                margin-top: rem(20px);
                &.indent {
                    padding-left: 22px;
                }
            }
        }
        .olList {
            line-height: 2;
        }
        .text {
            margin-top: rem(20px);
            &.indent {
                padding-left: 22px;
            }
        }
        .txt-row {
            padding: rem(20px) 0 rem(20px) 0;
            font-size: rem(20px);
            border-bottom: 1px solid var(--lineColor);
            &.child {
                padding-left: rem(40px);
            }
        }
        .title1 {
            font-size: rem(26px);
        }
    }
    .n {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 0.4em;
        color: var(--primary);
        font-size: rem(28px);
        line-height: rem(28px);
        text-align: center;
        border: 2px solid var(--primary);
        border-radius: 100%;
    }
    .tDate {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding-top: 15px;
        padding-bottom: rem(30px);
        &::before {
            position: absolute;
            top: 5px;
            right: 15px;
            left: 15px;
            height: 1px;
            background: var(--primary);
            content: '';
        }
        .end {
            text-align: right;
        }
        .start,
        .center,
        .end {
            position: relative;
            &::before {
                position: absolute;
                top: -14px;
                left: 10px;
                width: 5px;
                height: 5px;
                background: var(--contentColor);
                border: 2px solid var(--primary);
                border-radius: 100%;
                content: '';
            }
        }
        .end {
            &::before {
                right: 10px;
                left: initial;
            }
        }
    }
}
</style>
