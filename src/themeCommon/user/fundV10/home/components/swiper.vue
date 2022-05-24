<template>
    <!-- PC -->
    <el-carousel v-if='isPC' arrow='never' class='swiper-module' height='auto'>
        <el-carousel-item v-for='(item, index) in pcBanners' :key='index'>
            <!-- <div class='bannerImg' :style='{ backgroundImage: "url("+ item.url +")" }' @click='bannerClick(item)'></div> -->
            <img :src='item.url' @click='bannerClick(item)' />
        </el-carousel-item>
        <img :src="require('@public/images/V10/pc/V10banneer.jpg')" style='opacity: 0;' @click='bannerClick(item)' />
    </el-carousel>
    <!-- H5 -->
    <van-swipe v-else :autoplay='3000' class='swiper-module' indicator-color='white'>
        <van-swipe-item v-for='(item, index) in h5Banners' :key='index'>
            <!-- <div class='bannerImg' :style='{ backgroundImage: "url("+ item.url +")" }' @click='bannerClick(item)'></div> -->
            <img :src='item.url' @click='bannerClick(item)' />
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
        url: require('@public/images/V10/pc/V10banneer.jpg')
    }
]
// h5轮播图列表
const h5Banners = [
    {
        url: require('@public/images/V10/h5/V10banneer.jpg')
    }
]
// 点击轮播图
const bannerClick = (item) => {

}
</script>

<style lang="scss" scoped>
.swiper-module {
    width: 100%;
    :deep {
        .el-carousel__indicators {
            display: none;
        }
    }
    .bannerImg {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        cursor: pointer;
    }
    img {
        display: block;
        width: 100%;
        height: auto;
    }
}
</style>
