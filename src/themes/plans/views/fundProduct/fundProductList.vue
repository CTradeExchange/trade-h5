<template>
    <div ref='scrollParent' class='pageWrapp'>
        <LayoutTop :back='true' :menu='false' />
        <div v-if='fundProductList.length === 0'>
            <van-empty :description='$t("common.noData")' image='/images/empty.png' />
        </div>
        <div v-else ref='lazyParent'>
            <FundCard v-for='item in fundProductList' :key='item.fundId' :fund='item' @click='goInfo(item)' />
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FundCard from './components/fundCard.vue'
import { findFundList } from './hooks/fundInfo'
import { debounce } from '@/utils/util'
const rouer = useRouter()
const lazyParent = ref(null)
const scrollParent = ref(null)
const { getFundList, fundProductList, lazyloadData } = findFundList()

// 跳转到基金详情
const goInfo = item => rouer.push('/fundProductInfo?fundId=' + item.fundId)

// 滚动时加载单个基金产品的最新数据，防抖
const lazyDataDebounce = debounce(() => {
    const scrollTop = scrollParent.value.scrollTop
    const viewportRange = [scrollTop, scrollTop + document.body.clientHeight] // 整个页面高度可视范围 [开始，结束]
    const childrenEl = [...lazyParent.value.children]
    // 计算子元素是否在页面可视范围内
    childrenEl.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        const block = rect.y + rect.height
        if (block > viewportRange[0] && block < viewportRange[1]) {
            // console.log(i, '在可视范围内')
            lazyloadData(i)
        }
    })
})

onMounted(() => {
    getFundList().then(() => {
        lazyDataDebounce()
    })
    scrollParent.value.addEventListener('scroll', lazyDataDebounce, false)
})
onBeforeUnmount(() => {
    scrollParent.value.removeEventListener('scroll', lazyDataDebounce, false)
})
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.pageWrapp{
    margin-top: rem(110px);
    flex: 1;
    overflow-y: auto;
}
</style>
