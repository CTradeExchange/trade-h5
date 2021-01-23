<template>
    <span></span>
</template>

<script>
import { nextTick } from 'vue'
import Peity from './lib/peity'

const types = ['line', 'bar', 'pie', 'donut']

export default {
    props: {
        type: {
            type: String,
            required: true,
            validator: value => types.indexOf(value) > -1
        },
        data: {
            type: String,
            required: true
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            chart: null
        }
    },
    watch: {
        data (val) {
            nextTick(() => {
                this.chart.raw = val
                this.chart.draw()
            })
        }
    },
    mounted () {
        this.chart = new Peity(this.$el, this.type, this.data, this.options)
        this.chart.draw()
    }
}
</script>
