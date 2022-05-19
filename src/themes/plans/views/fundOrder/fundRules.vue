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
                    2、使用USDT申购，支付费用计算：
                </p>
                <p class='text indent'>
                    申购支付费用=申购份额*基金净值*（1+手续费率）
                </p>
                <p class='text'>
                    3、使用一篮子资产申购，支付费用计算：
                </p>
                <p class='text indent'>
                    资产1支付费用：

                    资产1=投资构成1/基金份额*申购份额*（1+手续费率）
                </p>
                <p class='text indent'>
                    资产2支付费用：

                    资产2=投资构成2/基金份额*申购份额*（1+手续费率）
                </p>
                <p class='text indent'>
                    ...
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
                        赎回USDT时将会扣除USDT手续费，赎回一篮子资产时，会根据比例在每一项资产中扣除手续费
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
                    2、 赎回USDT的计算：
                </p>
                <p class='text indent'>
                    收到的USDT=赎回份额*基金净值*（1-手续费率%）
                </p>
                <p class='text'>
                    3、赎回一篮子资产的计算：
                </p>
                <p class='text indent'>
                    获得多少资产1：

                    资产1=投资构成1/基金份额*赎回份额*（1-手续费率%）
                </p>
                <p class='text indent'>
                    获得多少资产2：
                </p>
                <p class='text indent'>
                    资产2=投资构成2/基金份额*申购份额*（1-手续费率%）
                </p>
                <p class='text indent'>
                    ...
                </p>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const active = ref(route.query.direction === 'buy' ? 0 : 1)
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
