<template>
    <div
        class='help'
        @mouseenter="handleMouse('enter')"
        @mouseleave="handleMouse('leave')"
    >
        <dropdown
            ref='dropdownRef'
            class='search-product'
        >
            <template #reference>
                <div class='help-title'>
                    <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path clip-rule='evenodd' d='M6.5 3H19v18H6.5v-2.5H4V16h2.5v-2.75H4v-2.5h2.5V8H4V5.5h2.5V3zm6.25 4.75c-.69 0-1.25.56-1.25 1.25v.5H9V9a3.75 3.75 0 116.402 2.652L14 13.053V14.5h-2.5v-2.482l2.134-2.134a1.25 1.25 0 00-.884-2.134zM11.5 19v-2.5H14V19h-2.5z' fill='currentColor' fill-rule='evenodd' />
                    </svg>
                    <span v-if='isPC' class='title'>
                        {{ $t('signal.help.guide') }}
                    </span>
                    <div class='triangle'></div>
                </div>
            </template>
            <div class='help-content'>
                <div class='help-li' @click="handleHelp('driver')">
                    <van-icon name='label-o' />
                    <span>
                        {{ $t('signal.help.newGuide') }}
                    </span>
                </div>
                <div class='help-li' @click="handleHelp('qa')">
                    <van-icon name='todo-list-o' />
                    <span>
                        {{ $t('signal.help.qa') }}
                    </span>
                </div>
            </div>
        </dropdown>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
import dropdown from '@/plugins/signal/components/dropdown'

export default {
    components: {
        dropdown
    },
    emits: ['change'],
    setup (props, { emit }) {
        const dropdownRef = ref(null)
        // 帮助中心
        const handleHelp = (type) => {
            emit('change', type)
            dropdownRef.value.handleVisible(false)
        }

        // 鼠标事件
        const handleMouse = (type) => {
            if (window.isPC) {
                if (type === 'enter') {
                    dropdownRef.value.handleVisible(true)
                } else {
                    dropdownRef.value.handleVisible(false)
                }
            }
        }

        return {
            handleHelp,
            dropdownRef,
            handleMouse,
            isPC: window.isPC
        }
    }
}

</script>

<style lang="scss" scoped>
.help {
    position: absolute;
    right: 0;
    cursor: pointer;
    @media screen and (max-width: 768px) {
        right: 0.4rem;
    }
    .help-title {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 200px;
        @media screen and (max-width: 768px) {
            width: auto;
        }
        &:hover {
            color: var(--primary);
            .triangle {
                border-color: transparent transparent var(--primary) var(--primary);
            }
        }
        svg {
            margin: 0;
            min-width: 0;
            color: currentColor;
            width: 16px;
            height: 16px;
            font-size: 16px;
            fill: #EAECEF;
            fill: currentColor;
            width: 1em;
            height: 1em;
        }
        .title {
            margin: 0 4px;
        }
        .triangle {
            margin-left: 6px;
            margin-top: -5px;
            border: 3px solid;
            border-color: transparent transparent var(--color) var(--color);
            transform: rotate(-45deg);
            content: '';
        }
    }
    .help-content {
        .help-li {
            padding: 0 18px;
            height: 44px;
            display: flex;
            align-items: center;
            &:hover {
                background: var(--bgColor);
            }
            .van-icon {
                line-height: normal;
                margin-right: 6px;
                font-size: 16px;
                @media screen and (max-width: 768px) {
                    font-size: 14px;
                }
            }
        }
    }
    :deep {
        .dropdown-reference {
            padding: 4px 0;
        }
        .dropdown-content {
            border-top: 1px solid var(--lineColor);
            border-radius: 0 0 8px 8px;
            @media screen and (max-width: 768px) {
                width: 180px;
                right: 0;
                left: inherit;
            }
        }
    }
}
</style>
