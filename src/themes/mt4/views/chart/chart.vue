<template>
    <div ref='chartWrap' class='chartWrap'>
        <tv v-if='height' :height='height' :width='width' />
    </div>
</template>

<script>
import tv from '@/components/tradingview/tv'
export default {
    components: {
        tv
    },
    data () {
        return {
            height: 0,
            width: 0,
        }
    },
    mounted () {
        const chartWrap = this.$refs.chartWrap
        const footerMenu = document.querySelector('#footerMenu')
        this.height = chartWrap.clientHeight - footerMenu.clientHeight
        this.width = chartWrap.clientWidth
        console.log('chart mounted')
    },

}
</script>

<style lang="scss" scoped>

</style>
