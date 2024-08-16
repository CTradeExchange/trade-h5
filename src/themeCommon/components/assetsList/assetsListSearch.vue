<template>
    <van-popup
        v-model:show='popupShow'
        class='custom-dialog'
        :duration='0.2'
        position='bottom'
        round
        :transition-appear='true'
        @close='close'
    >
        <div class='header'>
            <div class='header-title'>
                <span v-if='!hiddenTitle'>
                    {{ title || $t('common.currency') }}
                </span>
            </div>
            <i class='icon_guanbi' @click='close'></i>
        </div>
        <div class='popup-wrap'>
            <ul class='assets-list'>
                <van-search
                    v-model='inputVal'
                    clearable
                    :placeholder="$t('common.search')"
                />
                <li
                    v-for='(item, i) in resultList'
                    :key='i'
                    :class="['item', { active: curCurrency === item.currency }]"
                    @click='checkCurrency(item)'
                >
                    <CurrencyIcon v-if='showIcon' :currency='item.currency' />
                    <span class='currency'>
                        {{ item.currency }}
                    </span>
                    <div v-if='isTransfer || isWithdraw' class='amount'>
                        <span class='balance'>
                            {{ item.withdrawAmount }} {{ isTransfer ? $t('assets.transferable') : '' }}
                        </span>
                        <span
                            v-if='Number(item.withdrawAmount) > 0 &&
                                item.wholeWarehouseRate'
                            class='convert-balance'
                        >
                            {{ item.currency !== assetsInfo?.currency ? '≈' : '' }} {{ item.wholeWithdrawAmount }} {{ assetsInfo?.currency }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </van-popup>
</template>

<script>
import CurrencyIcon from '@/components/currencyIcon'
import { useStore } from 'vuex'
import { computed, reactive, watch, watchEffect, toRefs } from 'vue'
import { isEmpty } from '@/utils/util'
export default {
    components: {
        CurrencyIcon
    },
    props: {
        // 是否显示弹窗
        show: {
            type: Boolean,
            default: false
        },
        // 当前标题
        title: {
            type: String,
            default: ''
        },
        // 当前选择资产
        currency: {
            type: String,
            default: ''
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: true
        },
        // 资产列表
        accountList: {
            type: Array,
            default: () => []
        },
        // 是否隐藏标题
        hiddenTitle: {
            type: Boolean,
            default: false
        },
        // 是否划转
        isTransfer: {
            type: Boolean,
            default: false
        },
        // 是否提现
        isWithdraw: {
            type: Boolean,
            default: false
        }
    },
    emits: ['select', 'update:show', 'update:currency'],
    setup (props, { emit }) {
        const store = useStore()
        const style = computed(() => store.state.style)
        // 钱包资产信息
        const assetsInfo = computed(() => store.state._user.assetsInfo[5] || {})
        const state = reactive({
            // 是否显示弹窗
            popupShow: false,
            // 当前选择的币种
            curCurrency: '',
            // 输入框的值
            inputVal: '',
            // 过滤后的列表数据
            resultList: []
        })

        watch(() => props.show, () => {
            state.popupShow = props.show
        }, {
            immediate: true
        })

        watch(() => props.currency, () => {
            state.curCurrency = props.currency
        }, {
            immediate: true
        })

        watchEffect(() => {
            let arr = []
            if (isEmpty(state.inputVal)) {
                arr = props.accountList
            } else {
                const newInputVal = state.inputVal.toUpperCase()
                arr = props.accountList.filter(el => el.currency.toUpperCase().indexOf(newInputVal) !== -1)
            }
            state.resultList = arr
        })

        // 关闭
        const close = () => {
            state.popupShow = false
            state.inputVal = ''
            emit('update:show', false)
        }

        // 选择币种
        const checkCurrency = (item) => {
            state.curCurrency = item.currency
            emit('select', item)
            emit('update:currency', item.currency)
            close()
        }
        // 背景色
        const bgColor = style.value.primary + '0D'

        return {
        ...toRefs(state),
        bgColor,
        assetsInfo,
        close,
        checkCurrency
        }
    }
}
</script>

<style lang="scss">
@import '@/sass/mixin.scss';
.custom-dialog {
display: flex;
flex-direction: column;
height: 92%;
overflow: hidden;
background: var(--assistColor) !important;
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: rem(30px);
    .header-title {
        font-size: rem(42px) !important;
        font-weight: bold;
        color: var(--color);
    }
    .icon_guanbi {
        font-size: rem(30px);
        font-weight: bold;
    }
}
}
</style>

<style lang='scss' scoped>
@import '@/sass/mixin.scss';
.popup-wrap {
overflow-y: scroll;
padding: 0 rem(30px);
.assets-list {
    margin: rem(30px) 0;
    background: var(--contentColor);
    border-radius: rem(16px);
    &:deep {
        .van-search {
            background: none;
        }
        .van-search__content {
            padding-left: 0;
            background: var(--bgColor);
        }
        .van-cell {
            background: none;
        }
    }
    li {
        display: flex;
        align-items: center;
        height: rem(100px);
        padding: 0 rem(32px);
        .currency {
            flex: 1;
            font-size: rem(28px);
            margin-left: rem(12px);
            color: var(--mainColor);
        }
        .amount {
            display: inline-flex;
            align-items: flex-end;
            flex-direction: column;
            .balance {
                font-size: rem(28px);
                color: var(--mainColor);
            }
            .convert-balance {
                font-size: rem(24px);
                color: var(--minorColor);
            }
        }
        &:deep {
            .currencyIcon {
                width: 24px;
                height: 24px;
            }
        }
    }
}
}
</style>
