<template>
    <div
        ref='dropdown'
        class='dropdown'
        :class="visible ? 'dropdown-active': ''"
        @click.prevent='handleToggle'
    >
        <div class='dropdown-reference'>
            <slot name='reference'>
            </slot>
        </div>
        <div class='dropdown-content' @click.stop>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useClickAway } from '@vant/use'
export default {
    setup () {
        const dropdown = ref()
        const visible = ref(false)
        useClickAway(
            dropdown,
            () => {
                visible.value = false
            },
            { eventName: 'click' }
        )
        const handleToggle = () => {
            visible.value = !visible.value
        }
        const handleVisible = (type) => {
            visible.value = type
        }
        return {
            dropdown,
            visible,
            handleToggle,
            handleVisible
        }
    },
}
</script>

<style lang="scss" scoped>
.dropdown {
    position: relative;
    &.dropdown-active {
        .dropdown-content {
            transform: scaleY(1);
            opacity: 1;
            visibility: visible;
        }
    }
    .dropdown-content {
        width: 100%;
        position: absolute;
        left: 0;
        z-index: 99;
        background-color: var(--contentColor);
        border: 1px solid var(--lineColor);
        border-top: none;
        transition: 0.15s ease-in-out;
        transform-origin: top;
        transform: scaleY(0);
        opacity: 0;
        visibility: hidden;
    }
}
</style>
