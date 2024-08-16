<template>
    <div class='signal-product'>
        <classify-list
            v-model='classifyValue'
            class='home-classify'
            :is-multiple='false'
            :list='product'
            :size='isPC ? "lg": ""'
            :style-type='1'
        />
        <product-list
            :is-real-time='true'
            :limit='4'
            :list='list'
            :params='params'
            :show-exipre-style='true'
        />
        <tips />
        <!-- 查看更多 -->
        <view-more @click='handleMore' />
    </div>
</template>

<script>
import { computed, toRefs, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import classifyList from '@/plugins/signal/components/classify-list'
import productList from '@/plugins/signal/components/product-list.vue'
import signalHook from '@/plugins/signal/hooks/signal'
import viewMore from '@/plugins/signal/components/view-more.vue'
import tips from '@/plugins/signal/modules/home/home-tip.vue'

export default {
    components: {
        classifyList,
        productList,
        viewMore,
        tips
    },
    props: {
        // 信号类型
        signalType: String,
        // 数据长度
        limit: {
            type: Number,
            default: 8
        },
        params: {
            type: Object,
            default: () => {}
        }
    },
    setup (props) {
        const store = useStore()
        const { jumpSignalTab } = signalHook()
        const isPC = window.isPC

        const state = reactive({
            fieldName: 'sc',
            classifyValue: '', // 分类值
            list: [], // 产品列表
        })

        const product = computed(() => {
            return store.state._signal.config.product
        })

        const tabParams = computed(() => {
            return store.state._signal.homeTabSignalParams[props.signalType] || {}
        })

        // 初始化分类
        watch([() => product.value, () => tabParams.value], (newVal) => {
            if (newVal[0].length) {
                if (newVal[1].hasOwnProperty(state.fieldName)) {
                    state.classifyValue = newVal[1][state.fieldName]
                } else {
                    state.classifyValue = newVal[0][0].value
                }
            }
        }, { immediate: true })

        // 展示产品列表 [移动端取热门产品]
        watch(() => state.classifyValue, (newVal) => {
            const productList = product.value.find(item => item.value === newVal)?.children || []
            state.list = isPC ? productList.slice(0, props.limit) : productList.filter(item => item.isHot)
            store.commit('_signal/Update_homeSignalValue', {
                type: props.signalType,
                params: {
                    [state.fieldName]: state.classifyValue
                }
            })
        }, { immediate: true })

        // 更多
        const handleMore = () => {
            jumpSignalTab(props.signalType, {
                [state.fieldName]: state.classifyValue
            })
        }

        return {
            ...toRefs(state),
            handleMore,
            product,
            isPC,
        }
    }
}

</script>

<style lang="scss" scoped>
.signal-product {
    :deep {
        .signal-product-list {
            margin-top: 24px;
        }
    }
    .home-classify {
        margin: 10px 0;
    }
}

</style>
