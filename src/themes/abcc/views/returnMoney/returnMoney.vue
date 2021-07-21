<template>
    <div class='returnMoney fullPageWrapper'>
        <layoutTop>
            <div>USDT</div>
        </layoutTop>
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
.returnMoney{

}
</style>
