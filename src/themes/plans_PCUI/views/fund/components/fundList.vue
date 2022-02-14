<template>
    <div class='fund-content'>
        <div class='fund-search'>
            <el-input
                v-model='searchValue'
                class='search-input'
                clearable
                :placeholder='$t("transRecords.searchPlaceholder")'
                @input='inputHandler'
            >
                <template #prefix>
                    <el-icon class='el-input__icon'>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
        </div>
        <!-- 有数据 -->
        <div v-if='fundProductList.length > 0' class='fund-module'>
            <div class='fund-header'>
                <span class='col-1'>
                    {{ $t('fundInfo.fundIcon') }}
                </span>
                <span class='col-2'>
                    {{ $t('fundInfo.realtimeJZ') }}
                </span>
                <span class='col-3'>
                    {{ $t('fundInfo.dayUpDown') }}
                </span>
            </div>
            <div class='fund-list'>
                <div
                    v-for='(item, index) in fundProductList'
                    :key='index'
                    :class="{ 'item': true, 'active': item.fundId === fund.fundId }"
                    @click='selectFund(item)'
                >
                    <div class='col-1'>
                        <p class='row'>
                            <CurrencyIcon :currency='item.shareTokenCode' size='25' />
                            <span class='name'>
                                {{ item.fundName }}
                            </span>
                        </p>
                        <span class='type'>
                            {{ item.operationMode === 1 ? $t('fundInfo.operationModeValue1') : $t('fundInfo.operationModeValue2') }}
                        </span>
                    </div>
                    <div class='col-2'>
                        <p :class="['jz', parseFloat(item.netValue) < 0 ? 'down' : 'up']">
                            {{ item.netValue }}
                        </p>
                        <p class='currency'>
                            {{ item.currencyCode }}
                        </p>
                    </div>
                    <div class='col-3'>
                        <p :class="['change', parseFloat(item.netValueChangeQuote) < 0 ? 'down' : 'up']">
                            {{ item.netValueChangeQuote }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 无数据 -->
        <van-empty v-else :description='$t("common.noData")' image='/images/empty.png' />
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { Search } from '@element-plus/icons'
import CurrencyIcon from '@/components/currencyIcon.vue'
import { useFund } from '../hooks.js'
import { debounce } from '@/utils/util'

const emit = defineEmits(['setFundProduct'])
// 搜索内容
const searchValue = ref('')
// 获取基金产品列表
const { getFundList, fundProductList, getFundValue } = useFund()
// 当前选中基金
const fund = ref({})

// 选择基金产品
const selectFund = (item) => {
    fund.value = item
    updateFundValue()
}
// 设置组件基金产品
const setFundProduct = () => {
    emit('setFundProduct', fund.value)
}
// 更新基金净值等数据
const updateFundValue = () => {
    getFundValue(fund.value).then(res => {
        if (res.check()) {
            const { data } = res
            fund.value = Object.assign({}, fund.value, data)
            setFundProduct()
        } else {
            setFundProduct()
        }
    }).catch(() => {
        setFundProduct()
    })
}

// 输入事件，防抖
const inputHandler = debounce(() => {
    getProductList()
}, 500)

// 获取基金产品列表数据
const getProductList = () => {
    getFundList({ name: searchValue.value, isRealTime: true }).then(() => {
        if (fundProductList.value.length > 0) {
            fund.value = fundProductList.value[0]
            updateFundValue()
        }
    })
}

onMounted(() => {
    getProductList()
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.fund-search {
    padding: 0 16px;
    margin-top: 16px;
}
.fund-module {
    .fund-header {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-size: 12px;
        color: var(--minorColor);
        padding: 0 16px;
        .col-1 {
            flex: 1;
        }
        .col-2 {
            width: 70px;
            text-align: right;
            margin-right: 10px;
        }
        .col-3 {
            width: 70px;
            text-align: right;
        }
    }
    .fund-list {
        .item {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 5px 16px;
            &:hover {
                background: var(--primaryAssistColor);
            }
            &.active {
                background: var(--primaryAssistColor);
            }
            .col-1 {
                flex: 1;
                .row {
                    display: flex;
                    align-items: center;
                    .name {
                        margin-left: 5px;
                        font-size: 14px;
                    }
                }
                .type {
                    display: inline-flex;
                    line-height: 1;
                    margin-top: 4px;
                    padding: 2px 5px;
                    font-size: 12px;
                    color: #fff;
                    background: var(--primary);
                    border-radius: 4px;
                }
            }
            .col-2 {
                width: 70px;
                text-align: right;
                margin-right: 10px;
                .currency {
                    color: var(--normalColor);
                }
            }
            .col-3 {
                width: 70px;
                text-align: right;
            }
            .up {
                color: var(--riseColor);
            }
            .down {
                color: var(--fallColor);
            }
        }
    }
}
</style>
