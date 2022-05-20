<template>
    <div class='popup-wrap'>
        <van-popup
            v-model:show='modelValue'
            :close-on-click-overlay='false'
            :closeable='true'
            :round='true'
            @close='close'
        >
            <div class='popup-content'>
                <p class='text'>
                    You are about to purchase the Metaverse Era Capital issued by V10
                    <br />
                    The vitatoken account can be used to execute the V10 fund KYC and accept V10 assets
                </p>
                <div v-if='fund.fundId' class='fund-handle'>
                    <!-- 申购 -->
                    <fundApply
                        v-if="activeName === 'apply'"
                        :fund='fund'
                        @switchDirection='switchTab'
                    />
                    <!-- 赎回 -->
                    <fundRedeem
                        v-if="activeName === 'redeem'"
                        :fund='fund'
                        @switchDirection='switchTab'
                    />
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import fundApply from '@planspc/views/funds/components/fund-apply.vue'
import fundRedeem from '@planspc/views/funds/components/fund-redeem.vue'
import { ref, defineProps, defineEmits } from 'vue'
defineProps({
    // 是否显示弹窗
    modelValue: {
        type: Boolean,
        default: false
    },
    // 基金信息
    fund: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['update:modelValue'])

// 当前选择选项卡 apply:申购 redeem:赎回
const activeName = ref('apply')

// 切换选项卡
const switchTab = value => {
    if (activeName.value !== value) {
        activeName.value = value
    }
}

// 关闭弹窗
const close = () => {
    emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.popup-wrap {
    :deep {
        .van-icon {
            color: #000;
        }
    }
}
.popup-content {
    width: 750px;
    height: calc(100vh - 100px);
    background: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    .text {
        width: 625px;
        text-align: center;
        line-height: 24px;
        margin: 60px auto 0;
        font-size: 16px;
        color: #333;
    }
}
.fund-handle {
    width: 500px;
    margin: 40px auto 60px;
}
</style>
