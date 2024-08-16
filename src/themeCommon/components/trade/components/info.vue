<template>
    <div class='popup-info'>
        <div class='popup-status'>
            <van-icon :name='icon' size='40' />
            <p v-if='text' class='title'>
                {{ text }}
            </p>
            <p v-if='des' class='des'>
                {{ des }}
            </p>
        </div>
        <div class='popup-info-content'>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    props: {
        // 文案
        text: String,
        des: String,
        // 状态
        status: {
            type: Number,
            default: 0, // 1 info 2 succ 3 fail
        }
    },
    setup (props) {
        // 图标
        const icon = computed(() => {
            let res = ''
            switch (props.status) {
                case 2:
                    res = 'passed'
                    break
                case 3:
                    res = 'close'
                    break
                default:
                    res = 'info-o'
            }
            return res
        })
        return {
            icon
        }
    }
}
</script>

<style lang='scss' scoped>
.popup-info {
    .popup-status {
        text-align: center;
        font-size: 18px;
        margin-bottom: 32px;
        .van-icon {
            color: var(--primary);
        }
        .title {
            margin-top: 10px;
        }
        .des {
            color: var(--normalColor);
        }
    }
}
</style>
