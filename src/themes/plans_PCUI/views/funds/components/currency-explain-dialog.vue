<template>
    <div class='dialog-layer'>
        <el-dialog
            v-model='show'
            :before-close='close'
            :close-on-click-modal='false'
            width='520px'
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
                                            size='40'
                                            :currency='elem.currencyCode'
                                        />
                                    </div>

                                    <div class='indicate'>
                                        <div class='row'>
                                            <van-icon color='#fff' name='down' size='20' />
                                        </div>
                                    </div>
                                    <div class='to'>
                                        <currencyIcon 
                                        :currency='fund.shareTokenCode' 
                                        size='40' />
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
                                            size='40'
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
                                        <currencyIcon :currency='fund.shareTokenCode' size='40' />
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
                                        <currencyIcon :currency='fund.shareTokenCode' size='40' />
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
                                            size='40'
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
                                        <currencyIcon :currency='fund.shareTokenCode' size='40' />
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
                                            size='40'
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
          
            <div class="dialog-footer">
                <el-button type="primary" @click="close"
                >{{$t('common.sure')}}</el-button
                >
            </div>
          
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import CurrencyIcon from '@/components/currencyIcon.vue'
const route = useRoute()
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
    },
    direction:{
        type: String
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
    --van-tabs-bottom-bar-color: var(--primary);
    .content {
        margin: 20px 0 60px;
    }
    .currency-list {
        :deep(.currencyIcon) {
            margin-left: -10px;
        }
    }
    .equation {
        text-align: center;
    }
    .indicate {
        display: flex;
        justify-content: center;
        margin: 40px 0;
        .row {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            background: var(--primary);
            border-radius: 50%;
            :deep(.van-icon-down) {
                margin-top: -2px;
            }
        }
    }
    .direction {
        text-align: center;
        .arrow-down {
            width: 50px;
            margin: 30px 0;
        }
        .currency-text {
            margin: 5 0;
            vertical-align: middle;
        }
    }
}
.dialog-footer {
    margin-top: 90px;
    .el-button {
        width: 100%;
        background-color: var(--primary);
    }
}
</style>
