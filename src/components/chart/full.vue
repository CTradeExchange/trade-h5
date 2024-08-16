<template>
    <popover v-if='isFull' :text="$t('trade.cancelFullScreen')" touch-disabled>
        <template #reference>
            <span class='fullIcon' @click='fullHandler'>
                <svg
                    height='18'
                    viewBox='0 0 24 24'
                    width='18'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlns:xlink='http://www.w3.org/1999/xlink'
                >
                    <g fill='none'>
                        <path
                            d='M8.5 3.75a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5A2.25 2.25 0 0 0 8.5 6.25v-2.5zm0 16.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 1 0-1.5h2.5a2.25 2.25 0 0 1 2.25 2.25v2.5zM16.25 3a.75.75 0 0 0-.75.75v2.5a2.25 2.25 0 0 0 2.25 2.25h2.5a.75.75 0 0 0 0-1.5h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75zm-.75 17.25a.75.75 0 0 0 1.5 0v-2.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 0 0-1.5h-2.5a2.25 2.25 0 0 0-2.25 2.25v2.5z'
                            fill='currentColor'
                        />
                    </g>
                </svg>
            </span>
        </template>
    </popover>
    <popover v-else :text="$t('trade.fullScreen')" touch-disabled>
        <template #reference>
            <span class='fullIcon' @click='fullHandler'>
                <svg height='22' viewBox='0 0 20 28' width='22' xmlns='http://www.w3.org/2000/svg'>
                    <path
                        d='M8.5 6A2.5 2.5 0 0 0 6 8.5V11h1V8.5C7 7.67 7.67 7 8.5 7H11V6H8.5zM6 17v2.5A2.5 2.5 0 0 0 8.5 22H11v-1H8.5A1.5 1.5 0 0 1 7 19.5V17H6zM19.5 7H17V6h2.5A2.5 2.5 0 0 1 22 8.5V11h-1V8.5c0-.83-.67-1.5-1.5-1.5zM22 19.5V17h-1v2.5c0 .83-.67 1.5-1.5 1.5H17v1h2.5a2.5 2.5 0 0 0 2.5-2.5z'
                        fill='currentColor'
                    />
                </svg>
            </span>
        </template>
    </popover>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
const isFull = ref(false)
// 全屏的回调事件
const fullscreenchangeCallback = (e) => {
    isFull.value = !!document.fullscreenElement
}

// 图表全屏
const fullHandler = () => {
    const fullEl = document.querySelector('#chartContent')
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        fullEl.requestFullscreen()
    }
}

onMounted(() => {
    // 全屏触发事件
    const fullEl = document.querySelector('#chartContent')
    fullEl.addEventListener('fullscreenchange', fullscreenchangeCallback, false)
})

onUnmounted(() => {
    const fullEl = document.querySelector('#chartContent')
    if (fullEl) {
        fullEl.removeEventListener('fullscreenchange', fullscreenchangeCallback, false)
    }
})
</script>
