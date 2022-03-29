<template>
    <div class='page-wrap'>
        <router-view />
        <div class='page-content'>
            <!-- 侧边栏 -->
            <side-bar />
        </div>
    </div>
</template>

<script setup>
import sideBar from './components/side-bar.vue'
</script>

<style lang='scss' scoped>
.page-content {
    display: flex;
    height: 800px;
}
</style>
