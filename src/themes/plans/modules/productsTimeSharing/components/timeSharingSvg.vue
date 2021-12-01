<template>
    <div class='svg-wrap'>
        <svg fill='none' height='26' width='80' xmlns='http://www.w3.org/2000/svg'>
            <path :d='svgData[symbolKey]' :stroke='$style[color] || "#333"' stroke-width='1.5' />
        </svg>
    </div>
</template>

<script>
import { onActivated, computed, ref, toRefs } from 'vue'
export default {
    props: ['color', 'symbolKey'],
    setup (props) {
        const color = props.color
        const svgData = computed(() => {
            let num = 300
            let result = ''
            while (num > 0) {
                result += parseFloat(Math.random() * 100).toFixed(2) + ' '
                num--
            }

            return {
                '4_1': 'M0 17l3 9 4-7 3 1h4l3-2 4-3 3-7 4 2 3-4 4-1 3 11h4l3-3 4-5 3 3 4 1 3 2 4-6 3 4 4-7 3 1 4-5 3 1',
                '7_1': 'M0 15l3 11 4-3 3 1 4-3h3l4-5 3-5 4-3 3-6 4-1 3 14 4 5 3-7 4-11 3 8 4 3 3 4 4-2 3 3 4-7 3 7 4-3 3-1',
                '5_1': 'M0 22l3 4 4-2h7l3-2 4-3 3-7h4l3-4 4-3 3 5 4 4 3-2 4-7 3 2 4 1 3 1 4-1 3 1 4-6 3 2 4-4h3'
            }
        })

        return {
            svgData

        }
    }
}
</script>

<style lang="scss">
@import '~@/sass/mixin.scss';
.svg-wrap{
    margin-top: rem(10px);
}
</style>
