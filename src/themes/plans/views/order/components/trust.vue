<template>
    <div class='trustWrapper'>
        <div class='hd'>
            <span>当前委托 (1)</span>
            <a class='allTrust' href='javascript:;'>
                全部委托
            </a>
        </div>
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
.trustWrapper {
    margin-top: rem(20px);
    background: var(--contentColor);
    .hd {
        display: flex;
        justify-content: space-between;
        height: rem(70px);
        padding: 0 rem(30px);
        font-size: rem(28px);
        line-height: rem(70px);
        border-bottom: 1px solid var(--assistColor);
        .allTrust {
            color: var(--primary);
            font-size: rem(24px);
        }
    }
}
</style>
