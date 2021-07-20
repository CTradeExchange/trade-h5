<template>
    <div ref='chartEl'>
        <svg
            v-if='renderList && renderList.length > 0'
            class='doughnut-svg'
            :height='svgData.height'
            :viewBox='`0 0 ${svgData.width} ${svgData.height}`'
            :width='svgData.width'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                v-for='(cur, index) in renderList'
                :key='index'
                :d='getPathItem(cur)'
                fill='none'
                :stroke='colorMap[index]'
                :stroke-width='arcData.stockWidth'
            />
        </svg>
    </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted, ref } from 'vue'
export default {
    setup (props) {
        const chartEl = ref(null)
        const state = reactive({
            list: [
                // 占比列表
                '50%',
                '10%',
                '20%',
                '20%'
            ],
            renderList: [], // 处理后用于渲染环形图的数据
            svgData: {
                // svg 数据 即画布参数
                width: 300,
                height: 150
            },
            arcData: {
                // 环形图参数
                r: 140, // 环形图的半径
                x0: 150, // 圆心x，一般把环形图放在画布中心位置就好
                y0: 150, // 同上
                stockWidth: 10 // 环形图的粗度...
            },
            colorMap: [
                // 环形图颜色映射表
                '#fff',
                '#f2a11b',
                '#26a69a',
                '#477fd3',
                '#F89E35',
                '#EA5486',
                '#EF4A4A',
                '#BF6FE4',
                '#6CBE6A',
                '#E1E1E1'
            ]
        })

        const renderList = computed(() => {
            const list = handleChartData(state.list)
            return list
        })

        onMounted(() => {
            // if (chartEl.value) {
            //     const _width = chartEl.value.clientWidth
            //     state.svgData.width = _width
            //     state.svgData.arcData = _width
            // }
        })

        const handleChartData = (list) => {
            // 这里按照 圆心点为(0,0), r 为 1 来处理
            const newList = []
            list.forEach((item, index) => {
                const obj = {}
                let per = +item.split('%')[0]
                // 保留真实占比,后面需要判断是否是大小弧
                obj.relayPer = per
                const PI = Math.PI
                if (index !== 0) {
                    per += newList[index - 1].per
                }
                // 因为是拼接，所以本次的终点要在之前的基础上，所要要累加占比
                obj.per = per
                const deg = (per / 100) * PI * 2
                obj.start = {}
                obj.end = {}
                if (index === 0) {
                    obj.start.x = Math.cos(0)
                    obj.start.y = Math.sin(0)
                } else {
                    obj.start = newList[index - 1].end
                }
                obj.end.x = Math.cos(deg)
                obj.end.y = Math.sin(deg)
                newList.push(obj)
            })
            return newList
        }
        const getPathItem = (cur) => {
            // 这里在通过 圆心(x0, y0) r ,拼接好路径数据
            const { x0, y0, r } = state.arcData
            let str = 'M'
            const isLargeArc = cur.relayPer > 50 ? 1 : 0
            const startX = cur.start.x * r + x0
            const startY = cur.start.y * r + y0
            const endX = cur.end.x * r + x0
            const endY = cur.end.y * r + y0
            str += ' ' + startX + ' ' + startY + ' ' + 'A' + ' ' + r + ' ' + r + ' ' + '0' + ' ' + isLargeArc + ' ' + '1' + ' ' + endX + ' ' + endY
            return str
        }
        return {
            ...toRefs(state),
            chartEl,
            handleChartData,
            getPathItem,
            renderList,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.doughnut-svg {
    display: block;
    margin: 0 auto;
    /* transform: rotate(180deg); */
}
</style>
