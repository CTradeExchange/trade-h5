<template>
    <b :class='currentColor'>
        {{ actionName }}
    </b>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    props: {
        // 方向
        direction: String,
        // 是否显示无交易建议
        checkNeutral: {
            type: Boolean,
            default: false,
        },
        // 是否总结
        isSummary: {
            type: Boolean,
            default: false,
        }
    },
    setup (props) {
        const store = useStore()
        const { t } = useI18n({ useScope: 'global' })

        // 当前文字颜色
        const currentColor = computed(() => {
            let color = ''
            if (props.direction === 'buy' || props.direction === 'sell') {
                color = (props.direction === 'buy') ? 'riseColor' : 'fallColor'
            } else if (props.checkNeutral) {
                color = 'text-minorColor'
            }
            return color
        })
        // 文案
        const actionName = computed(() => {
            let name = store.getters['_signal/getActionName'](props.direction)
            if (name === '--' && props.checkNeutral) {
                name = props.isSummary ? t('signal.common.neutral') : t('signal.common.none')
            }
            return name
        })

        return {
            currentColor,
            actionName
        }
    }
}
</script>
