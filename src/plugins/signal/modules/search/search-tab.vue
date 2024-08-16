<template>
    <div class='layout-content'>
        <van-tabs v-model:active='current' class='search-tab'>
            <van-tab
                v-for='(item, index) in tabs'
                :key='index'
                :title='item.name'
            />
        </van-tabs>
        <div class='signal-content'>
            <!-- 信号 -->
            <div v-show='current !== 2' class='signal-module'>
                <div class='module-title'>
                    <span>{{ $t('signal.search.signal') }}</span>
                </div>
                <search-signal
                    :keyword='searchKey'
                    :limit='current === 0 ? 5 : 50'
                    @saveHistory='saveHistory'
                />
            </div>
            <!-- 产品 -->
            <div v-show='current !== 1' class='product-module'>
                <div class='module-title'>
                    <span>{{ $t('signal.search.product') }}</span>
                </div>
                <search-result
                    v-if='searchList.length > 0'
                    :list='searchList'
                    :search-key='searchKey'
                    :trade-type='tradeType'
                    @click='saveHistory'
                    @onSearch='onSearch'
                />
                <none-data v-else />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, toRefs, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { getSymbolList } from '@/api/trade'
import { useI18n } from 'vue-i18n'
import searchResult from '@/plugins/signal/modules/search/search-result'
import { debounce } from '@/utils/util'
import searchSignal from '@/plugins/signal/modules/search/search-signal'
import noneData from '@/plugins/signal/components/none-data.vue'

export default {
    name: 'ProductSearch',
    components: {
        searchResult,
        searchSignal,
        noneData
    },
    props: {
        // 关键词
        keyword: {
            type: String,
            default: '',
        }
    },
    setup (props) {
        const { t } = useI18n({ useScope: 'global' })
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const state = reactive({
            searchKey: '', // 搜索值
            searchList: [], // 产品列表数据
            searchContentShow: false, // 是否显示搜索内容
            tabs: [
                { name: t('signal.search.all') },
                { name: t('signal.search.signal') },
                { name: t('signal.search.product') }
            ],
            // 当前选项卡下标
            current: 0
        })

        const productMap = computed(() => store.state._quote.productMap)

        // 玩法列表
        const isWallet = store.state._base.wpCompanyInfo.isWallet
        const plansList = computed(() =>
            store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
                .map(el => {
                    el.name = t('tradeType.' + el.tradeType)
                    return el
                })
        )

        // 1.玩法类型
        const tradeType = ref(route.query.tradeType || plansList.value[0].id)

        // 自选股
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)

        const handleSearch = debounce(value => {
            state.searchKey = value
            onSearch(value)
        }, 500)

        const onSearch = () => {
            if (!state.searchKey) return false
            getSymbolList({
                name: state.searchKey,
                tradeType: tradeType.value,
                customerGroupId: store.getters.customerGroupId
            }).then(res => {
                if (res.check()) {
                    const list = res.data || []
                    state.searchList = []
                    list.forEach(item => {
                        for (const el in productMap.value) {
                            if (productMap.value[el].symbolKey === (String(item.id) + '_' + tradeType.value)) {
                                state.searchList.push(item)
                            }
                        }
                    })
                    const currentSelfSymbolList = selfSymbolList.value[tradeType.value] || []
                    const isSelfSymbol = false
                    state.searchList.forEach(item => {
                        item.isSelfSymbol = isSelfSymbol
                        currentSelfSymbolList.forEach(el => {
                            if (item.id === el.symbolId || item.id === el.id) {
                                item.isSelfSymbol = true
                            }
                        })
                    })
                }
            })
        }
        const updateVal = (val) => {
            if (!val) {
                state.searchList = []
                state.searchContentShow = false
            } else {
                state.searchContentShow = true
            }
            handleSearch(val)
        }

        // 点击历史搜索
        const quickSearch = (val) => {
            state.searchKey = val
            updateVal(val)
        }

        const onCancel = () => {
            router.push('/quote')
        }

        const onClear = () => {
            state.searchKey = ''
        }

        const saveHistory = () => {
            let arr = store.state._user.searchHistory
            arr.unshift(state.searchKey)
            arr = [...new Set(arr)]
            store.commit('_user/Update_SearchHistory', arr)
        }

        watch(() => props.keyword, handleSearch, { immediate: true })

        return {
            updateVal,
            onSearch,
            onCancel,
            onClear,
            tradeType,
            saveHistory,
            quickSearch,
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>
.layout-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    .search-tab {
        padding: 0 12px;
        :deep {
            .van-tab {
                flex: none;
                font-size: rem(28px);
                padding: 0 rem(20px);
            }
            .van-tabs__nav {
                background: none;
            }
            .van-tabs__line {
                background: var(--primary);
                height: 2px;
                border-radius: 0;
            }
        }
    }
    .signal-content {
        flex: 1;
        overflow: auto;
        padding: 0 12px;
    }
    .signal-module {
        margin-top: rem(32px);
        margin-bottom: rem(64px);
    }
    .product-module {
        margin-top: rem(32px);
        :deep {
            .module-title {
                margin-bottom: 0;
            }
            .search_products {
                .product_item {
                    width: 100%;
                    height: rem(116px);
                    padding: rem(40px) rem(20px);
                    border-bottom: 1px solid var(--lineColor);
                    display: flex;
                    align-items: center;
                    .symbol-code {
                        flex: 1;
                        display: flex;
                        .img-group {
                            margin-right: rem(16px);
                        }
                    }
                    .collect-icon {
                        background: none;
                        width: rem(50px);
                        height: rem(116px);
                        margin-right: rem(-40px);
                    }
                }
            }
        }
    }
    .module-title {
        color: var(--minorColor);
        border-bottom-color: var(--lineColor);
        display: flex;
        align-items: center;
        padding-bottom: rem(24px);
        margin-bottom: rem(16px);
        font-size: rem(26px);
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }
}
</style>
