<template>
    <!-- PC -->
    <el-carousel v-if='isPC' arrow='never' class='swiper-module' height='650px'>
        <el-carousel-item v-for='(item, index) in pcBanners' :key='index'>
            <div class='bannerImg' :style='{ backgroundImage: "url("+ item.url +")" }' @click='bannerClick(item)'></div>
        </el-carousel-item>
    </el-carousel>
    <!-- H5 -->
    <van-swipe v-else :autoplay='3000' class='swiper-module' indicator-color='white' style='height: 240px;'>
        <van-swipe-item v-for='(item, index) in h5Banners' :key='index'>
            <div class='bannerImg' :style='{ backgroundImage: "url("+ item.url +")" }' @click='bannerClick(item)'></div>
        </van-swipe-item>
    </van-swipe>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    isPC: {
        type: Boolean,
        default: false
    }
})

// pc轮播图列表
const pcBanners = [
    {
        url: require('@public/images/V10/pc/banner_1.png')
    },
    {
        url: require('@public/images/V10/pc/banner_1.png')
    }
]
// h5轮播图列表
const h5Banners = [
    {
        url: require('@public/images/V10/h5/banner_1.png')
    },
    {
        url: require('@public/images/V10/h5/banner_1.png')
    }
]
// 点击轮播图
const bannerClick = (item) => {

}
</script>

<style lang="scss" scoped>
.swiper-module {
    width: 100%;
    .bannerImg {
        height: 100%;
        width: 100%;
        background-size: cover;
        background-position: center;
        cursor: pointer;
    }
    img {
        display: block;
        height: 100%;
    }
}
</style>
