<template>
    <el-dialog
        v-model='show'
        :before-close='close'
        :close-on-click-modal='false'
        :title='detailInfo.title'
        width='800px'
    />
</template>

<script>
import { reactive, toRefs } from 'vue'

export default {
    setup () {
        const state = reactive({
            // 是否显示弹窗
            show: false,
            // 详情数据
            detailInfo: {}
        })

        // 打开弹窗
        const open = (data) => {
            console.log(1111, data)
            state.detailInfo = data
            state.show = true
        }

        // 关闭弹窗
        const close = () => {
            state.show = false
        }

        return {
            ...toRefs(state),
            open,
            close
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
