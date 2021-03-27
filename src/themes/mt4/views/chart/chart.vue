<template>
    <Top />
    <div ref='chartWrap' class='chartWrap'>
        <tv v-if='height' :height='height' :width='width' />
    </div>
</template>

<script>
import Top from '@m/layout/top'
import tv from '@/components/tradingview/tv'
export default {
    components: {
        tv,
        Top,
    },
    data () {
        return {
            height: 0,
            width: 0,
        }
    },
    mounted () {
        const chartWrap = this.$refs.chartWrap
        this.height = chartWrap.clientHeight
        this.width = chartWrap.clientWidth
        console.log('chart mounted')
    },

}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.chartWrap {
    flex: 1;
    margin-bottom: rem(100px);
}
</style>
