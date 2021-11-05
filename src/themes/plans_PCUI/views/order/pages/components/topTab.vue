<template>
    <el-tabs v-model:active='active' class='tabs' @tab-click='updataActive'>
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

.tabs {
    box-sizing: border-box;
    width: 100%;
    padding: 0 rem(20px);
}
.tabs {
    margin: 16px 0 0 0;
    :deep{
        .el-tabs__nav-wrap::after, .el-tabs__active-bar{
            display: none;
        }
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__item{
            height: 32px;
            line-height: 32px;
            padding: 0 11px!important;
            background: var(--assistColor);
            color: var(--color);
            border-radius: 4px;
            margin: 0 0 0 8px;
            font-weight: 400;
            color: var(---color);
            &.is-active{
                color: var(--el-color-primary);
            }
        }
    }
}
</style>
