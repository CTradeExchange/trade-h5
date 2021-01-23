<template>
    <div>
        <titleBar />
        <positionItem v-for='item in list' :key='item' />
    </div>
</template>

<script>
import positionItem from './positionItem'
import titleBar from './titleBar'
export default {
    components: {
        positionItem,
        titleBar,
    },
    data () {
        return {
            list: [...new Array(30)]
        }
    },
}
</script>

<style lang="scss" scoped>

</style>
