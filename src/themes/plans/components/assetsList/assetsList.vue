<template>
    <van-popup
        v-model:show='popupShow'
        class='custom-popup'
        :duration='0.3'
        position='bottom'
        round
        :transition-appear='true'
        @close='closed'
    >
        <div class='header'>
            <div class='header-title'>
                {{ $t('assets.assets') }}
            </div>
            <i class='icon_guanbi' @click='close'></i>
        </div>
        <div class='popup-wrap'>
            <ul class='assets-list'>
                <li
                    v-for='(item, i) in accountList'
                    :key='i'
                    :class='{ active: curCurrency === item.currency }'
                    @click='checkCurrency(item)'
                >
                    <img alt='' class='currency-icon' :src='getCurrencyIcon(item.currency)' srcset='' />
                    <!-- <img alt='' class='currency-icon' :src='"/images/currency_icon/"+ item.currency +".99png" || "/images/currency_icon/default.png"' srcset='' /> -->
                    <div class='name'>
                        <p class='t1'>
                            {{ item.currency }}
                        </p>
                        <p class='t2'>
                            {{ assetsMap[item.currency] }}
                        </p>
                    </div>
                    <i v-if='curCurrency === item.currency' class='tick'></i>
                </li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
import Top from '@/components/top'
import { useStore } from 'vuex'
import { assetsMap } from './assetsMap'
import { onBeforeMount, computed, reactive, watch, toRefs, onUnmounted } from 'vue'
export default {
    props: ['show', 'currency', 'tradeType'],
    setup (props, context) {
        const store = useStore()
        const accountList = computed(() => {
            return store.state._user.customerInfo.accountList.filter(el => Number(el.tradeType) === Number(props.tradeType))
        })
        const state = reactive({
            popupShow: props.show,
            curCurrency: props.currency
        })

        watch(() => state.popupShow, val => {
            context.emit('update:show', val)
        })

        const close = () => {
            context.emit('update:show', false)
        }

        // 选择币种
        const checkCurrency = (currency) => {
            state.curCurrency = currency.currency
            context.emit('update:currency', currency)
            // state.popupShow = false
        }
        const getCurrencyIcon = (currency) => {
            try {
                return require('@/assets/currency_icon/' + currency + '.png')
            } catch (error) {
                return require('@/assets/currency_icon/default.png')
            }
        }
        return {
            close,
            accountList,
            checkCurrency,
            assetsMap,
            getCurrencyIcon,
            ...toRefs(state)
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.popup-wrap{
    overflow-y: scroll;
    height: calc(100vh - 80px);
    .assets-list{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        padding-bottom: rem(100px);
        li{
            position: relative;
            padding-left: rem(30px);
            flex: 0 0 48%;
            background: var(--contentColor);
            border-radius: rem(10px);
            display: flex;
            align-items: center;
            height: rem(110px);
            margin-bottom: rem(30px);
            border: rem(2px) solid transparent;
            .currency-icon{
                width: rem(48px);
                margin-right: rem(20px);
            }
            .t1{
                font-size: rem(32px);
            }
            .t2{
                color: var(--minorColor);
                font-size: rem(24px);
            }
            &.active{
                border: rem(2px) solid var(--primary);
                &::after{
                    position: absolute;
                    content: '\e728';
                    width: rem(30px);
                    height: rem(30px);
                    background: var(--primary);
                    border-radius: 0px rem(10px) 0px rem(10px);
                    right: 0;
                    top: rem(-2px);
                    font-family: 'iconfont';
                }
            }
            .tick{
                position: absolute;
                right: rem(8px);
                top: 0;
                width: rem(10px);
                height: rem(18px);
                border-color: var(--contentColor);
                border-style: solid;
                border-width: 0 rem(4px) rem(4px) 0;
                transform: rotate(45deg);
                z-index: 99;
            }
        }
    }
}
</style>
