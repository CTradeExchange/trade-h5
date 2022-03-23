<template>
    <div class='trade-module auto-width'>
        <div class='trade-header'>
            <strong class='title'>
                {{ $t('home.marketTrend') }}
            </strong>
            <a class='more' href='javascript:;' @click='examineMore'>
                <span>{{ $t('examineMore') }}</span>
                <i class='el-icon-arrow-right'></i>
            </a>
        </div>
        <!-- 产品列表 -->
        <div class='product-module'>
            <ul class='header-block'>
                <li>
                    <span>{{ $t('trade.name') }}</span>
                </li>
                <li>
                    <span>{{ $t('trade.newPrice') }}</span>
                </li>
                <li>
                    <span>{{ $t('trade.changePrice') }}</span>
                </li>
                <li>
                    <span>{{ $t('trade.changePercent') }}</span>
                </li>
                <li>
                    <span>{{ $t('c.handle') }}</span>
                </li>
            </ul>
            <ul class='product-list'>
                <li v-for='item in productList' :key='item.symbolKey' @click='toOrder(item)'>
                    <div class='name'>
                        <currency-icon class='currency-icon' :currency='item.baseCurrency' :size='36' />
                        <span>{{ item.symbolName }}</span>
                    </div>
                    <div>
                        <span>
                            {{ item.cur_price || '--' }}
                        </span>
                    </div>
                    <div>
                        <span>
                            {{ item.upDownAmount || '--' }}
                        </span>
                    </div>
                    <div>
                        <span :class='item.upDownColor'>
                            {{ item.upDownWidth || '--' }}
                        </span>
                    </div>
                    <div class='handle'>
                        <button class='buy'>
                            {{ $t('trade.buy') }}
                        </button>
                        <button class='sale'>
                            {{ $t('trade.sell') }}
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import currencyIcon from '@/components/currencyIcon.vue'

export default {
    components: {
        currencyIcon
    },
    emits: ['update'],
    setup (props, context) {
        const router = useRouter()
        const store = useStore()
        // 产品列表map数据
        const productMap = computed(() => store.state._quote.productMap)
        // 当前要显示的产品keys
        const productKeys = ['695_5', '696_5', '697_5', '698_5', '699_5', '700_5']
        // const productKeys = ['368_5', '328_5', '329_5', '331_5', '332_5', '323_5']
        // 产品列表数据
        const productList = computed(() => {
            return Object.values(productMap.value).filter(elem => checkProductShow(elem))
        })

        // 判断当前产品是否展示
        const checkProductShow = (product) => {
            return productKeys.includes(product.symbolKey)
        }

        // 去交易
        const toOrder = item => {
            router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
        }

        // 查看更多
        const examineMore = () => {
            const item = productList.value[0]
            router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
        }

        onMounted(() => {
            context.emit('update', productKeys)
        })

        return {
            productList,
            toOrder,
            examineMore
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.trade-module {
    margin-top: 96px;
}
.trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        letter-spacing: 2px;
        font-size: 30px;
        font-weight: bold;
        color: var(--color);
    }
    .more {
        display: inline-flex;
        align-items: center;
        color: var(--color);
        i {
            font-weight: bold;
        }
        span {
            font-size: 14px;
            font-weight: bold;
            margin-right: 5px;
        }
    }
}
.product-module {
    margin-top: 30px;
    .header-block {
        display: flex;
        align-items: center;
        height: 56px;
        background: var(--contentColor);
        li {
            display: flex;
            align-items: center;
            flex: 1;
            height: 100%;
            span {
                font-size: 14px;
                color: var(--minorColor);
            }
            &:first-child {
                min-width: 300px;
                span {
                    margin-left: 16px;
                }
            }
            &:last-child {
                justify-content: flex-end;
                span {
                    margin-right: 16px;
                }
            }
        }
    }
}
.product-list {
    li {
        display: flex;
        align-items: center;
        height: 64px;
        background: var(--contentColor);
        cursor: pointer;
        div {
            flex: 1;
            color: var(--color);
            &:first-of-type {
                min-width: 300px;
            }
            span {
                font-size: 20px;
            }
            &:first-of-type {
                span {
                    margin-left: 16px;
                }
            }
        }
        .name {
            display: inline-flex;
            align-items: center;
            .currency-icon {
                margin-left: 10px;
            }
        }
        .handle {
            display: flex;
            justify-content: flex-end;
            button {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 80px;
                height: 32px;
                margin-right: 16px;
                font-size: 16px;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
                &.buy {
                    background: var(--riseColor);
                }
                &.sale {
                    background: var(--fallColor);
                }
                &:hover {
                    opacity: .7;
                }
            }
        }
        &:hover {
            background: var(--bgColor);
            border-radius: 10px;
        }
    }
}
</style>
