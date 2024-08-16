<template>
    <div class="modal-container">
        <div ref='drawRef' class='modal-container-box' :class="[modelValue && 'show']">
            <div class='maskBack' @click='handleHide(true)'></div>
            <div class='mask' @click='handleHide(true)'></div>
            <div class='draw-page' :style="{ '--w': w }">
                <div class='page-header'>
                    <button @click='handleHide()'>
                        <van-icon class='back' name='down' />
                    </button>
                    <button v-if="rightText" @click='handleToPage'>
                        {{ rightText }}<van-icon name='arrow' />
                    </button>
                </div>
                <div v-if='slotExist && modelValue' class='page-content'>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    reactive,
    watch,
    toRefs,
    computed,
    useSlots,
    onBeforeUnmount,
} from 'vue'

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        rightText: {
            type: String,
            default: ''
        },
        width: {
            type: [Number, String],
            default: 500
        },
        back: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
        const state = reactive({
            drawRef: null,
            pageFlag: false,
            slotExist: computed(() => !!useSlots().default),
            w: computed(() => {
                if (typeof Number(props.width) === 'number') {
                    return `${props.width}px`
                } else {
                    return props.width
                }
            })
        })

        const handleHide = (flag) => {
            if (!props.back || flag) {
                emit('update:modelValue', false)
            } else {
                emit('onBack')
            }
        }

        const handleToPage = () => {
            state.pageFlag = true
            emit('update:modelValue', false)
            emit('toPage')
        }

        watch(
            () => props.modelValue,
            (newOld) => {
                document.getElementById('app').style = newOld
                    ? 'overflow: hidden;'
                    : ''
                if (!newOld && !state.pageFlag) {
                    emit('onBack')
                }
            }
        )

        onBeforeUnmount(() => {
            document.getElementById('app').style = ''
        })

        return {
            handleToPage,
            handleHide,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.modal-container {
    position: fixed;
    top: 0;
    left: 100px;
    right: 0;
    bottom: 0;
    z-index: 999;
    padding-top: 87px;
    background: rgba(0, 0, 0, 0.36);
}
.modal-container-box {
    position: fixed;
    top: 0;
    left: 100px;
    right: 0;
    bottom: 0;
    z-index: 999;
    transform: translateX(100%);
    transition: all linear 0.3s;
    padding-top: 87px;
    cursor: pointer;
    &.show {
        transform: translate(0);
    }
}
.maskBack {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
}
.mask {
    position: absolute;
    height: 100%;
    width: 100%;
}
.draw-page {
    position: absolute;
    width: var(--w);
    height: calc(100% - 87px);
    box-shadow: 0px 9px 24px 0px rgba(4, 0, 0, 0.1);
    right: 0;
    background: var(--contentColor);
    .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 54px;
        color: var(--contentColor);
        font-size: 14px;
        background: var(--color3c);
        padding: 0 15px;
        button {
            background: transparent;
            cursor: pointer;
            .back {
                transform: rotate(90deg);
            }
        }
    }
    .page-content {
        height: calc(100% - 54px);
        position: relative;
        background: var(--bgColor);
    }
}
</style>
