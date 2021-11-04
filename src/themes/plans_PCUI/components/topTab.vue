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
</style>
