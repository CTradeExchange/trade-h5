<template>
    <van-popup
        v-model:show='show'
        position='bottom'
        round
        @close='close'
        @open='open'
    >
        <div class='popup-assets'>
            <van-tabs v-model:active='active' color='$style.primary'>
                <van-tab v-for='item in list' :key='item.currencyCode' :name='item.currencyCode' :title="item.currencyCode === 'self' ? '一篮子基金' : item.currencyCode">
                    <!-- 申购 -->
                    <div v-if="direction === 'buy'">
                        <!-- 一篮子资产 -->
                        <div v-if="item.currencyCode === 'self'">
                            <div class='content'>
                                投资者用一篮子资产向基金公司提出申购申请，一篮子资产指的是和基金的投资构成完全一致，比例也完全一致的一组加密货币
                            </div>
                            <div class='direction'>
                                <div class='currency-list'>
                                    <currencyIcon
                                        v-for='(elem, index) in fundAssetsList'
                                        :key='index'
                                        :currency='elem.currencyCode'
                                    />
                                </div>
                                <div class='indicate'>
                                    <div class='row'>
                                        <van-icon color='#fff' name='down' size='20' />
                                    </div>
                                </div>
                                <div class='to'>
                                    <currencyIcon :currency='fund.shareTokenCode' size='24' />
                                    <p class='currency-text'>
                                        {{ fund.shareTokenCode }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <!-- 单资产 -->
                        <div v-else>
                            <div class='content'>
                                投资者用{{ item.currencyCode }}向基金公司申购基金
                            </div>
                            <div class='direction'>
                                <div class='from'>
                                    <currencyIcon
                                        :currency='item.currencyCode'
                                        size='24'
                                    />
                                    <p class='currency-text'>
                                        {{ item.currencyCode }}
                                    </p>
                                </div>
                                <div class='indicate'>
                                    <div class='row'>
                                        <van-icon color='#fff' name='down' size='20' />
                                    </div>
                                </div>
                                <div class='to'>
                                    <currencyIcon :currency='fund.shareTokenCode' size='24' />
                                    <p class='currency-text'>
                                        {{ fund.shareTokenCode }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 赎回 -->
                    <div v-else>
                        <!-- 一篮子资产 -->
                        <div v-if="item.currencyCode === 'self'">
                            <div class='content'>
                                投资者用基金份额向基金公司申请赎回与基金投资构成完全一致，比例也完全一致的一篮子资产
                            </div>
                            <div class='direction'>
                                <div class='to'>
                                    <currencyIcon :currency='fund.shareTokenCode' size='24' />
                                    <p class='currency-text'>
                                        {{ fund.shareTokenCode }}
                                    </p>
                                </div>
                                <div class='indicate'>
                                    <div class='row'>
                                        <van-icon color='#fff' name='down' size='20' />
                                    </div>
                                </div>
                                <div class='currency-list'>
                                    <currencyIcon
                                        v-for='(elem, index) in fundAssetsList'
                                        :key='index'
                                        :currency='elem.currencyCode'
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- 单资产 -->
                        <div v-else>
                            <div class='content'>
                                <p>投资者用基金份额向基金公司发起赎回申请，基金公司向投资者支付{{ item.currencyCode }}金额</p>
                                <p class='equation'>
                                    金额=份额*净值
                                </p>
                            </div>
                            <div class='direction'>
                                <div class='to'>
                                    <currencyIcon :currency='fund.shareTokenCode' size='24' />
                                    <p class='currency-text'>
                                        {{ fund.shareTokenCode }}
                                    </p>
                                </div>
                                <div class='indicate'>
                                    <div class='row'>
                                        <van-icon color='#fff' name='down' size='20' />
                                    </div>
                                </div>
                                <div class='from'>
                                    <currencyIcon
                                        :currency='item.currencyCode'
                                        size='24'
                                    />
                                    <p class='currency-text'>
                                        {{ item.currencyCode }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <van-button block class='popup-btn' type='primary' @click='close'>
            {{ $t('common.sure') }}
        </van-button>
    </van-popup>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import CurrencyIcon from '@/components/currencyIcon.vue'
const route = useRoute()
const { direction } = route.query
const props = defineProps({
    // 是否显示弹窗
    show: {
        type: Boolean,
        default: false
    },
    // 基金信息
    fund: {
        type: Object,
        default: () => {}
    },
    // 选项卡列表
    list: {
        type: Array,
        default: () => []
    },
    // 基金底层资产列表数据
    fundAssetsList: {
        type: Array,
        default: () => []
    },
    // 当前选择的资产
    currency: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:show'])
// 当前选项卡
const active = ref('')

// 打开弹窗
const open = () => {
    active.value = props.currency
}

// 关闭弹窗
const close = () => {
    emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.popup-assets {
    padding: rem(40px);
    --van-tabs-bottom-bar-color: var(--primary);
    .content {
        margin: rem(40px) 0;
    }
    .currency-list {
        :deep(.currencyIcon) {
            width: 20px;
            margin-left: -10px;
        }
    }
    .equation {
        text-align: center;
    }
    .indicate {
        display: flex;
        justify-content: center;
        margin: rem(40px) 0;
        .row {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: rem(60px);
            height: rem(60px);
            background: var(--primary);
            border-radius: 50%;
            :deep(.van-icon-down) {
                margin-top: rem(-4px);
            }
        }
    }
    .direction {
        text-align: center;
        .arrow-down {
            width: rem(100px);
            margin: rem(60px) 0;
        }
        .currency-text {
            margin: rem(10px) 0;
            vertical-align: middle;
        }
    }
}
</style>
