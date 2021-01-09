<template>
    <div class='home'>
        <img alt='Vue logo' src='@/assets/logo.png' />
        <router-link to='/login'>登录</router-link>
        <HelloWorld msg='Welcome to Your Vue.js App' />
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@m/components/HelloWorld.vue'

export default {
    name: 'Home',
    components: {
        HelloWorld
    }
}
</script>
