<template>
    <el-carousel arrow='never' class='swiper-module' height='540px'>
        <el-carousel-item v-for='(item, index) in bannerList' :key='index'>
            <div class='bannerImg' :style='{ backgroundImage: "url("+ item.url +")" }' @click='bannerClick(item)'></div>
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import { getCookie } from '@/utils/util.js'

// 当前语言
const lang = getCookie('lang')
// 轮播图列表
const bannerList = [
    {
        url: require('@planspc/images/' + lang + '/banner-1.png')
    },
    {
        url: require('@planspc/images/' + lang + '/banner-2.png')
    },
    {
        url: require('@planspc/images/' + lang + '/banner-3.png')
    }
]
// 点击轮播图
const bannerClick = (item) => {
    window.open('https://www.vitatoken.com/site/new')
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
