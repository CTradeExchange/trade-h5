<template>
    <el-carousel arrow='never' class='swiper-module' height='540px'>
        <el-carousel-item v-for='(item, index) in 2' :key='index'>
            <!-- <img src='@planspc/images/home/banner.png' /> -->
            <div class='bannerImg' :style='{ backgroundImage: "url("+bannerImg+")" }'></div>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import bannerImg from '@planspc/images/home/banner.png'
export default {
    setup () {
        return {
            bannerImg
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper-module {
    position: fixed;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100%;
    .bannerImg{
        height: 100%;
        width: 100%;
        background-size: cover;
        background-position: center;
    }
    img {
        display: block;
        height: 100%;
    }
}
</style>
