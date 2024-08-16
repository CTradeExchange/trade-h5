<template>
    <div class='popup-countdown flex items-center flex-col justify-center'>
        <div class='popup-loading'>
            <i></i>
        </div>
        <div v-if='text' class='status'>
            {{ text }}
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
    props: {
        // 弹窗位置
        text: String,
        // loading时长
        duration: {
            type: Number,
            default: 1000,
        }
    },
    emits: ['callback'],
    setup (props, { emit }) {
        onMounted(() => {
            setTimeout(() => {
                emit('callback')
            }, props.duration)
        })
        return {}
    }
}
</script>

<style lang='scss' scoped>
.popup-countdown {
    min-height: 240px;
    .popup-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        span {
            position: absolute;
            font-size: 32px;
        }
        i {
            display: block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: transparent;
            box-shadow: 3px 0 var(--primary);
            animation: rotate 1s linear infinite;
            transform-origin: center center;
        }
        @keyframes rotate {
            100% {
                transform: rotate(360deg);
            }
        }
    }
    .status {
        padding: 30px 0;
        font-size: 18px;
        text-align: center;
        @media screen and (max-width: 768px) {
            font-size: 16px;
        }
    }
}
</style>
