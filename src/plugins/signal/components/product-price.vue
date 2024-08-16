<template>
    <div class='product-price' :class='product.cur_color'>
        <span>{{ product.cur_price || '--' }}</span>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    props: {
        symbolCode: String
    },
    setup (props) {
        const store = useStore()

        const product = computed(() => store.getters['_signal/getSignalProduct'](props.symbolCode))

        return {
            product
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
