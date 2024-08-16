<template>
    <van-popup
        v-model:show='show'
        :duration='0.2'
        position='left'
        :style="{ height: '100%' }"
        teleport='body'
        @closed='onClosed'
        @open='onOpen'
    >
        <div class='sidebarProduct'>
            <!-- <plansType
                v-if='!hideTradeType'
                ref='plansTypeRef'
                class='plansType'
                :list='plansList'
                :value='tradeType'
                @change='handleTradeType'
            /> -->
            <search ref='searchRef' :class='{ margin: hideTradeType }' :trade-type='tradeType' @cancel='onCancel' @select='onClick'>
                <TopTab
                    v-model='categoryType'
                    :background='$style.contentColor'
                    class='tabs'
                    :dot='true'
                    line-height='0'
                    line-width='0'
                    :list='categoryList'
                />
                <div class='listWrap'>
                    <div v-for='item in productList' :key='item.id' :class="['li',item.symbolKey==symbolKey?'active':'']" @click='() => onClick(item)'>
                        <div class='li-left'>
                            <product-icon :symbol-key='item.symbolKey' />
                            <span>
                                {{ item.symbolName }}
                            </span>
                        </div>
                        <div class='list-item-right'>
                            <span :class="['price',item.last_color]">
                                {{ item.rolling_last_price }}
                            </span>
                            <div :class="['ups-and-downs', item.rolling_upDownColor]">
                                <span>{{ item.rolling_upDownWidth }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </search>
        </div>
    </van-popup>
</template>

<script>
import { ref, computed, unref, toRaw, watch, onMounted } from 'vue'
// import plansType from '@/themes/plans/components/plansType.vue'
import TopTab from '@plans/components/topTab'
import useProduct from '@plans/hooks/useProduct'
import search from './search'
import { useStore } from 'vuex'
import productIcon from '@/components/product-icon.vue'
import { QuoteSocket } from '@/plugins/socket/socket'

export default {
    components: {
        // plansType,
        TopTab,
        search,
        productIcon,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        defaultTradeType: {
            type: [String, Number],
            default: '',
        },
        hideTradeType: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'select'],
    setup (props, context) {
        const store = useStore()
        const show = computed({
            get: () => props.modelValue,
            set: (val) => {
                context.emit('update:modelValue', val)
            },
        })

        const plansTypeRef = ref(null)
        const searchRef = ref(null)

        // 取消按钮事件
        const onCancel = () => {
            show.value = false
        }

        // 玩法列表
        // const plansList = computed(() => store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet)))
        const plansList = computed(() => {
            const userProductCategory = store.getters.userProductCategory
            const resultPlans = store.state._base.plans.filter((e) => {
                return userProductCategory[e.tradeType]?.find((o) => o.listByUser?.length)
            })
            return resultPlans
        })
        // 默认玩法类型
        const InitialTradeType = computed(() => String(props.defaultTradeType) || unref(plansList)[0].id)
        // 1.玩法类型
        const tradeType = ref(unref(InitialTradeType))
        // 2.板块类型
        const categoryType = ref(0)
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            categoryType.value = 0
            unref(searchRef) && unref(searchRef).reset()
        }

        const localSymbolUpdate = computed(() => store.state._user.localSelfSymbolList)

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType,
            categoryType,
            isSort: false,
            notUseType: true,
        })

        const symbolKey = computed(() => store.state._quote.productActivedID)

        const planMap = computed(() => store.state._quote.planMap) // 每个玩法下配置的产品

        // 需要订阅的产品列表
        const subscribeSymbolsList = computed(() => {
            const symbolList = planMap.value[tradeType.value]?.symbolList || []
            const symbolKeys = symbolList.map((symbolId) => `${symbolId}_${tradeType.value}`).sort((a, b) => a.localeCompare(b))
            return symbolKeys
        })

        const onClick = (product) => {
            store.commit('_quote/Update_productActivedID', `${product.symbolId}_${product.tradeType}`)
            context.emit('select', toRaw(product), onCancel)
        }

        const onOpen = () => {
            tradeType.value = unref(InitialTradeType)
            unref(plansTypeRef) && unref(plansTypeRef).reset()
        }

        const onClosed = () => {
            unref(searchRef) && unref(searchRef).reset()
        }

        watch(
            () => localSymbolUpdate.value,
            (list) => {
                if (unref(categoryType) === 0) {
                    const tempCur = categoryType.value
                    categoryType.value = categoryType.value === '1' ? '0' : '1'
                    categoryType.value = tempCur
                }
            },
        )
        const moduleId = 'quote_' + Date.now()

        onMounted(() => {
            if (unref(subscribeSymbolsList).length === 0) return false
            QuoteSocket.add_subscribe24H({ moduleId, symbolKeys: subscribeSymbolsList.value })
        })

        return {
            show,
            tradeType,
            handleTradeType,
            categoryType,
            categoryList,
            productList,
            plansList,
            onCancel,
            onClick,
            plansTypeRef,
            onOpen,
            searchRef,
            symbolKey,
            onClosed,
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.sidebarProduct {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: rem(640px);
    height: 100%;
    overflow: hidden;
    background: var(--contentColor);
    padding-top:16px;
    .plansType {
        flex: 0 0 rem(100px);
        border: 0;
    }
    .plansType,
    .tabs {
        box-sizing: border-box;
        width: 100%;
        padding: 0 rem(20px);
    }
    .tabs {
        margin: rem(20px) 0 0 0;
    }
    .listWrap {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        overflow-y: auto;
        color: var(--color);
        font-weight: 500;
        font-size: 16px;
        line-height: 18px;
        .li {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 16px 10px;
            border-bottom: 1px solid var(--lineColor);
            &.active{
              background-color: #f9f9f9;
            }
            .li-left {
                display: flex;
                align-items: center;
            }
            .list-item-right {
                padding-right: 10px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-end;
                .price{
                  color: #121212;
                font-family: "Inter";
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                margin-bottom: 2px;
                }

                .ups-and-downs {
                    display: flex;
                    border-radius: 4px;
                    font-size: 12px;
                    align-items: center;
                    justify-content: center;
                    &.riseColor {
                        color: var(--riseColor);
                    }

                    &.fallColor {
                        color: var(--fallColor);
                    }
                    &.grayColor {
                        color: #f4f4f4;
                        & > span {
                            color: #000;
                        }
                    }
                    // & > span {
                    //     color: #fff;
                    // }
                }
            }
            &:deep(.img-group) {
                margin-left: rem(30px);
                margin-right: rem(12px);
            }
            &:last-child {
                border: 0;
            }
        }
    }
    .margin {
        margin-top: rem(30px);
    }
}
</style>
