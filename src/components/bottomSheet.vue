<template>
    <Teleport to='body'>
        <div
            ref='bottomSheet'
            :aria-hidden='!showSheet'
            class='bottom-sheet'
            role='dialog'
            :style="{
                '--maxHeightString': maxHeightString,
                '--sheetHeightString': sheetHeightString,
                '--translateValueString': translateValueString,
                position: showSheet ? 'absolute' : 'fixed',
            }"
        >
            <transition>
                <div v-show='overlay && showSheet' class='bottom-sheet__overlay' @click='clickOnOverlayHandler'></div>
            </transition>
            <div ref='bottomSheetContent' :class='sheetContentClasses'>
                <header ref='bottomSheetHeader' class='bottom-sheet__header'>
                    <div ref='bottomSheetDraggableArea' class='bottom-sheet__draggable-area'>
                        <div class='bottom-sheet__draggable-thumb'></div>
                    </div>
                    <slot name='header'></slot>
                </header>
                <main ref='bottomSheetMain' class='bottom-sheet__main'>
                    <slot></slot>
                </main>
                <footer ref='bottomSheetFooter' class='bottom-sheet__footer'>
                    <slot name='footer'></slot>
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, defineProps, defineEmits, defineExpose } from 'vue'
import Hammer from 'hammerjs'

const props = defineProps({
    overlay: {
        type: Boolean,
        default: true,
    },
    overlayClickClose: {
        type: Boolean,
        default: true,
    },
    canSwipe: {
        type: Boolean,
        default: true,
    },
    maxHeight: {
        type: Number,
        default: 540,
    },
})

/**
 * Bottom sheet emit interface
 */
const emit = defineEmits(['opened', 'closed', 'dragging-up', 'dragging-down'])

/**
 * Show or hide sheet
 */
const showSheet = ref(false)

/**
 * Sheet height value
 */
const sheetHeight = ref(0)

/**
 * Dynamic translate value
 */
const translateValue = ref(100)

/**
 * Flag to check if sheet is being dragged
 */
const isDragging = ref(false)

/**
 * Content scrolled value
 */
const contentScroll = ref(0)

/**
 * Refs to all sheet HTML elements
 */
const bottomSheet = ref(null)
const bottomSheetHeader = ref(null)
const bottomSheetMain = ref(null)
const bottomSheetFooter = ref(null)
const bottomSheetContent = ref(null)
const bottomSheetDraggableArea = ref(null)

/**
 * Close bottom sheet when escape key is pressed
 * @param element
 */
const isFocused = (element) => document.activeElement === element
window.addEventListener('keyup', (event) => {
    const isSheetElementFocused = bottomSheet.value?.contains(event.target) && isFocused(event.target)

    if (event.key === 'Escape' && !isSheetElementFocused) {
        close()
    }
})

/**
 * Return all classes for bottom sheet content
 */
const sheetContentClasses = computed(() => {
    return [
        'bottom-sheet__content',
        {
            'bottom-sheet__content--fullscreen': sheetHeight.value >= window.innerHeight,
            'bottom-sheet__content--dragging': isDragging.value,
        },
    ]
})

/**
 * Return sheet height string with px
 */
const sheetHeightString = computed(() => {
    return sheetHeight.value && sheetHeight.value > 0 ? `${sheetHeight.value + 1}px` : 'auto'
})

/**
 * Return max height string
 */
const maxHeightString = computed(() => {
    return props.maxHeight ? `${props.maxHeight}px` : 'inherit'
})

/**
 * Return current translate value string with percents
 */
const translateValueString = computed(() => {
    return `${translateValue.value}%`
})

/**
 * Calculate sheet height
 */
const initHeight = async () => {
    await nextTick()
    sheetHeight.value = bottomSheetHeader.value?.offsetHeight + bottomSheetMain.value?.clientHeight + bottomSheetFooter.value?.offsetHeight
}

/**
 * Move sheet while dragging
 * @param event
 * @param type
 */

const dragHandler = (event, type) => {
    if (props.canSwipe) {
        isDragging.value = true

        const preventDefault = (e) => {
            e.preventDefault()
        }

        if (event.deltaY > 0) {
            if (type === 'main' && event.type === 'panup') {
                translateValue.value = pixelToVh(event.deltaY)
                if (event.cancelable) {
                    bottomSheetMain.value?.addEventListener('touchmove', preventDefault)
                }
            }

            if (type === 'main' && event.type === 'pandown' && contentScroll.value === 0) {
                translateValue.value = pixelToVh(event.deltaY)
            }

            if (type === 'area') {
                translateValue.value = pixelToVh(event.deltaY)
            }

            if (event.type === 'panup') {
                emit('dragging-up')
            }
            if (event.type === 'pandown') {
                emit('dragging-down')
            }
        }

        if (event.isFinal) {
            bottomSheetMain.value?.removeEventListener('touchmove', preventDefault)

            if (type === 'main') {
                contentScroll.value = bottomSheetMain.value?.scrollTop
            }
            isDragging.value = false
            if (translateValue.value >= 10) {
                close()
            } else {
                translateValue.value = 0
            }
        }
    }
}

nextTick(() => {
    /**
     * Set initial card height
     */
    initHeight()

    /**
     * Create instances of Hammerjs
     */
    const hammerAreaInstance = new Hammer(bottomSheetDraggableArea.value, {
        inputClass: Hammer.TouchMouseInput,
        recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]],
    })

    // const hammerMainInstance = new Hammer(bottomSheetMain.value, {
    //     inputClass: Hammer.TouchMouseInput,
    //     recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]],
    // })

    /**
     * Set events and handlers to hammerjs instances
     */
    hammerAreaInstance.on('panstart panup pandown panend', (e) => {
        dragHandler(e, 'area')
    })

    // hammerMainInstance.on('panstart panup pandown panend', (e) => {
    //     dragHandler(e, 'main')
    // })
})

/**
 * Open bottom sheet method
 */
const open = () => {
    translateValue.value = 0
    document.documentElement.style.overflowY = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    showSheet.value = true
    emit('opened')
}

/**
 * Close bottom sheet method
 */
const close = async () => {
    showSheet.value = false
    translateValue.value = 100
    setTimeout(() => {
        document.documentElement.style.overflowY = 'auto'
        document.documentElement.style.overscrollBehavior = ''
        emit('closed')
    }, props.transitionDuration * 1000)
}

/**
 * Click on overlay handler
 */
const clickOnOverlayHandler = () => {
    if (props.overlayClickClose) {
        close()
    }
}

/**
 * Convert pixels to vh
 * @param pixel
 */
const pixelToVh = (pixel) => {
    const height = props.maxHeight && props.maxHeight <= sheetHeight.value ? props.maxHeight : sheetHeight.value
    return (pixel / height) * 100
}

/**
 * Define public methods
 */
defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.bottom-sheet {
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: visibility 0.5s;

    * {
        box-sizing: border-box;
    }

    &[aria-hidden='false'] {
        visibility: visible;
    }

    &[aria-hidden='true'] {
        visibility: hidden;
        pointer-events: none;
    }

    &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        background: rgba(0, 0, 0, 0.5);
    }

    &__content {
        display: flex;
        flex-direction: column;
        border-radius: 16px 16px 0 0;
        background: #ffffff;
        overflow-y: hidden;
        transform: translate3d(0, var(--translateValueString), 0);
        height: var(--sheetHeightString);
        width: 100%;
        max-height: var(--maxHeightString);
        box-sizing: border-box;
        pointer-events: all;

        &--fullscreen {
            border-radius: 0;
        }

        &:not(.bottom-sheet__content--dragging) {
            transition: 0.5s ease;
        }
    }

    &__draggable-area {
        width: 100%;
        margin: auto;
        padding: 16px;
        cursor: grab;
    }

    &__draggable-thumb {
        width: 40px;
        height: 4px;
        background: #333333;
        border-radius: 8px;
        margin: 0 auto;
    }

    &__main {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        box-sizing: border-box;
        -webkit-overflow-scrolling: touch;
        touch-action: auto !important;

        &::-webkit-scrollbar {
            height: 8px;
            width: 8px;
        }
        &::-webkit-scrollbar-corner {
            display: none;
        }
        &:hover::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0);
        }
    }

    &__footer:empty {
        display: none;
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
