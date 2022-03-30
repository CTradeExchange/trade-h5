<template>
    <div class='side-bar'>
        <!-- 基金列表 -->
        <div class='nav-module'>
            <div class='nav-item'>
                <a :class="{ 'active': fundId === '' }" href='javascript:;' @click="switchFundItem('')">
                    <svg fill='none' height='32' viewBox='0 0 32 32' width='32' xmlns='http://www.w3.org/2000/svg'>
                        <rect fill='#EEEEEE' height='32' rx='16' width='32' /><g clip-path='url(#clip0)'>
                            <path d='M21.6875 7.5H10.3125C9.03737 7.5 8 8.53737 8 9.8125C8 11.0876 9.03737 12.125 10.3125 12.125H21.6875C22.9626 12.125 24 11.0876 24 9.8125C24 8.53737 22.9626 7.5 21.6875 7.5ZM21.6875 10.875H10.3125C9.72663 10.875 9.25 10.3984 9.25 9.8125C9.25 9.22663 9.72663 8.75 10.3125 8.75H21.6875C22.2734 8.75 22.75 9.22663 22.75 9.8125C22.75 10.3984 22.2734 10.875 21.6875 10.875Z' fill='#555555' /><path d='M21.6875 13.1875H10.3125C9.03737 13.1875 8 14.2249 8 15.5C8 16.7751 9.03737 17.8125 10.3125 17.8125H21.6875C22.9626 17.8125 24 16.7751 24 15.5C24 14.2249 22.9626 13.1875 21.6875 13.1875ZM21.6875 16.5625H10.3125C9.72663 16.5625 9.25 16.0859 9.25 15.5C9.25 14.9141 9.72663 14.4375 10.3125 14.4375H21.6875C22.2734 14.4375 22.75 14.9141 22.75 15.5C22.75 16.0859 22.2734 16.5625 21.6875 16.5625Z' fill='#555555' /><path d='M21.6875 18.875H10.3125C9.03737 18.875 8 19.9124 8 21.1875C8 22.4626 9.03737 23.5 10.3125 23.5H18.5625C18.9077 23.5 19.1875 23.2202 19.1875 22.875C19.1875 22.5298 18.9077 22.25 18.5625 22.25H10.3125C9.72663 22.25 9.25 21.7734 9.25 21.1875C9.25 20.6016 9.72663 20.125 10.3125 20.125H21.6875C22.2734 20.125 22.75 20.6016 22.75 21.1875C22.75 21.7734 22.2734 22.25 21.6875 22.25C21.3423 22.25 21.0625 22.5298 21.0625 22.875C21.0625 23.2202 21.3423 23.5 21.6875 23.5C22.9626 23.5 24 22.4626 24 21.1875C24 19.9124 22.9626 18.875 21.6875 18.875Z' fill='#555555' />
                        </g><defs>
                            <clipPath id='clip0'>
                                <rect fill='white' height='16' transform='translate(8 7.5)' width='16' />
                            </clipPath>
                        </defs>
                    </svg>
                    <div class='text'>
                        <span class='name'>
                            {{ $t('fundInfo.fundsList') }}
                        </span>
                    </div>
                </a>
            </div>
            <ul class='nav-menu'>
                <li v-for='(item, index) in fundProductList' :key='index' class='nav-item'>
                    <a :class="{ 'active': item.fundId === fundId }" href='javascript:;' @click='switchFundItem(item.fundId)'>
                        <currency-icon class='currency' :currency='item.shareTokenCode' size='32px' />
                        <div class='text'>
                            <span class='tag'>
                                CRYPTO
                            </span>
                            <span class='name'>
                                {{ item.shareTokenCode }}
                            </span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFund } from '../hooks.js'
import currencyIcon from '@/components/currencyIcon.vue'

// 获取基金产品列表
const { getFundList, fundProductList } = useFund()
// 当前基金id
const fundId = ref('')

// 获取基金产品列表数据
const getProductList = () => {
    getFundList()
}

// 切换基金产品
const switchFundItem = (value) => {
    if (fundId.value === value) return
    fundId.value = value
}

onMounted(() => {
    // 获取基金产品列表数据
    getProductList()
})
</script>

<style lang='scss' scoped>
@import "@/sass/mixin.scss";
.side-bar {
    width: 256px;
    height: 100%;
    background: var(--contentColor);
    overflow-y: auto;
}
.nav-item {
    a {
        display: flex;
        align-items: center;
        height: 52px;
        margin: 8px;
        padding: 4px;
        font-weight: 400;
        border-radius: 8px;
        &.active {
            background-color: var(--lineColor);
        }
        &:hover {
            background-color: var(--bgColor);
        }
    }
    .text {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
        .tag {
            font-size: 10px;
            color: var(--minorColor);
        }
        .name {
            font-size: 16px;
            font-weight: 500;
            color: var(--color);
        }
    }
}
</style>
