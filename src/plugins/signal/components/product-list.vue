<template>
    <div class='signal-product-list'>
        <productItem
            v-for='(item, index) in list'
            :key='item.value'
            :index='index'
            :is-real-time='isRealTime'
            :limit='limit'
            :params='params'
            :symbol-code='item.value'
        />
    </div>
</template>

<script>
import productItem from './product-item.vue'

export default {
    components: {
        productItem
    },
    props: {
        // 数据长度
        limit: {
            type: Number,
            default: 4
        },
        list: {
            type: Array,
            default: () => []
        },
        // 筛选条件[监听行情和请求]
        params: {
            type: Object,
            default: () => {}
        },
        // 是否实时数据
        isRealTime: {
            type: Boolean,
            default: true
        },
        // 是否展示过期背景
        showExipreStyle: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
</style>
