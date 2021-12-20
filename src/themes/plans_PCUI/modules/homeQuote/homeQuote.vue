<template>
    <div v-if='h5Preview'>
        <img alt='' class='homeQuoteImg' src='./homeQuote.png' />
    </div>
    <div v-else class='trade-module auto-width'>
        <!-- 玩法选项 -->
        <div class='play-tabs'>
            <ul>
                <li
                    v-for='item in plansList'
                    :key='item.tradeType'
                    :class="{ 'active': Number(item.tradeType) === tradeType }"
                    @click='switchPlan(Number(item.tradeType))'
                >
                    <span>{{ $t('tradeType.' + item.tradeType) }}</span>
                </li>
            </ul>
        </div>
        <!-- 分类选项 -->
        <div class='category-tabs'>
            <ul>
                <li
                    v-for='(item, index) in categoryList'
                    :key='index'
                    :class="{ 'active': index === categoryType }"
                    @click='switchCategory(index)'
                >
                    <span>{{ item.title }}</span>
                </li>
            </ul>
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
                <li v-for='item in filterProductList' :key='item.symbolKey'>
                    <div>
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
                        <button class='buy' @click='toOrder(item)'>
                            {{ $t('trade.buy') }}
                        </button>
                        <button class='sale' @click='toOrder(item)'>
                            {{ $t('trade.sell') }}
                        </button>
                    </div>
                </li>
            </ul>
            <div class='view-more'>
                <a href='javascript:;' @click='examineMore'>
                    <span>{{ $t('examineMore') }}</span>
                    <i class='el-icon-arrow-right'></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import useProduct from '@planspc/hooks/useProduct'
import { useRouter } from 'vue-router'
import globalData from '@h5/hooks/globalData'

export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {
                    href: '',
                    src: '',
                    target: '',
                }
            }
        },
        moduleId: {
            type: String,
            default: ''
        },
    },
    emits: ['update'],
    setup (props, context) {
        const { h5Preview } = globalData()
        const router = useRouter()
        const store = useStore()
        const curInstance = getCurrentInstance()
        const { $QuoteSocket } = curInstance.appContext.app.config.globalProperties

        // 玩法列表
        const plansList = computed(() => store.state._base?.plans || [])
        // 玩法类型
        const tradeType = ref(h5Preview ? '' : Number(plansList.value[0]?.tradeType))
        // 分类类型
        const categoryType = ref(0)
        // 过滤后的产品列表数据
        const filterProductList = ref([])

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType, isSelfSymbol: false
        })

        // 切换玩法
        const switchPlan = (val) => {
            if (tradeType.value !== val) {
                tradeType.value = val
            }
        }

        // 切换分类
        const switchCategory = (index) => {
            if (categoryType.value !== index) {
                categoryType.value = index
            }
        }

        // 设置产品数据
        const setProducts = () => {
            // 只显示指定数量数据
            const list = []
            const keys = []
            if (!h5Preview && productList.value?.length) {
                for (let i = 0; i < 6; i++) {
                    const item = productList.value[i]
                    if (item) {
                        list.push(item)
                        keys.push(item.symbolKey)
                    }
                }
                filterProductList.value = list
                $QuoteSocket.add_subscribe({
                    moduleId: props.moduleId,
                    symbolKeys: keys,
                })
            }
        }

        // 去交易
        const toOrder = item => {
            router.push(`/order?symbolId=${item.symbolId}&tradeType=${item.tradeType}`)
        }

        // 查看更多
        const examineMore = () => {
            const symbolId = productList.value[0].symbolId
            router.push(`/order?symbolId=${symbolId}&tradeType=${tradeType.value}`)
        }

        watch(() => tradeType.value, () => {
            categoryType.value = 0
        })

        // 监听玩法类型、分类类型
        watch([tradeType, categoryType, productList], () => {
            setProducts()
        })

        onMounted(() => {
            setProducts()
        })

        return {
            plansList,
            tradeType,
            categoryType,
            categoryList,
            productList,
            filterProductList,
            switchPlan,
            toOrder,
            examineMore,
            switchCategory
        }
    }
}
</script>

<style lang="scss" scoped>
.trade-module {
    margin-top: 96px;
}
.homeQuoteImg{
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: block;
}

// 玩法选项
.play-tabs {
    ul {
        display: flex;
    }
    li {
        margin-right: 47px;
        cursor: pointer;
        &:last-of-type {
            margin-right: 0;
        }
        span {
            font-size: 32px;
            font-weight: bold;
            color: var(--minorColor);
        }
    }
    li:hover {
        span {
            color: var(--color);
        }
    }
    .active {
        border-bottom: 3px solid var(--primary);
        span {
            color: var(--color);
        }
    }
}

// 分类选项
.category-tabs {
    margin-top: 38px;
    ul {
        display: flex;
    }
    li {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        padding: 0 22px;
        margin-right: 10px;
        font-size: 14px;
        color: var(--color);
        background: var(--bgColor);
        border-radius: 4px;
        cursor: pointer;
        &:last-of-type {
            margin-right: 0;
        }
        &:hover {
            color: var(--primary);
        }
    }
    .active {
        color: var(--primary);
        background: var(--primaryAssistColor);
    }
}

// 产品模块
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
            span {
                font-size: 20px;
            }
            &:first-of-type {
                span {
                    margin-left: 16px;
                }
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
            }
        }
        &:hover {
            background: var(--bgColor);
            border-radius: 10px;
        }
    }
}
.view-more {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    cursor: pointer;
    a {
        display: inline-flex;
        align-items: center;
        height: 100%;
        color: var(--minorColor);
    }
    span {
        font-size: 14px;
    }
}
</style>
