<template>
    <div v-if='height' id='webIframeID' class='web_iframe'>
        <iframe :height='height' scrolling='no' :src='link' :style="{ background: '#fff' }" width='100%'></iframe>
        <!-- <iframe :height='height' scrolling='no' :src='link' :style="{ background: '#fff' }" width='300'></iframe> -->
    </div>
</template>

<script>
import { computed } from 'vue'
import { parseJSON } from '@/utils/util'
export default {
    props: ['link', 'extra'],
    setup (props) {
        const height = computed(() => {
            const { HeightPC } = parseJSON(props.extra) || {}
            // const { HeightPC } = parseJSON('{"HeightAPP":9204,"HeightPC":8086,"Status":1,"WidthPC":1980,"WidthAPP":320}')
            return HeightPC ? HeightPC + 18 : 8000
        })

        console.log('看看高度数据情况', props.extra)

        return {
            height,
        }
    },
}
</script>

<style lang="scss" scope>
.web_iframe {
    width: 100%;
    height: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
    background: #fff;
}
</style>
