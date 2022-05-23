<template>
    <div class='popup-wrap'>
        <van-popup
            v-model:show='modelValue'
            :close-on-click-overlay='false'
            :closeable='true'
            :round='true'
            @close='close'
            @open='open'
        >
            <div class='popup-content'>
                <p class='describe'>
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

// 打开弹窗
const open = () => {
    activeName.value = 'apply'
}

// 关闭弹窗
const close = () => {
    emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.popup-wrap {
    position: relative;
    z-index: 1000;
    :deep {
        .van-popup {
            width: 750px;
            height: calc(100vh - 100px);
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            .popup-content {
                height: 100%;
                overflow-y: auto;
            }
            .van-popup__close-icon {
                color: #000;
                position: absolute;
                top: 15px;
                right: 25px;
            }
            .describe {
                width: 625px;
                text-align: center;
                line-height: 24px;
                margin: 40px auto 0;
                font-size: 16px;
                color: #333;
            }
            .fund-handle {
                width: 500px;
                margin: 40px auto 60px;
            }
        }
    }
}
</style>

<style lang="scss">
.V10 {
    .popover-select {
        width: 500px !important;
    }
}
</style>
