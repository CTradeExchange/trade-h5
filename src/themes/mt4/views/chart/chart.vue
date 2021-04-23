<template>
    <div ref='chartWrap' class='chartWrap'>
        <tv ref='tv'>
            <template #default='{ setSymbol,resolutionList, setResolution, filterProductList }'>
                <Top>
                    <template #right>
                        <div class='resolution-wrap'>
                            <van-popover
                                v-model:show='showProductPopover'
                                :actions='filterProductList'
                                class='tv-product-popover'
                                @select='e => setSymbol(e.value)'
                            >
                                <template #reference>
                                    <van-button type='primary'>
                                        产品
                                    </van-button>
                                </template>
                            </van-popover>
                        </div>

                        <div class='resolution-wrap'>
                            <van-popover
                                v-model:show='showResolutionPopover'
                                :actions='resolutionList'
                                class='tv-resolution-popover'
                                theme='dark'
                                @select='e => setResolution(e.value)'
                            >
                                <template #reference>
                                    <van-button type='primary'>
                                        周期
                                    </van-button>
                                </template>
                            </van-popover>
                        </div>
                    </template>
                </Top>
            </template>
        </tv>
    </div>
</template>

<script>
import Top from '@m/layout/top'
import tv from '@/components/tradingview/tv'
import { Popover } from 'vant'
export default {
    components: {
        tv,
        Top,
        [Popover.name]: Popover
    },
    data () {
        return {
            // height: 0,
            // width: 0,
            showProductPopover: false,
            showResolutionPopover: false,
        }
    },
    mounted () {
        // const chartWrap = this.$refs.chartWrap
        // this.height = chartWrap.clientHeight - 100
        // this.width = chartWrap.clientWidth
        console.log('chart mounted')
    },
    methods: {
        propSetSymbol (id) {
            console.log(this.$refs.tv)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/sass/mixin.scss';
.chartWrap {
    flex: 1;
    margin-bottom: rem(100px);
}
</style>

<style lang="scss">
.tv-product-popover {
    .van-popover__action {
        width: auto;
    }
}
.tv-resolution-popover {
    .van-popover__action {
        width: auto;
    }
}
</style>
