<template>
    <signal-item
        :key='source.id'
        :signal='source'
    />
</template>

<script>
import signalItem from '@/plugins/signal/components/signal-item'

export default {
    components: {
        signalItem
    },
    props: {
        source: {
            type: Object,
            default () {
                return {}
            }
        },
    }
}
</script>
