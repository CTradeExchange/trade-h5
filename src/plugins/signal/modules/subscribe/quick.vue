<template>
    <div class='section-quick'>
        <loading
            :duration='0'
            :text='$t("signal.subscribe.subscribingForYou")'
            @callback='handleCallback'
        />
        <div class='section-quick-desc'>
            <span class='list-item-signal'>
                {{ getIndicatorName(payload) }}
            </span>
            <product-icon
                :show-symbol-icon='false'
                :symbol-code='payload.sy'
            />
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import loading from '@/themeCommon/components/trade/components/loading.vue'
import productIcon from '@/plugins/signal/components/product-icon.vue'

export default {
    // 快捷参数
    components: {
        loading,
        productIcon
    },
    props: {
        payload: {
            type: Object,
            default: () => {}
        },
    },
    emits: ['callback'],
    setup (props, { emit }) {
        const store = useStore()
        // 获取指标名称
        const getIndicatorName = (item) => {
            return store.getters['_signal/getIndicatorName'](item)
        }
        // 回调
        const handleCallback = () => {
            emit('callback')
        }
        return {
            getIndicatorName,
            handleCallback
        }
    }
}

</script>

<style lang="scss" scoped>
.section-quick {
    padding: 20px 0;
    text-align: center;
}
.section-quick-desc {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    .list-item-signal {
        margin-right: 10px;
    }
}
</style>
