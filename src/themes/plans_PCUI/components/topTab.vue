<template>
    <el-tabs v-model:active='active' @tab-click='updataActive'>
        <el-tab-pane v-for='(item, index) in list' :key='index' class='tab' :label='item.title' :name='String(index)' />
    </el-tabs>
</template>

<script>
import { ElTabs, ElTabPane } from 'element-plus'
export default {
    name: 'Tab',
    components: {
        [ElTabs.name]: ElTabs,
        [ElTabPane.name]: ElTabPane
    },
    emits: ['update:modelValue', 'tabClick'],
    props: {
        type: {
            type: String,
            default: 'line'
        },
        background: {
            type: String,
            default: '#fff'
        },
        color: {
            type: String,
            default: '#477FD3'
        },
        titleActiveColor: {
            type: String,
            default: '#477FD3'
        },
        titleInactiveColor: {
            type: String,
            default: '#333'
        },
        border: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: function () {
                return []
            }
        },
        modelValue: {
            type: [String, Number],
            default: 0
        }
    },
    data () {
        return {
            active: 0
        }
    },

    watch: {
        modelValue () {
            this.active = this.modelValue
        },
        list: {
            deep: true,
            handler () {
                this.$refs.tabs && this.$refs.tabs.resize()
            }
        }
    },
    created () {
        this.active = this.modelValue
    },
    methods: {
        updataActive (data) {
            this.$emit('update:modelValue', data.paneName)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
:deep(.van-tabs__wrap) {
    height: rem(80px);
    padding: rem(10px) 0;
    overflow-y: hidden;
    line-height: rem(60px);
    .van-tabs__nav {
        .van-tab {
            flex: none;
            margin: 0 rem(10px);
            padding: 0 !important;
            text-align: left;
            &:first-child {
                margin: 0;
            }
            .van-tab__text {
                height: 100%;
            }
            &.van-tab--active {
                background: var(--primaryAssistColor);
                border-radius: rem(6px);
                .text {
                    font-weight: 700;
                }
            }
        }
    }
}
.van-tab--active {
    .text {
        color: var(--primary);
        // animation: zoomText 0.26s ease normal forwards;
    }
}
.text {
    height: 100%;
    color: var(--color);
    font-weight: 400;
    font-size: rem(28px);
    line-height: rem(60px);
}
.title {
    height: 100%;
    padding: 0 rem(26px);
    .icon {
        font-size: rem(24px);
        font-style: normal;
    }
}

</style>
