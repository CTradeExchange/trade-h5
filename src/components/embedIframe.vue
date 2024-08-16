<template>
    <div v-if='boxInfo' id='iframeBox' :style="{ height: boxInfo?.hei + 'px' }">
        <iframe
            v-if='!!height'
            :src='link'
            :style="{ transform: `scale(${scale})`, height: height + 'px' }"
            width='100%'
        ></iframe>
    </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, reactive, toRefs, watch } from 'vue'
import { parseJSON } from '@/utils/util'
import { useStore } from 'vuex'
export default {
    props: ['link', 'extra', 'source', 'refresh'],
    setup (props) {
        const dfw = [320, 980]
        const store = useStore()
        const state = reactive({
            boxInfo: null,
            scale: 1,
            height: 0,
            heiBox: 0,
        })

        // console.log(props, '!!!!!!!!!!!!!!!!!!!!!!!!')

        const width = computed(() => {
            const arr = store.state._base.newsSysConfig
            const obj = arr.find(i => i.Key === 'embedSourcePlatform') || {}
            const config = parseJSON(obj.Value) || {}
            const res = config.value || {}
            const { appWidth } = res[props.Source] || Object.values(res)[0] || {}
            return Number(appWidth) || dfw[0]
        })

        const handleBoxInfo = () => {
            const offsetWidth = document.getElementById('iframebBodyID').offsetWidth
            const offsetHeight = document.getElementById('iframebBodyID').offsetHeight
            const offsetHeights = document.getElementById('cardBoxID')?.offsetHeight
            state.boxInfo = {
                wid: offsetWidth,
                hei: offsetHeight,
                fHei: offsetHeights,
            }
        }

        watch(() => state.boxInfo, () => {
            if (state.boxInfo && state.boxInfo?.wid) {
                const { wid, hei, fHei } = state.boxInfo
                const scale = isNaN(wid / width.value) ? 1 : wid / width.value
                state.scale = scale
                state.height = Math.floor((hei - fHei) / scale)
            }
        })

        watch(() => props.refresh, () => handleBoxInfo())

        onMounted(() => {
            handleBoxInfo()
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
      width: 100%;
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
