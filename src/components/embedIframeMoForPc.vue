<template>
    <div v-if='!loading' id='iframeBox' :style="{ height: formatHeight+ 'px' }">
        <iframe
            v-if='!loading'
            id='mobileIframe'
            frameborder='0'
            sandbox=' allow-forms allow-orientation-lock'
            scrolling='no'
            :src="'https://www.event.headline.net/2311-fomc-nfp-en'"
            strict-origin
            :style="{ transform: `scale(${scale})`, height: formatHeight + 'px' }"
            :width='600'
        ></iframe>
    </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, reactive, toRefs, watch, nextTick } from 'vue'
import { parseJSON } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    props: ['link', 'extra', 'source', 'refresh'],
    setup (props) {
        const store = useStore()
        const state = reactive({
            boxInfo: null,
            scale: 1,
            formatWidth: 0,
            formatHeight: 0,
            loading: true

        })

        console.log(props.extra, '传递过来的数据')

        const handleBoxInfo = (value) => {
            const { HeightAPP, WidthAPP } = JSON.parse(value)
            const offsetWidth = document.getElementById('iframebBodyID').offsetWidth
            if (WidthAPP) {
                const scale = isNaN(offsetWidth / WidthAPP) ? 1 : offsetWidth / WidthAPP
                console.log(scale, '????????????')
                state.formatWidth = offsetWidth
                state.scale = scale
                state.formatHeight = HeightAPP * scale
                console.log(offsetWidth, HeightAPP * scale)
                nextTick(() => {
                    state.loading = false
                })
            }
        }
        watch(() => props.extra, (val) => {
            if (val) {
                handleBoxInfo(val)
            }
        })

        onMounted(() => {
            handleBoxInfo(props.extra)
            window.addEventListener('resize', handleBoxInfo)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('resize', handleBoxInfo)
        })

        return {
          ...toRefs(state),

        }
    },
}
</script>

<style lang="scss" scope>
  #iframeBox {
      width: 300px;
      height: 100%;
      overflow: hidden;
      iframe {
          transform-origin: top;
          &::-webkit-scrollbar {
              display: none;
          }
      }
  }
</style>
