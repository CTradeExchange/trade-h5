<template>
    <div class='side-bar'>
        <section>
            <div>
                <ul class='nav-menu'>
                    <li v-for='(item, index) in fundProductList' :key='index'>
                        <a href='javascript:;'>
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
        </section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFund } from '../hooks.js'
import currencyIcon from '@/components/currencyIcon.vue'

// 获取基金产品列表
const { getFundList, fundProductList } = useFund()

// 获取基金产品列表数据
const getProductList = () => {
    getFundList()
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
}
.nav-menu {
    li {
        a {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-decoration: none;
            border-radius: 8px;
            height: 52px;
            margin: 8px;
            padding: 4px;
            font-weight: 400;
            &:hover {
                background-color: var(--bgColor);
            }
        }
        .currency {

        }
        .text {
            .tag {

            }
            .name {

            }
        }
    }
}
</style>
