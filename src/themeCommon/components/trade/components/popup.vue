<template>
    <van-popup
        v-model:show='show'
        class='py-4 px-5'
        :close-on-click-overlay='false'
        :duration='0.2'
        :overlay='overlay'
        :position='position'
        :style="[
            {
                borderRadius: isPC ? '8px' : '8px 8px 0 0',
                background: 'var(--contentColor)',
                width: isPC ? '450px' : '100%',
            },
            style,
        ]"
        teleport='body'
        :transition-appear='true'
    >
        <div class='flex items-center justify-space-between mb-5'>
            <div class='text-lg font-bold break-all'>
                {{ title || '&nbsp;' }}
            </div>
            <van-icon v-if='closeable' class='font-bold cursor-pointer' name='cross' size='20' @click='handleClose' />
        </div>
        <slot></slot>
    </van-popup>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
    props: {
        // 弹窗位置
        position: {
            type: String,
            default: 'center',
        },
        // 弹窗样式
        style: {
            type: Object,
            default: () => {},
        },
        // show
        show: {
            type: Boolean,
            default: false,
        },
        // 是否可关闭
        closeable: {
            type: Boolean,
            default: false,
        },
        // title
        title: String,
        // 是否显示遮罩层
        overlay: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['close', 'update:show'],
    setup (props, { emit }) {
        const store = useStore()
        const isPC = window.isPC
        // 是否模拟账户
        const isDemo = computed(() => {
            return store.state._user.customerInfo?.companyType === 'demo'
        })
        // 关闭回调
        const handleClose = () => {
            emit('update:show', false)
            emit('close')
        }

        return {
            isPC,
            isDemo,
            handleClose,
        }
    },
}
</script>
