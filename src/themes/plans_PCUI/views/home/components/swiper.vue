<template>
    <el-carousel arrow='never' class='swiper-module' height='540px'>
        <el-carousel-item v-for='(item, index) in 2' :key='index'>
            <img src='@planspc/images/home/banner.png' />
        </el-carousel-item>
    </el-carousel>
</template>

<script>
</script>

<style lang="scss" scoped>
.swiper-module {
    img {
        display: block;
        height: 100%;
    }
}
</style>
