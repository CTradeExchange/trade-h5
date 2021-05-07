<template>
    <Top :back='true' :menu='false' title='' />
    <van-search v-model='value' placeholder='请输入搜索关键词' />
</template>

<script>
import Top from '@m/layout/top'
import { getSymbolList } from '@/api/trade'
import { onBeforeMount } from 'vue'
export default {
    components: {
        Top,
    },
    setup (props) {
        onBeforeMount(() => {
            const params = {}
            getSymbolList(params).then(res => {

            }).catch(err => {

            })
        })
    }
}
</script>
