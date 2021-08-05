<template>
    <!-- <van-cell is-link @click='showPopup'>
        展示弹出层
    </van-cell> -->
    <van-popup v-model:show='show' position='left' :style="{ height: '100%' }">
        <div class='sidebarProduct'>
            <plansType class='plansType' :value='tradeType' @change='handleTradeType' />
            <van-search
                v-model='searchValue'
                class='search'
                placeholder='请输入搜索关键词'
                show-action
                @cancel='onCancel'
                @search='onSearch'
            />
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
                <div v-for='item in productList' :key='item.id' class='li'>
                    {{ item.symbolName }}
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script>
import { ref, watch } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import TopTab from '@plans/components/topTab'
import useProduct from '@plans/hooks/useProduct'
export default {
    components: {
        plansType,
        TopTab
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    setup (props, context) {
        const show = ref(props.modelValue)
        watch(() => props.modelValue, (val) => {
            show.value = val
        })

        // 1.玩法类型
        const tradeType = ref(1)
        // 2.板块类型
        const categoryType = ref(0)
        // 搜索值
        const searchValue = ref('')
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            categoryType.value = 0
        }

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType
        })

        // 监听玩法类型/板块类型的变化，触发产品订阅
        // 获取productList.vue组件的ref对象和产品列表均是异步，所以第一次产品订阅在productList.vue组件内
        // watch(
        //     [tradeType, categoryType],
        //     () => {
        //     }
        // )

        const onCancel = () => {}
        const onSearch = () => {}

        return {
            show,
            tradeType,
            handleTradeType,
            searchValue,
            categoryType,
            categoryList,
            productList,
            onSearch,
            onCancel
        }
    }
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
    .plansType,
    .search,
    .tabs {
        box-sizing: border-box;
        width: 100%;
        padding: 0 rem(30px);
    }
    .tabs {
        margin: rem(20px) 0 0 0;
    }
    .listWrap {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        box-sizing: border-box;
        width: 100%;
        overflow-y: auto;
        color: var(--color);
        font-weight: 500;
        font-size: rem(30px);
        line-height: rem(32px);
        .li {
            width: 100%;
            padding: rem(40px) rem(20px);
            text-indent: rem(30px);
            border-bottom: 1px solid var(--bgColor);
            &:last-child {
                border: 0;
            }
        }
    }
}
</style>
