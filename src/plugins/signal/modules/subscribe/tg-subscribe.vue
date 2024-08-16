<template>
    <div v-if='!tgInfo.link'>
        <a v-if='isLink' class='tg-subscribe-link' @click.stop='handleTg'>
            <slot>
                <span class='tg-subscribe-span'>
                    <i class='icon_telegram_outline iconfont'></i>
                    {{ tgInfo.link ? $t('signal.subscribe.openTgSignal') : $t('signal.subscribe.getTgSignal') }}
                </span>
            </slot>
        </a>
        <van-button
            v-else
            block
            :loading='tgInfo.isLoad === false'
            :loading-text="tgInfo.link ? $t('signal.subscribe.openTgSignal') : $t('signal.subscribe.getTgSignal')"
            type='primary'
            @click.stop='handleTg'
        >
            <slot>
                <span class='tg-subscribe-span'>
                    <i class='icon_telegram_outline iconfont'></i>
                    {{ tgInfo.link ? $t('signal.subscribe.openTgSignal') : $t('signal.subscribe.getTgSignal') }}
                </span>
            </slot>
        </van-button>
        <tg-subscribe-confirm v-if='isTgSubscribe' @close='isTgSubscribe = false' />
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import tgSubscribeConfirm from './tg-subscribe-confirm.vue'

export default {
    components: {
        tgSubscribeConfirm,
    },
    props: {
        // 是否链接
        isLink: {
            type: Boolean,
            default: false,
        },
        // ga信号埋点
        dataGaSignal: String,
        // ga埋点列表
        dataGaSignalItem: {
            type: Object,
            default: () => {}
        }
    },
    emits: ['tgSubscribe'],
    setup (props, { emit }) {
        const store = useStore()
        const customerInfo = computed(() => store.state._user.customerInfo)

        // tg绑定信息
        const tgInfo = computed(() => {
            return store.state._signal.tgInfo
        })
        const isPC = window.isPC

        const state = reactive({
            loading: false,
            link: '', // 可用链接
            isTgSubscribe: false
        })

        // 获取tg信息
        const handleTg = () => {
            if (!customerInfo.value) {
                // 未登录的客户，固定跳转至：https://t.me/Headline_OfficialBot
                window.open('https://t.me/Headline_OfficialBot')
                return
            }
            if (tgInfo.value.isLoad === false) {
                return
            }
            if (tgInfo.value.link) {
                window.open(tgInfo.value.link)
            } else {
                state.isTgSubscribe = true
            }
        }

        return {
            isPC,
            tgInfo,
            handleTg,
          ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>

.tg-subscribe-link {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.tg-subscribe-span {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  .icon_telegram_outline {
      line-height: normal;
      font-size: 20px;
      margin-right: 3px;
  }
}
</style>
