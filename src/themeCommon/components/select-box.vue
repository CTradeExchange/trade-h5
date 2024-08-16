<template>
    <div class='select-box'>
        <div v-if='title' class='title'>
            <span>{{ title }}</span>
            <popover v-if='popover' :text='popover' text-align='left' />
        </div>
        <div class='block-box' :style="{ 'position': isRelative ? 'relative' : 'static' }">
            <div v-if='showInput' class='import'>
                <input
                    v-model='inputValue'
                    v-positiveNumber='digits'
                    :digits='digits'
                    :disabled='disabled'
                    maxlength='18'
                    :placeholder='placeholder'
                    @DOMMouseScroll='stopScrollFun'
                    @input='onInput'
                    @mousewheel='stopScrollFun'
                />
                <van-icon v-if='inputValue' class='clear' name='clear' @click='onClear' />
            </div>
            <div
                ref='selectRef'
                :class="['option', showMenu ? 'show' : 'hide']"
                @click='toggleBuyMenu'
            >
                <currency-icon v-if='showIcon && currency' :currency='currency' :size='25' />
                <span>{{ currency }}</span>
                <van-icon v-if='isSelect' class='arrow' name='arrow-down' />
            </div>
            <!-- 反馈提示 -->
            <div v-if='showTip && tip' class='tip'>
                {{ tip }}
            </div>
            <!-- pc下拉菜单组件 -->
            <dropdown-menu
                v-if='isPC && isSelect'
                v-model:currency='currency'
                v-model:show='showMenu'
                :is-transfer='isTransfer'
                :is-withdraw='isWithdraw'
                :list='list'
                :show-icon='showIcon'
                :top='48'
                @select='onSelect'
            />
        </div>
    </div>

    <!-- h5弹窗组件 -->
    <assets-list-search
        v-if='!isPC && isSelect'
        v-model:currency='currency'
        v-model:show='showMenu'
        :account-list='list'
        :is-transfer='isTransfer'
        :is-withdraw='isWithdraw'
        :show-icon='showIcon'
        :title='title'
        @select='onSelect'
    />
</template>

<script>
import { ref, reactive, toRefs, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { stopScrollFun } from '@/utils/util'
import currencyIcon from '@/components/currencyIcon'
import dropdownMenu from '@/components/dropdownMenu'
import assetsListSearch from '@/themeCommon/components/assetsList/assetsListSearch.vue'
import popover from '@/components/popover.vue'

export default {
    components: {
        currencyIcon,
        dropdownMenu,
        assetsListSearch,
        popover
    },
    props: {
        // 下拉框父元素是否相对定位
        isRelative: {
            type: Boolean,
            default: true
        },
        // 标题
        title: {
            type: String,
            default: ''
        },
        // 是否显示图标
        showIcon: {
            type: Boolean,
            default: true
        },
        // 是否显入输入框
        showInput: {
            type: Boolean,
            default: false
        },
        // 是否禁用输入功能
        disabled: {
            type: Boolean,
            default: false
        },
        // 输入框提示
        placeholder: {
            type: String,
            default: ''
        },
        // 输入框内容
        value: {
            type: [String, Number],
            default: ''
        },
        // 小数位
        digits: {
            type: Number,
            default: 0
        },
        // 反馈提示
        tip: {
            type: String,
            default: ''
        },
        // 是否显示提示内容
        showTip: {
            type: Boolean,
            default: true
        },
        // 当前选择的币种
        currency: {
            type: String,
            default: ''
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // popover文案
        popover: {
            type: String,
            default: ''
        },
        // 是否可选择
        isSelect: {
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
    emits: ['input', 'clear', 'toggle', 'select', 'update:value', 'update:currency'],
    setup (props, { emit }) {
        // ref
        const selectRef = ref(null)
        const state = reactive({
            // 输入框内容
            inputValue: '',
            // 是否显示下拉菜单
            showMenu: false,
            // 当前选择的币种
            currency: ''
        })

        // 监听value
        watch(() => props.value, () => {
            nextTick(() => {
                if (props.showInput) {
                    state.inputValue = props.value
                }
            })
        })

        // 监听currency
        watch(() => props.currency, () => {
            state.currency = props.currency
        })

        // 当点击菜单以外的区域隐藏菜单
        const clickOut = (e) => {
            const drop = selectRef.value
            if (drop && !drop.contains(e.target)) {
                state.showMenu = false
            }
        }

        // 输入内容
        const onInput = () => {
            emit('update:value', state.inputValue)
            emit('input')
        }

        // 清空输入框的值
        const onClear = () => {
            state.inputValue = ''
            emit('update:value', state.inputValue)
            emit('clear')
        }

        // 打开关闭下拉菜单
        const toggleBuyMenu = () => {
            state.showMenu = !state.showMenu
            emit('toggle', state.showMenu)
        }

        const onSelect = (item) => {
            emit('select', item)
            emit('update:currency', item.currency)
        }

        onMounted(() => {
            if (window.isPC) {
                document.addEventListener('click', clickOut)
            }
        })

        onUnmounted(() => {
            if (window.isPC) {
                document.removeEventListener('click', clickOut)
            }
        })

        return {
            ...toRefs(state),
            isPC: window.isPC,
            selectRef,
            stopScrollFun,
            onClear,
            onInput,
            toggleBuyMenu,
            onSelect
        }
    }
}
</script>

<style lang="scss" scoped>
.select-box {
    .title {
        display: flex;
        align-items: center;
        margin-bottom: rem(24px);
        font-size: 18px;
        font-weight: bold;
        &:deep(.icon-question) {
            font-size: 20px;
        }
    }
}
.block-box {
    display: flex;
    align-items: center;
    height: 48px;
    background-color: var(--contentColor);
    border: 1px solid var(--lineColor);
    border-radius: 5px;
    &:hover {
        border: 1px solid var(--primary);
    }
    .import {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 70%;
        height: 100%;
        padding-left: 15px;
        border-right: 1px solid var(--lineColor);
        input {
            width: calc(100% - 40px);
            height: 100%;
            font-size: rem(36px);
        }
        .clear {
            margin-right: 10px;
            margin-top: -3px;
            color: var(--minorColor);
            font-size: 20px;
            cursor: pointer;
        }
    }
    .option {
        display: flex;
        align-items: center;
        flex: 1;
        height: 100%;
        padding: 0 12px;
        cursor: pointer;
        .currencyIcon {
            margin-right: 6px;
            border: 1px solid var(--lineColor);
            border-radius: 50%;
        }
        span {
            @include ellipsis();
            flex: 1;
            margin-right: 6px;
        }
        .arrow {
            transition: 0.15s;
            margin-top: -2px;
        }
        &.show {
            .arrow {
                margin-top: 2px;
                transform: rotate(180deg);
            }
        }
    }
    .tip {
        line-height: 1.2;
        position: absolute;
        top: 50px;
        left: 0;
        color: red;
    }
}
</style>

<style lang="scss" scoped>
.h5 {
    .select-box {
        .title {
            font-size: rem(30px);
            &:deep(.icon-question) {
                font-size: rem(32px);
            }
        }
    }
    .block-box {
        input {
            font-size: rem(30px);
        }
    }
}
</style>
