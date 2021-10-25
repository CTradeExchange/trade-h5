<template>
    <div class='footer'>
        这里是页脚
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.footer{
    background: #000;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 40px;
}
</style>
