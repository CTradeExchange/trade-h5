<template>
    <div class='product-module'>
        <ul>
            <li v-for='item in productList' :key='item.symbloKey'>
                <p class='row_1'>
                    <span>{{ item.symbolName }}</span>
                    <strong :class='item.upDownColor'>
                        {{ item.upDownWidth || '--' }}
                    </strong>
                </p>
                <p class='row_2'>
                    <span>{{ item.cur_price || '--' }}</span>
                </p>
                <p class='row_3'>
                    <span>{{ item.upDownAmount || '--' }}</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed, unref } from 'vue'
import { useStore } from 'vuex'

export default {
    emits: ['update'],
    setup (props, context) {
        const store = useStore()
        // 产品map数据
        const productMap = unref(computed(() => store.state._quote.productMap))
        // 产品symbolKey集合
        const productKeys = ['32_1', '33_1', '5_2', '6_2', '9_2']
        // 产品列表数据
        const productList = productKeys.map(key => productMap[key]).filter(elem => elem)

        context.emit('update', productKeys)

        return {
            productList
        }
    }
}
</script>

<style lang="scss" scoped>
.product-module {
    height: 120px;
    background: #000730;
    ul {
        display: flex;
        height: 100%;
    }
    li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        height: 100%;
        padding: 0 24px;
        position: relative;
        cursor: pointer;
        &::after {
            content: '';
            width: 1px;
            height: 72px;
            background-color: rgba(255,255,255,.2);
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
        }
        &:last-of-type::after {
            background-color: transparent;
        }
        .row_1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
                font-size: 16px;
                color: #B7C0E7;
            }
            strong {
                font-size: 16px;
                font-weight: normal;
            }
        }
        .row_2 {
            margin-top: 3px;
            span {
                font-size: 24px;
                color: #B7C0E7;
            }
        }
        .row_3 {
            margin-top: 3px;
            span {
                font-size: 16px;
                color: #5B658E;
            }
        }
    }
}
</style>
