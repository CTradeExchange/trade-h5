<template>
    <view class='signal-list' @click='handleClick'>
        <signal-list
            :limit='limit'
            :list='limit ? list.slice(0, limit) : list'
            :show-subscribe='false'
            :skeleton-show='skeletonShow'
        />
    </view>
</template>

<script>
import { searchQuotapIndicator } from '@/plugins/signal/api/index'
import signalList from '@/plugins/signal/components/signal-list.vue'
export default {
    components: {
        signalList
    },
    props: {
        keyword: String, // 信号类型
        limit: {
            type: Number,
            default: 5
        }
    },
    emits: ['save-history'],
    data () {
        return {
            list: [],
            skeletonShow: true, // 骨架
        }
    },
    watch: {
        keyword: {
            handler () {
                this.loadData()
            },
            immediate: true
        }
    },
    methods: {
        loadData () {
            return searchQuotapIndicator({
                kw: this.keyword,
                type: 'keyword',
                limit: 50,
            }).then((res) => {
                if (res.code === '0') {
                    this.skeletonShow = false
                    this.list = res.data.items
                }
            })
        },
        handleClick () {
            // 当有数据的时候，点击列表保存当前关键字
            if (this.list && this.skeletonShow === false) {
                this.$emit('save-history')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/plugins/signal/style/signal.scss';
</style>
