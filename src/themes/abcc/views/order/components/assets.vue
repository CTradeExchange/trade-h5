<template>
    <div class='orderAssets'>
        <van-row justify='space-between'>
            <van-col>预计占用</van-col>
            <van-col>0.000123 USDT</van-col>
        </van-row>
        <van-row justify='space-between'>
            <van-col>可用</van-col>
            <van-col>0.000123 USDT</van-col>
        </van-row>

        <div class='borrowMoney'>
            <van-radio-group v-model='checked' disabled>
                <van-radio name='1'>
                    自动借款
                </van-radio>
            </van-radio-group>
            <van-row class='mtop5' justify='space-between'>
                <van-col>
                    代理可借额度
                    <van-icon class='questionIcon' name='question-o' />
                </van-col>
                <van-col>0.000123 USDT</van-col>
            </van-row>
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
export default {
    setup () {
        const store = useStore()
        const checked = ref('1')

        return {
            checked
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.orderAssets {
    margin-top: rem(20px);
    color: var(--minorColor);
    line-height: 1.5;
}
.borrowMoney {
    margin-top: rem(80px);
    :deep(.van-radio__icon .van-icon) {
        line-height: 1;
    }
    .questionIcon {
        font-size: rem(30px);
        vertical-align: -2px;
    }
}
</style>
