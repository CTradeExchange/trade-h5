<template>
    <div :class="['dropdown-menu', show ? 'show' : 'hide']" :style="{ 'top': (top + 1 + 'px') }" @click.stop>
        <div v-if='showSearch' class='currency-search'>
            <div class='search-box'>
                <input v-model='inputVal' :placeholder="$t('common.search')" type='text' />
                <van-icon v-if='inputVal' class='clear' name='clear' @click.stop="inputVal = ''" />
            </div>
        </div>
        <div class='currency-list'>
            <ul>
                <li v-for='item in resultList' :key='item.currency' @click='selectCurrency(item)'>
                    <currency-icon v-if='showIcon && item.currency' class='icon' :currency='item.currency' :size='24' />
                    <span class='currency'>
                        {{ item.currency }}
                    </span>
                    <span v-if='showLabel' class='label'>
                        {{ item.singleLowAmount }} ~ {{ item.singleHighAmount }}
                    </span>
                    <!-- 可提 -->
                    <div v-if='isTransfer || isWithdraw' class='transfer'>
                        <strong>{{ item.withdrawAmount }} {{ isTransfer ? $t('assets.transferable') : '' }}</strong>
                        <span
                            v-if='Number(item.withdrawAmount) > 0 &&
                                item.wholeWarehouseRate'
                        >
                            {{ item.currency !== assetsInfo?.currency ? '≈' : '' }} {{ item.wholeWithdrawAmount }} {{ assetsInfo?.currency }}
                        </span>
                    </div>
                    <!-- 自定义右侧内容 -->
                    <slot v-bind='item' name='item'></slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import currencyIcon from '@/components/currencyIcon'
import { computed, onMounted, onUnmounted, reactive, toRefs, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { isEmpty } from '@/utils/util'

export default {
    name: 'DropdownMenu',
    components: {
        currencyIcon
    },
    props: {
        // 是否显示弹窗
        show: {
            type: Boolean,
            default: false
        },
        // 离顶部的距离
        top: {
            type: Number,
            default: 0
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // 选择的货币
        currency: {
            type: String,
            default: ''
        },
        // 是否显示label
        showLabel: {
            type: Boolean,
            default: false
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: true
        },
        // 是否显示搜索
        showSearch: {
            type: Boolean,
            default: true
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
    emits: ['update:show', 'update:currency', 'select'],
    setup (props, { emit }) {
        const store = useStore()

        // 钱包资产信息
        const assetsInfo = computed(() => store.state._user.assetsInfo[8] || {})
        // state
        const state = reactive({
            // 输入框的值
            inputVal: '',
            // 过滤后的列表数据
            resultList: []
        })

        watch(() => props.show, () => {
            if (props.show) reset()
        })

        watchEffect(() => {
            let arr = []
            if (isEmpty(state.inputVal)) {
                arr = props.list
            } else {
                const newInputVal = state.inputVal.toUpperCase()
                arr = props.list.filter(el => el.currency.toUpperCase().indexOf(newInputVal) !== -1)
            }
            state.resultList = arr
        })

        // 重置数据
        const reset = () => {
            state.inputVal = ''
        }

        // 点击选择货币
        const selectCurrency = item => {
            emit('select', item)
            emit('update:currency', item.currency)
            close()
        }

        // 关闭弹窗
        const close = () => {
            emit('update:show', false)
        }

        onMounted(() => {
            emit('update:show', false)
        })

        onUnmounted(() => {
            emit('update:show', false)
        })

        return {
            ...toRefs(state),
            assetsInfo,
            selectCurrency
        }
    }
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
    width: 100%;
    padding: 10px 0;
    position: absolute;
    left: 0;
    z-index: 99;
    background-color: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-top: none;
    transition: ease-in-out 0.15s;
    transform-origin: top;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    &.show {
        transform: scaleY(1);
        opacity: 1;
        visibility: visible;
    }
    &.hide {
        transform: scaleY(0);
        opacity: 0;
        visibility: hidden;
    }
}
.currency-search {
    padding: 0 15px;
    font-size: 14px;
    .search-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 36px;
        background: var(--bgColor);
        border-radius: 5px;
        input {
            width: calc(100% - 50px);
            height: 100%;
            margin-left: 12px;
        }
        .clear {
            display: inline-flex;
            flex-shrink: 0;
            margin-top: -3px;
            margin-right: 8px;
            color: var(--minorColor);
            font-size: 20px;
            cursor: pointer;
        }
    }
}
.currency-list {
    max-height: 300px;
    padding: 0 12px;
    overflow-y: auto;
    li {
        display: flex;
        align-items: center;
        height: 48px;
        margin-top: 6px;
        padding: 0 10px;
        border-radius: 5px;
        cursor: pointer;
        .icon {
            margin-right: 8px;
            border: 1px solid var(--lineColor);
            border-radius: 50%;
        }
        .currency {
            @include ellipsis();
            flex: 1;
            font-size: 14px;
            color: var(--mainColor);
        }
        .label {
            font-size: 14px;
            color: var(--minorColor);
        }
        .transfer {
            display: inline-flex;
            flex-direction: column;
            text-align: right;
            line-height: 1;
            strong {
                font-size: 14px;
                font-weight: normal;
                color: var(--mainColor);
            }
            span {
                margin-top: 4px;
                font-size: 12px;
                font-weight: normal;
                color: var(--minorColor);
            }
        }
        &:hover {
            background-color: var(--bgColor);
        }
    }
}
</style>
