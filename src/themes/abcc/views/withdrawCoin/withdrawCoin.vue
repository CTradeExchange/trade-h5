<template>
    <div class='page-wrap'>
        <LayoutTop :back='true' :menu='false' :right-action='rightAction' :title='$t("withdraw.coinTitle")' @rightClick='toDespositList'>
            <template #right>
                <a class='withdorw-title' href=''>
                    提币记录
                </a>
            </template>
        </LayoutTop>
        <div class='withdraw-wrap'>
            <p class='title'>
                提币币种
            </p>
            <ul class='coin-list'>
                <li class='active'>
                    USDT
                </li>
                <li>BTC</li>
                <li>ETH</li>
            </ul>
            <p class='title'>
                主链
            </p>
            <ul class='coin-list'>
                <li class='active'>
                    TRC20
                </li>
                <li>ERC20</li>
                <li>OMNI</li>
            </ul>

            <div class='address'>
                <p class='title'>
                    提币地址
                </p>
                <van-field v-model='address' label='' placeholder='请输入钱包地址或粘贴地址' />
            </div>

            <div class='quantity'>
                <p class='title'>
                    提币数量
                </p>
                <van-field v-model='address' label='' placeholder='请输入提币数量' />
            </div>

            <div class='text'>
                <p>可提：35000.000 USDT</p>
                <p>手续费： 3500.000 USDT</p>
            </div>

            <div class='submitBox'>
                <div class='bottom-text'>
                    <label for=''>
                        到账数量
                    </label>
                    <span class='val'>
                        <em>10000000.00</em> USDT
                    </span>
                </div>
                <van-button size='normal' type='primary' @click='showCancelOrderTip = true'>
                    {{ $t('common.sure') }}
                </van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { reactive, computed, onMounted, toRefs } from 'vue'
export default {
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const state = reactive({
            address: '',
            currencyActive: 0
        })
        const rightAction = {
            title: t('deposit.depositRecord')
        }

        const toWithdrawList = () => {

        }

        return {
            ...toRefs(state),
            rightAction,
            toWithdrawList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    position: relative;
    height: 100%;
    padding-top: rem(100px);
    background-color: var(--contentColor);
    .withdorw-title {
        color: var(--primary);
        font-size: rem(24px);
    }
    .withdraw-wrap {
        padding: 0 rem(30px);
        .title {
            margin-top: rem(20px);
            margin-bottom: rem(20px);
        }
        ul.coin-list {
            li {
                display: inline-block;
                width: rem(140px);
                height: rem(70px);
                margin-right: rem(20px);
                line-height: rem(70px);
                text-align: center;
                background-color: var(--bgColor);
                border-radius: rem(6px);
                &.active {
                    color: var(--contentColor);
                    background-color: var(--primary);
                }
            }
        }
        .address,
        .quantity {
            margin-top: rem(70px);
        }
        .text {
            margin-top: rem(20px);
            color: var(--color);
            font-size: rem(24px);
        }
        .van-field {
            border-bottom: solid 1px var(--lineColor);
        }
    }
    .submitBox {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        font-size: rem(30px);
        .bottom-text {
            display: flex;
            justify-content: space-between;
            margin-bottom: rem(24px);
            padding: 0 rem(30px);
            label {
                font-weight: bold;
            }
            em {
                color: var(--warn);
                font-style: normal;
            }
        }
        .van-button {
            width: 100%;
            height: rem(90px);
            font-size: rem(30px);
            border: none;
            border-radius: 0;
        }
    }
}

</style>
