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
                        </i>{{ $t('fundInfo.applyRule_tip3') }}
                    </li>
                </ol>
            </section>
            <section class='block'>
                <h2 class='jz_formula'>
                    {{ $t('fundInfo.jz_formula') }}
                </h2>
                <p>{{ $t('fundInfo.jz_formulaContent') }}</p>
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
                </ol>
            </section>
            <section class='block'>
                <h2 class='title'>
                    {{ $t('fundInfo.jz_formula') }}
                </h2>
                <p>{{ $t('fundInfo.jz_formulaContent') }}</p>
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
        }
        .olList {
            line-height: 2;
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
