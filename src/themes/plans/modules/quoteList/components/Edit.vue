<template>
    <div>
        <PlansList v-model='plansValue' :list='plansList' />
        <CategoryList
            v-model='categoryValue'
            :list='categoryList'
        />
        <template v-for='item in props.styleConfig' :key='item'>
            <component :is='componentMap[item.styleType]' :product-list='productList' :show-title='item.showTitle' />
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import PlansList from './common/PlansList'
import CategoryList from './common/CategoryList'
import { getComponentMap } from './dataConfig'

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const props = defineProps({
    styleConfig: {
        type: Array,
        default: () => []
    },
})

const plansList = [
    { 'tradeType': '5', 'name': '现货' },
    { 'tradeType': '3', 'name': '杠杆' },
    { 'tradeType': '1', 'name': '合约全仓' },
    { 'tradeType': '2', 'name': '合约逐仓' },
]
const plansValue = ref(plansList[0].tradeType)
const categoryList = [
    {
        title: t('trade.favorites'),
        id: 'selfSymbol',
        listByUser: [{}]
    },
    {
        title: '板块名称1',
        id: '1',
        listByUser: [{}]
    },
    {
        title: '板块名称2',
        id: '2',
        listByUser: [{}]
    }
]
const categoryValue = ref(categoryList[0].id)
const productList = computed(() => store.state._quote.productList.slice(0, 5))

const componentMap = getComponentMap()
</script>
