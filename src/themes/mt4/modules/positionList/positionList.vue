<template>
    <div>
        <positionItem v-for='item in list' :key='item' />
    </div>
</template>

<script>
import positionItem from './positionItem'
export default {
    components: {
        positionItem,
    },
    data () {
        return {
            list: [...new Array(10)]
        }
    },
}
</script>

<style lang="scss" scoped>

</style>
