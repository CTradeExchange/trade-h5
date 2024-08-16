<template>
    <div class='progress'>
        <div class='progress-content'>
            <span
                v-if='percent.sell > 0'
                class='fallColor'
                :style='{ width: `${percent.sell}%` }'
            ></span>
            <span
                v-if='percent.buy > 0'
                class='riseColor'
                :style='{ width: `${percent.buy}%` }'
            ></span>
        </div>
        <div class='progress-tips'>
            <p v-if='percent.sell > 0'>
                <span>{{ $t('signal.common.sell') }} </span>
                <span class='fallColor'>
                    {{ ` ${percent.sell}%` }}
                </span>
            </p>
            <p v-if='percent.buy > 0'>
                <span>{{ $t('signal.common.buy') }} </span>
                <span class='riseColor'>
                    {{ ` ${percent.buy}%` }}
                </span>
            </p>
            <p v-if='percent.neutral > 0'>
                <span>{{ $t('signal.common.none') }} </span>
                <span class='bgColor'>
                    {{ ` ${percent.neutral}%` }}
                </span>
            </p>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { toFixed } from '@/utils/calculation'

export default {
    props: {
        // 列表
        item: {
            type: Object,
            default: () => {},
        }
    },
    setup (props) {
        // 百分比
        const percent = computed(() => {
            const res = {
                buy: '0.00', // 买入
                sell: '0.00', // 卖出
                neutral: '0.00' // 无建议
            }
            if (props.item.bratio > 0) {
                res.buy = toFixed(props.item.bratio * 100)
            }
            if (props.item.sratio > 0) {
                res.sell = toFixed(props.item.sratio * 100)
            }
            if (props.item.nratio > 0) {
                res.neutral = toFixed(props.item.nratio * 100)
            }
            return res
        })

        return {
            percent
        }
    }
}
</script>

<style lang="scss" scoped>
.progress {
    .progress-content {
        display: flex;
        align-items: center;
        border-radius: 4px;
        overflow: hidden;
        background: var(--bgColor);
        span {
            display: inline-flex;
            height: 8px;
            transition: width 0.4s;
            &.fallColor {
                background: var(--fallColor);
            }
            &.riseColor {
                background: var(--riseColor);
            }
        }
    }
    .progress-tips {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2px;
        p {
            font-size: 14px;
            @media screen and (max-width: 768px) {
                font-size: 11px;
            }
        }
    }
}

</style>
