<template>
    <div class='trade-module auto-width'>
        <!-- 玩法选项 -->
        <div class='play-tabs'>
            <ul>
                <li
                    v-for='item in plansList'
                    :key='item.tradeType'
                    :class="{ 'active': Number(item.tradeType) === tradeType }"
                    @click='switchPlans(item)'
                >
                    <span>{{ item.alias || item.name }}</span>
                </li>
            </ul>
        </div>
        <!-- 分类选项 -->
        <div class='category-tabs'>
            <ul>
                <li v-for='(item, index) in 5' :key='index' :class="{ 'active': index === categoryType }" @click='switchCategory(index)'>
                    <span>自选{{ index + 1 }}</span>
                </li>
            </ul>
        </div>
        <!-- 产品列表 -->
        <div class='product-module'>
            <ul class='header-block'>
                <li>
                    <span>名称</span>
                </li>
                <li>
                    <span>最新价</span>
                </li>
                <li>
                    <span>涨跌额</span>
                </li>
                <li>
                    <span>涨跌幅</span>
                </li>
                <li>
                    <span>操作</span>
                </li>
            </ul>
            <ul class='product-list'>
                <li v-for='(item, index) in 5' :key='index'>
                    <div>
                        <span>BTC/USDT</span>
                    </div>
                    <div>
                        <span>50027.66</span>
                    </div>
                    <div>
                        <span>56.66</span>
                    </div>
                    <div>
                        <span>-1.73%</span>
                    </div>
                    <div class='handle'>
                        <button class='buy'>
                            买入
                        </button>
                        <button class='sale'>
                            卖出
                        </button>
                    </div>
                </li>
            </ul>
            <div class='view-more'>
                <router-link to='/'>
                    <span>查看更多</span>
                    <i class='el-icon-arrow-right'></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'
import useProduct from '@plans/hooks/useProduct'

export default {
    setup () {
        const store = useStore()
        const state = reactive({
            tradeType: '',
            categoryType: 0,
            categoryList: [],
            productList: []
        })

        // 玩法列表
        const plansList = computed(() => store.state._base.plans)

        // 获取玩当下的分类和产品数据
        const getPlansData = () => {
            const { categoryList, productList } = useProduct({
                tradeType: state.tradeType,
                categoryType: state.categoryType
            })
            state.categoryType = categoryList.value[0].id
            state.categoryList = categoryList
            state.productList = productList
        }

        // 切换玩法
        const switchPlans = (item) => {
            const tradeType = Number(item.tradeType)
            if (state.tradeType !== tradeType) {
                state.tradeType = tradeType
            }
        }

        // 切换分类
        const switchCategory = (index) => {
            if (state.categoryType !== index) {
                state.categoryType = index
            }
        }

        onMounted(() => {
            // 设置默认玩法
            state.tradeType = Number(plansList.value[0].tradeType)
        })

        return {
            ...toRefs(state),
            plansList,
            switchPlans,
            switchCategory,
            getPlansData
        }
    }
}
</script>

<style lang="scss" scoped>
.trade-module {
    margin-top: 96px;
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
    .product-list {
        li {
            display: flex;
            align-items: center;
            height: 64px;
            background: var(--contentColor);
            cursor: pointer;
            div {
                flex: 1;
                span {
                    font-size: 20px;
                    color: var(--color);
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
}
</style>
