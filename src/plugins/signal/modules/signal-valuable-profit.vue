<template>
    <div class='ring'>
        <img class='coin-icon' src='/images/icon/coin.png' />
        <b
            :class='{
                riseColor: formatVal > 0,
                fallColor: formatVal < 0
            }'
        >
            {{ (formatVal > 0 ? "+": '') + formatVal + (unit ? ` ${unit}` : '') }}
        </b>
    </div>
</template>

<script>
import { ref, watch } from 'vue'
// 盈利金额格式化
import { toFixed, plus } from '@/utils/calculation'

export default {
    props: {
        value: [String, Number], // 盈利金额
        unit: String // 单位，默认不传
    },
    setup (props) {
        // 监听盈利金额
        const formatVal = ref(0)
        watch(() => props.value, (newVal) => {
            formatVal.value = plus(toFixed(newVal, 0), 0) // 0不需要负数
        }, { immediate: true })

        return {
            formatVal
        }
    }
}
</script>

<style lang="scss" scoped>
.ring {
    display: flex;
    align-items: center;
    .coin-icon {
        height: 28px;
        margin-right: 6px;
    }
}
</style>

<!-- h5样式 -->
<style lang="scss" scoped>
.h5 {
    .ring {
        .coin-icon {
            height: 24px;
        }
    }
}
</style>
