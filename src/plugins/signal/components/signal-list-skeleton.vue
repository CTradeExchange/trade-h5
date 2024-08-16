<template>
    <div class='list-skeleton'>
        <skeleton
            v-if='skeletonShow'
            :limit='limit'
        />
        <slot v-else-if='!skeletonShow && list.length > 0'>
        </slot>
        <noneData v-else :description='noDataText' />
    </div>
</template>

<script>
import skeleton from './skeleton.vue'
import noneData from './none-data.vue'

export default {
    components: {
        skeleton,
        noneData
    },
    props: {
        // 是否显示骨架
        skeletonShow: {
            type: Boolean,
            default: false
        },
        // 列表数据
        list: {
            type: Array,
            default: () => []
        },
        // 数据长度
        limit: {
            type: Number,
            default: 10
        },
        // 置空说明
        noDataText: String,
    }
}
</script>

<style lang="scss" scoped>
.list-skeleton {

}
</style>
