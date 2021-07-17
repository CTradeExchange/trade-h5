<template>
    <div class='assetsItem'>
        <div class='rowflex currency'>
            <span>USDT</span>
            <span>2352345234.33</span>
        </div>
        <div class='rowflex muted mtop20'>
            <div>
                <p>可用</p>
                <p>5000.0000</p>
                <p class='mtop10'>
                    借款
                </p>
                <p>5000.0000</p>
            </div>
            <div class='alignRgiht'>
                <p>冻结</p>
                <p>5000.0000</p>
                <p class='mtop10'>
                    利息
                </p>
                <p>5000.0000</p>
            </div>
        </div>
    </div>
</template>

<script>
// import { reactive, toRefs } from 'vue'
// import { useStore } from 'vuex'
export default {
    setup () {
        // const store = useStore()

        return {}
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.assetsItem {
    padding: rem(30px);
    font-size: rem(24px);
    background: var(--contentColor);
}
.rowflex {
    display: flex;
    justify-content: space-between;
    width: 100%;
    &.currency {
        font-size: rem(30px);
    }
}
</style>
