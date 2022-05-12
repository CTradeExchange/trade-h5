<template>
    <van-popup
        v-model:show='show'
        position='bottom'
        round
        @close='close'
        @open='open'
    >
        <div class='popup-assets-list'>
            <p class='title'>
                选择支付资产
            </p>
            <div v-for='item in list' :key='item.currencyCode' class='asset-item' @click='switchCurrency(item)'>
                <div class='left'>
                    <div class='top-block'>
                        <currencyIcon
                            :currency='item.currencyCode'
                            size='24'
                        />
                        <span class='currency'>
                            {{ item.currencyCode === 'self' ? '一篮子资产' : item.currencyCode }}
                        </span>
                    </div>
                    <p v-if="item.currencyCode === 'self'" class='desc'>
                        支付一篮子资产购买基金
                    </p>
                    <p v-else class='desc'>
                        支付 {{ item.currencyCode }} 购买基金
                    </p>
                    <div v-if="item.currencyCode === 'self'" class='currency-list'>
                        <currencyIcon
                            v-for='(elem, index) in fundAssetsList'
                            :key='index'
                            :currency='elem.currencyCode'
                        />
                    </div>
                </div>
                <div class='right'>
                    <van-icon :color='currency === item.currencyCode ? $style.success : $style.minorColor' name='checked' size='22' />
                </div>
            </div>
        </div>
        <van-button block type='primary' @click='onConfirm'>
            {{ $t('common.sure') }}
        </van-button>
    </van-popup>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import CurrencyIcon from '@/components/currencyIcon.vue'

const props = defineProps({
    // 是否显示弹窗
    show: {
        type: Boolean,
        default: false
    },
    // 资产列表
    list: {
        type: Array,
        default: () => []
    },
    // 默认选择的资产
    activeCurrency: {
        type: String,
        default: ''
    },
    // 基金底层资产列表数据
    fundAssetsList: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['update:show', 'select'])

// 当前选择的资产
const currency = ref('')

// 打开弹窗
const open = () => {
    currency.value = props.activeCurrency
}

// 关闭弹窗
const close = () => {
    emit('update:show', false)
}

// 切换资产
const switchCurrency = (item) => {
    if (currency.value === item.currencyCode) return
    currency.value = item.currencyCode
}

// 确定选择资产
const onConfirm = () => {
    const item = props.list.find(el => el.currencyCode === currency.value)
    close()
    emit('select', item)
}
</script>

<style lang="scss" scoped>
.popup-assets-list {
    padding: rem(30px);
    .title {
        font-size: rem(32px);
        text-align: center;
    }
    .asset-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: rem(40px);
        padding: rem(30px);
        background: var(--bgColor);
        border-radius: rem(12px);
        .top-block {
            .currency {
                margin-left: rem(15px);
                color: var(--color);
                vertical-align: middle;
            }
        }
        .desc {
            margin-top: rem(10px);
            font-weight: bold;
            color: var(--minorColor);
        }
        .currency-list {
            margin-top: rem(12px);
            margin-left: 10px;
            :deep(.currencyIcon) {
                width: 20px;
                margin-left: -10px;
            }
        }
    }
}
</style>
