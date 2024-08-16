<template>
    <div
        :class="['classify-tabs', { 'classify-tabs-pc': isPC }, { 'classify-tabs-lg': size === 'lg' }]"
        :style="{ 'margin': margin }"
    >
        <div
            v-if='showArrow'
            class='classify-arrow mr-1 font-bold'
            @click="handleArrow('left')"
        >
            <van-icon name='arrow-left' />
        </div>
        <div ref='containerElement' class='classify-container'>
            <ul ref='tabbarElement' class='classify-list' :class="'classify-list-' + styleType">
                <li
                    v-if='showAll'
                    :class="['item', { 'active-item': checkValue === allKey }]"
                    @click='onAll'
                >
                    <span>{{ $t('signal.common.all') }}</span>
                </li>
                <li
                    v-for='(item, index) in list'
                    :key='item.value'
                    :class="['item', { 'active-item': valueArr.includes(item.value), disabled: disabledList.includes(item.value) }]"
                    @click='switchItem(index)'
                >
                    <span>{{ formatName(item) }}</span>
                </li>
            </ul>
        </div>
        <div
            v-if='showArrow'
            class='classify-arrow ml-1 font-bold'
            @click="handleArrow('right')"
        >
            <van-icon name='arrow' />
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { raf } from '@vant/use'

export default defineComponent({
    props: {
        // 当前选中
        modelValue: {
            type: [String, Number],
            default: ''
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // 外边距
        margin: {
            type: String,
            default: ''
        },
        // 是否多选
        isMultiple: {
            type: Boolean,
            default: true
        },
        // 样式风格 1.可滚动(块) 2.可滚动(下划线) 3.不可滚动(平分) 4.不可滚动(固定显示5个)
        styleType: {
            type: Number,
            default: 1
        },
        // 是否显示全部
        showAll: {
            type: Boolean,
            default: false
        },
        // 按钮尺寸
        size: {
            type: String,
            default: ''
        },
        // 是否显示箭头
        showArrow: {
            type: Boolean,
            default: false,
        },
        // 禁用选择列表
        disabledList: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue', 'input'],
    setup (props, { emit }) {
        const containerElement = ref()
        const tabbarElement = ref()
        const store = useStore()
        const state = reactive({
            // 当前多选的数据
            valueArr: [],
            // 当前选中的value值
            checkValue: '',
            // 最后选中的数据下标
            lastIndex: '',
            // 全选的key值
            allKey: ''
        })

        // 点击全部
        const onAll = () => {
            emit('update:modelValue', state.allKey)
            emit('input', state.allKey)
        }

        // 切换选项
        const switchItem = (index) => {
            const item = props.list[index]
            // 多选
            if (props.isMultiple) {
                const isCheck = state.valueArr.includes(item.value)
                let arr = state.valueArr.filter(el => el !== state.allKey)
                if (isCheck) {
                    arr = arr.filter(el => el !== item.value)
                } else {
                    arr.push(item.value)
                }
                state.lastIndex = index

                // 全选
                if (props.showAll && arr.length === props.list.length) {
                    emit('update:modelValue', state.allKey)
                    emit('input', state.allKey)
                } else {
                    emit('update:modelValue', arr.toString())
                    emit('input', arr.toString())
                }
            } else {
                // 单选
                if (item.value !== state.checkValue) {
                    state.lastIndex = index
                    emit('update:modelValue', item.value)
                    emit('input', item.value)
                }
            }
        }

        // 滚动动画函数
        const scrollLeftTo = (
            scroller,
            to,
            duration
        ) => {
            let count = 0
            const from = scroller.scrollLeft
            const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16)

            function animate () {
                scroller.scrollLeft += (to - from) / frames
                if (++count < frames) {
                    raf(animate)
                }
            }
            animate()
        }

        // 滚动到某个索引
        const scrollToIndex = (index) => {
            const el = {
                container: containerElement.value,
                tabbar: tabbarElement.value,
                activeTab: tabbarElement.value.children[props.showAll ? index + 1 : index],
            }
            if (!el.activeTab) return
            if (el.tabbar.scrollWidth > el.container.clientWidth) {
                const to = el.activeTab.offsetLeft - (el.container.offsetWidth - el.activeTab.offsetWidth) / 2
                scrollLeftTo(el.container, to, 0.3)
            } else {
                el.container.scrollLeft = 0
            }
        }

        // 滚动标签
        const scrollTab = () => {
            nextTick(() => {
                scrollToIndex(state.lastIndex)
            })
        }

        // 监听modelValue
        watch(() => props.modelValue, (newVal) => {
            const arr = newVal ? newVal.split(',') : []
            if (arr.length === props.list.length && props.showAll) {
                state.valueArr = []
                state.checkValue = state.allKey
            } else {
                state.valueArr = arr
                state.checkValue = newVal
            }
            // 初始化定位最后一个值
            if (newVal && [1, 2].includes(props.styleType)) {
                setTimeout(() => {
                    const newValSplit = newVal.split(',')
                    const lastValue = newValSplit[newValSplit.length - 1]
                    state.lastIndex = props.list.findIndex(el => el.value === lastValue)
                }, 0)
            } else {
                setTimeout(() => {
                    state.lastIndex = -1
                }, 0)
            }
        }, {
            immediate: true
        })

        // 监听lastIndex
        watch(() => state.lastIndex, () => {
            scrollTab()
        }, {
            immediate: true
        })

        // 置顶和置底
        const handleArrow = (direction) => {
            if (direction === 'left') {
                scrollToIndex(0)
            } else {
                scrollToIndex(props.list.length - 1)
            }
        }

        onMounted(() => {
            // 设置首次默认选中的类型
            const arr = props.modelValue.split(',') || []
            if (arr.length === 1) {
                const value = arr[0]
                state.lastIndex = props.list.findIndex(el => el.value === value)
            }
        })

        const formatName = (item) => {
            const nameKey = store.getters['_signal/getNameKey']()
            // 配置的key值区分语言 name_cn name_hk
            return item[nameKey] || item.name
        }

        return {
            isPC: window.isPC,
            containerElement,
            tabbarElement,
            ...toRefs(state),
            onAll,
            switchItem,
            formatName,
            handleArrow
        }
    }
})
</script>

<style lang="scss" scoped>
.classify-tabs {
    display: flex;
    align-items: center;
    width: 100%;
}
.classify-container {
    flex: 1;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scrollbar-color: transparent transparent;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        display: none;
    }
}
.classify-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.classify-list {
    .item {
        cursor: pointer;
        margin: 0 4px;
        &.disabled {
          pointer-events: none;
          background: var(--assistColor);
        }
    }
}
.classify-list-1 {
    display: flex;
    white-space: nowrap;
    color: var(--color);
    .item {
        background: var(--assistColor);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: rem(53px);
        padding: 0 rem(24px);
        margin-right: rem(16px);
        font-size:  12px;
        border-radius: rem(8px);
        &:last-of-type {
            margin-right: 0;
        }
        &:first-of-type {
            margin-left: 0;
        }
        @media (any-hover: hover) {
            &:hover {
                box-shadow: 0 0 0 999px rgb(0 0 0 / 20%) inset;
            }
        }
    }
    .active-item {
        font-weight: bold;
        transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        color: var(--primary);
    }
}
.classify-list-2 {
    color: var(--color);
    display: flex;
    flex: 1 0 auto;
    .item {
        color: var(--minorColor);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: rem(24px);
        font-size:  12px;
        @media (any-hover: hover) {
            &:hover {
                color: var(--primary);
            }
        }
        &:last-of-type {
            margin-right: 0;
        }
        span {
            position: relative;
            &::after {
                content: '';
                display: none;
                width: 100%;
                height: 1px;
                background: var(--primary);
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
    }
    .active-item {
        color: var(--primary);
        transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        span {
            &::after {
                display: block;
            }
        }
    }
}
.classify-list-3 {
    display: flex;
    flex: 1;
    .item {
        padding: rem(10px) 0;
        color: var(--minorColor);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        font-size:  12px;
        @media (any-hover: hover) {
            &:hover {
                color: var(--primary);
            }
        }
        span {
            position: relative;
            &::after {
                content: '';
                display: none;
                width: 100%;
                height: 1px;
                background: var(--primary);
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
    }
    .active-item {
        color: var(--primary);
        transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
        span {
            &::after {
                display: block;
            }
        }
    }
}
.classify-list-4 {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    .item {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 20%;
        span {
            width: calc((100% - 32px) / 5);
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: rem(16px);
            background: var(--assistColor);
            height: rem(53px);
            font-size: rem(26px);
            border-radius: rem(8px);
            padding: 0 rem(8px);
            @media (any-hover: hover) {
                &:hover {
                    box-shadow: 0 0 0 999px rgb(0 0 0 / 20%) inset;
                }
            }
        }
    }
    .active-item {
        span {
            font-weight: bold;
            transition: all cubic-bezier(0.215, 0.61, 0.355, 1) 0.2s;
            color: var(--primary);
        }
    }
}
</style>

<style lang="scss" scoped>
.classify-tabs-lg {
    .item {
        font-size: 14px;
        padding: 15px 20px;
    }
}
.classify-tabs-pc {
    .classify-list-2 {
        span {
            &::after {
                height: 2px;
                bottom: -2px;
            }
        }
    }
}
</style>
