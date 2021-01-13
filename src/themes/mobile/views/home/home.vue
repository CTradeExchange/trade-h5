<template>
    <main class='productMain'>
        <productList />
    </main>
</template>

<script>
import productList from '@m/modules/productList/productList.vue'
export default {
    components: {
        productList,
    },
}
</script>

<style lang="scss" scoped>
.productMain{

}
</style>
