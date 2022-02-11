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
                    $t("fundInfo.applyRules")
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
                <p>{{ $t('fundInfo.jz_formula') }}</p>
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
                <p>{{ $t('fundInfo.jz_formula') }}</p>
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
.fundRules{
    margin-top: rem(110px);
    height: 100%;
    overflow-y: auto;

    --van-tabs-bottom-bar-color: var(--primary);

    .block{
        margin-top:10px;
        background: var(--contentColor);
        padding: rem(10px) rem(30px);
        line-height: 1.6;
        .title{
            padding: 10px 0;
        }
        .olList{
            line-height: 2;
        }
    }
    .n{
        display: inline-block;
        height: 18px;
        width: 18px;
        border-radius: 100%;
        font-size: rem(28px);
        line-height: rem(28px);
        color: var(--primary);
        text-align: center;
        border: 2px solid var(--primary);
        margin-right: .4em;
    }

    .tDate{
        display: flex;
        justify-content: space-between;
        position: relative;
        padding-top: 15px;
        padding-bottom: rem(30px);
        &::before{
            content: "";
            position: absolute;
            height: 1px;
            left: 15px;
            right: 15px;
            top: 5px;
            background: var(--primary);
        }
        .end{
            text-align: right;
        }
        .start,.center,.end{
            position: relative;
            &::before{
                content: "";
                position: absolute;
                height: 5px;
                width: 5px;
                left: 10px;
                top: -14px;
                border-radius: 100%;
                background: var(--contentColor);
                border: 2px solid var(--primary);
            }
        }
        .end{
            &::before{
                left: initial;
                right: 10px;
            }
        }
    }
}
</style>
