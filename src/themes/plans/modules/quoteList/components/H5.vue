<template>
    <div class='h5'>
        <PlansList v-model='tradeType' :list='plansList' />
        <CategoryList
            v-model='categoryType'
            :list='categoryList'
        />
        <template v-for='item in props.styleConfig' :key='item'>
            <component :is='componentMap[item.styleType]' :product-list='productList' :should-fresh='shouldFresh' :show-title='item.showTitle' />
        </template>
    </div>
</template>

<script setup>
import { ref, computed, unref, nextTick, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import PlansList from './common/PlansList'
import CategoryList from './common/CategoryList'
import useProduct from '@plans/hooks/useProduct'
import { getComponentMap } from './dataConfig'

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    styleConfig: {
        type: Array,
        default: () => []
    }
})

// 玩法列表
const isWallet = store.state._base.wpCompanyInfo.isWallet
const plansList = computed(() =>
    store.state._base.plans.filter(e => !(e.tradeType === '5' && isWallet))
        .map(el => {
            el.name = t('tradeType.' + el.tradeType)
            return el
        })
)
const symbolKey = computed(() => store.state._quote.productActivedID || '')
const productTradeType = computed(() => unref(symbolKey).split('_')[1] || 0)
// 1.玩法类型
const tradeType = ref(unref(productTradeType))
// 2.板块类型
const categoryType = ref(0)
// 获取板块列表和所选板块的产品列表
const { categoryList, productList } = useProduct({
    tradeType, categoryType
})

const componentMap = getComponentMap()

const shouldFresh = ref(false)

onMounted(() => {
    watch(() => [tradeType.value, categoryType.value], async (val, oldVal) => {
        shouldFresh.value = true
        await nextTick()
        shouldFresh.value = false
    })
})

</script>

<style lang="scss" scoped>
.h5{
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
