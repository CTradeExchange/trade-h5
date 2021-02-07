<template>
    <div ref='chartWrap' class='chartWrap'>
        <tv v-if='tvWidth' :height='400' :width='tvWidth' />
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
            tvWidth: 0
        }
    },
    mounted () {
        const chartWrap = this.$refs.chartWrap
        this.tvWidth = chartWrap.clientWidth
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.chartWrap {
    margin: rem(20px);
}
</style>
