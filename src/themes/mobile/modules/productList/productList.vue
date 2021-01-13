<template>
    <div>
        <productItem v-for='item in list' :key='item' />
    </div>
</template>

<script>
import productItem from './productItem'
export default {
    components: {
        productItem,
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
