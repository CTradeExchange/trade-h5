<template>
    <van-popup v-model:show='show' position='left' :style="{ height: '100%' }" @closed='onClosed'>
        <div class='sidebarProduct'>
            <plansType ref='plansTypeRef' class='plansType' :value='tradeType' @change='handleTradeType' />
            <search
                :trade-type='tradeType'
                @cancel='onCancel'
                @select='onClick'
            >
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
                    <div v-for='item in productList' :key='item.id' class='li' @click='() => onClick(item)'>
                        {{ item.symbolName }}
                    </div>
                </div>
            </search>
        </div>
    </van-popup>
</template>

<script>
import { ref, computed, unref, toRaw } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import TopTab from '@plans/components/topTab'
import useProduct from '@plans/hooks/useProduct'
import search from './search'
import { useStore } from 'vuex'

export default {
    components: {
        plansType,
        TopTab,
        search
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue', 'select'],
    setup (props, context) {
        const store = useStore()
        const show = computed({
            get: () => props.modelValue,
            set: val => {
                context.emit('update:modelValue', val)
            }
        })

        const plansTypeRef = ref(null)

        const onClosed = () => {
            tradeType.value = unref(plansList)[0].id
            categoryType.value = 0
            unref(plansTypeRef) && unref(plansTypeRef).reset()
        }

        // 取消按钮事件
        const onCancel = () => {
            show.value = false
        }

        // 玩法列表
        const plansList = computed(() => store.state._base.plans)

        // 1.玩法类型
        const tradeType = ref(unref(plansList)[0].id)
        // 2.板块类型
        const categoryType = ref(0)
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            categoryType.value = 0
        }

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType
        })

        const onClick = product => {
            context.emit('select', toRaw(product), onCancel)
        }
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
            onClosed,
            plansTypeRef
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
    .plansType {
        flex: 0 0 rem(100px);
        border: 0;
    }
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
