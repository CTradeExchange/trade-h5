<template>
    <div class='page-wrap'>
        <div class='content-top'>
            <div class='quote-wrap'>
                行情
            </div>
            <div class='chart-wrap'>
                <chart />
            </div>
            <div class='handicap-wrap'>
                盘口
            </div>
        </div>
        <div class='orders-wrap'>
            订单
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import chart from './components/chart.vue'
import { useStore } from 'vuex'
export default {
    components: {
        chart
    },
    setup () {
        const store = useStore()
        return { chart }
    },
}
</script>

<style lang="scss" scoped>
@import "@/sass/mixin.scss";

.page-wrap {
    font-size: 14px;
    padding:  8px;
    background: var(--bgColor);

    .content-top {
        min-height: 500px;
        display: flex;
        //justify-content: space-evenly;
        justify-content: space-between;

        >div {
            margin-right: 8px;
            border-radius: 10px;
            background: var(--contentColor);
            &:last-child{
                margin-right: 0;
            }
        }

        .quote-wrap {
            width: 360px;
        }

        .chart-wrap {
            flex: 1;
        }

        .handicap-wrap {
            width: 280px;
        }
    }
    .orders-wrap{
        margin-top: 8px;
        min-height: 300px;
        background: var(--contentColor);
        }
}
</style>
