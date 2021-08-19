<template>
    <div class='quoteWrap'>
        <plansType v-if='plansList.length>1' :list='plansList' :value='tradeType' @change='handleTradeType' />
        <div class='tradeNav'>
            <TopTab
                ref='tabList'
                v-model='categoryType'
                :background='$style.contentColor'
                class='tradeSortNav'
                :dot='true'
                line-height='0'
                line-width='0'
                :list='categoryList'
                @change='tabChange'
                @tabClick='tabClick'
            />
            <van-icon name="search" @click="openSearch"/>
        </div>
        <div class='titleBar van-hairline--bottom'>
            <span class='item'>
                {{ $t('trade.nameCode') }}
            </span>
            <span class='item'>
                {{ $t('trade.sellPrice') }}
            </span>
            <span class='item'>
                {{ $t('trade.buyPrice') }}
            </span>
        </div>
        <productListComp v-if='productList.length' ref='productListEl' :product-list='productList' />
        <!--搜索产品弹窗-->
        <div class="search_box" v-if="state.searchFlag">
            <div class="search_input">
                 <van-search
                    v-model="state.value1"
                    show-action
                    clearable
                    placeholder="请输入搜索关键词"
                    @search="onSearch"
                    @cancel="onCancel"
                />
            </div>
            <div class="search_products">
                <div class="product_item" v-for="item in state.searchList" :key="item.symbolId" @click="openProduct(item.symbolId)">
                    <span>{{item.symbolCode}}</span>
                    <button v-preventReClick class='collectIcon' @click.stop='addOptional(item)'>
                        <i
                            class='icon_zixuan1'
                            :class="{ 'icon_zixuan2':item.isSelfSymbol }"
                        ></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopTab from '@plans/components/topTab'
import productListComp from '@plans/modules/productList/productList.vue'
import { ref, watch, computed, onActivated, reactive } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'

export default {
    name: 'Quote',
    components: {
        productListComp,
        TopTab,
        plansType
    },
    setup () {
        const state = reactive({
            value1: "",
            searchFlag:false,
            searchList:[]
        })
        const { t } = useI18n({ useScope: 'global' })
        const router = useRouter()
        const store = useStore()
        const productListEl = ref(null)
        // 玩法列表
        const plansList = computed(() => store.state._base.plans)

        // 1.玩法类型
        const tradeType = ref(plansList.value[0].id)
        // 2.板块类型
        const categoryType = ref(0)
        // 自选股
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        // 监听玩法类型
        const handleTradeType = (val) => {
            console.log("val",val)
            console.log("productList",productList)
            tradeType.value = val
            categoryType.value = 0
        }

        // 获取板块列表和所选板块的产品列表
        const { categoryList, productList } = useProduct({
            tradeType, categoryType
        })
        const onSearch = () =>{
            state.searchList = [];
            productList._value.forEach(item=>{
               if(item.symbolCode.indexOf(state.value1)!==-1){
                    console.log("selfSymbolList",selfSymbolList.value)
                    let isSelfSymbol = false;
                    for(let key in selfSymbolList.value){
                        if(selfSymbolList.value[key].length>0){
                            selfSymbolList.value[key].forEach(selfEl=>{
                                if(selfEl.symbolId===item.symbolId){
                                    isSelfSymbol = true;
                                }
                            })      
                        }
                    }
                    item.isSelfSymbol = isSelfSymbol;
                    state.searchList.push(item);
               }
            })
            console.log("searchList",state.searchList)
        }
        const openSearch = () =>{
            state.searchList = [];
            state.searchFlag=true
        }
        const onCancel = ()=>{
            state.searchFlag = false;
        }
        const openProduct = (symbolId) => {
            // router.push({ name: 'Order', query: { symbolId: data.symbolId, direction: 'buy' } })
            router.push(`/product?symbolId=${symbolId}&tradeType=${tradeType.value}`)
        }
        // 添加自选
        const addOptional = (item) => {
            if (item.isSelfSymbol) {
                removeCustomerOptional({ symbolList: [item.symbolId],tradeType:tradeType._value }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.removeOptionalOk'))
                        for(let key in selfSymbolList._value){
                            selfSymbolList._value[key].forEach((el,index)=>{
                                    if(item.symbolId===el.symbolId){
                                        el.splice(index,1);
                                    }
                                }
                            )
                        }
                        onSearch();
                    }
                }).catch(err => {
                })
            } else {
                addCustomerOptional({ symbolList: [item.symbolId],tradeType:tradeType._value }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        
                        for(let key in selfSymbolList._value){
                            selfSymbolList._value[key].push(item)
                            break;
                        }
                        onSearch();
                        Toast(t('trade.addOptionalOk'))
                    }
                }).catch(err => {
                 
                })
            }
        }
        // 监听玩法类型/板块类型的变化，触发产品订阅
        // 获取productList.vue组件的ref对象和产品列表均是异步，所以第一次产品订阅在productList.vue组件内
        watch(
            [tradeType, categoryType],
            () => {
                if (productListEl.value) productListEl.value.calcProductsDebounce()
            }
        )

        onActivated(() => {
            if (productListEl.value) productListEl.value.calcProductsDebounce()
        })

        const tabChange = (i) => {}
        const tabClick = (i) => {}

        const showSidebar = ref(false)

        return {
            openSearch,
            addOptional ,
            openProduct,
            onSearch,
            onCancel,
            state,
            categoryType,
            productListEl,
            plansList,
            categoryList,
            productList,
            tabChange,
            tabClick,
            handleTradeType,
            tradeType,
            showSidebar
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
::v-deep .van-cell {
    background-color: var(--bgColor) !important;
}
.quoteWrap {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    // margin-top: rem(90px);
    padding-bottom: rem(100px);
    overflow: auto;
    background: var(--bgColor);
    .productListWrap {
        flex: 1;
        overflow-y: auto;
    }
    .search_box {
        position: absolute;
        top: rem(100px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        background: var(--contentColor);
        .search_input {
            .van-field {
                border-radius: 3px;
            }
        }
        .search_label {
            display: inline-block;
            color: #333;
        }
        .search_products {
            background: var(--contentColor);
            .product_item {
                width: 100%;
                height: rem(116px);
                padding: rem(40px);
                border-bottom: 1px solid #F8F8F8;
                button {
                    float: right;
                    background: var(--bgColor) !important;
                }
                .icon_zixuan2 {
                    color: #FC822F;
                    animation: heartBeat 1.3s ease-in-out forwards;
                }
            }
        }
    }
}
.tradeNav {
    // position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    //padding-bottom: rem(10px);
    background-color: var(--contentColor);
    //border-bottom: solid 4px var(--lineColor);
    .van-tab {
        background: yellow !important;
    }
    .tradeSortNav {
        padding-right: rem(64px) !important;
    }
    i {
        position: relative;
        right: rem(40px);
        bottom: rem(60px);
        float: right;
    }
}
.titleBar {
    display: flex;
    height: rem(60px);
    padding: 0 rem(30px);
    color: var(--minorColor);
    font-size: rem(20px);
    line-height: rem(60px);
    background-color: var(--contentColor);
    .item {
        width: rem(210px);
        text-align: right;
        &:first-child {
            flex: 1;
            text-align: left;
        }
        &:nth-child(2) {
            width: rem(210px);
            text-align: left;
        }
    }
}
</style>
