<template>
    <div class='quoteWrap'>
        <plansType v-if='plansList.length>1' :list='plansList' :value='tradeType' @change='handleTradeType' />
        <div class="search_box">
            <div class="search_input">
                 <van-search
                    v-model="state.searchKey"
                    show-action
                    clearable
                    placeholder="请输入搜索关键词"
                    @search="onSearch"
                    @cancel="onCancel"
                    @update:model-value='updateVal'
                />
            </div>
            <div class="search_products">
                <div class="product_item" v-for="item in state.searchList" :key="item.symbolId" @click="openProduct(item.id)">
                    <span>{{item.code}}</span>
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
import { ref, watch, computed, onActivated, reactive } from 'vue'
import plansType from '@/themes/plans/components/plansType.vue'
import useProduct from '@plans/hooks/useProduct'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { addCustomerOptional, removeCustomerOptional } from '@/api/trade'
import { Toast } from 'vant'
import { useI18n } from 'vue-i18n'
import { getSymbolList } from '@/api/trade'

export default {
    name: 'Quote',
    components: {
        plansType
    },
    setup () {
        const state = reactive({
            searchKey: "",
            searchFlag:false,
            searchList:[]
        })
        const { t } = useI18n({ useScope: 'global' })
        const router = useRouter()
        const store = useStore()
        // 玩法列表
        const plansList = computed(() => store.state._base.plans)
        const productMap = computed(() => store.state._quote.productMap)

        // 1.玩法类型
        const tradeType = ref(plansList.value[0].id)

        // 自选股
        const selfSymbolList = computed(() => store.state._user.selfSymbolList)
        // 监听玩法类型
        const handleTradeType = (val) => {
            tradeType.value = val
            console.log("val",val)
            state.searchList = [];
            state.searchKey = '';
        }

        const onSearch = () =>{
            if (!state.searchKey) return false
            getSymbolList({ name: state.searchKey, tradeType: tradeType.value }).then(res => {
                if (res.check()) {
                    let list = res.data || []
                    state.searchList = list
                    console.log("selfSymbolList",selfSymbolList)
                    const currentSelfSymbolList = selfSymbolList.value[tradeType.value];
                    let isSelfSymbol = false;
                    state.searchList.forEach(item=>{
                        item.isSelfSymbol = isSelfSymbol;
                        currentSelfSymbolList.forEach(el=>{
                            if(item.id===el.symbolId||item.id===el.id){
                                item.isSelfSymbol = true;
                            }
                        })
                    })
                    console.log("state.searchList",state.searchList)
                }
            })
        }
        const updateVal = (val) => {
            onSearch(val)
        }
        const openSearch = () =>{
            state.searchList = [];
            state.searchFlag=true
        }
        const onCancel = ()=>{
            router.push('/quote')
        }
        const openProduct = (symbolId) => {
            router.push(`/product?symbolId=${symbolId}&tradeType=${tradeType.value}`)
        }
        // 添加自选
        const addOptional = (item) => {
            if (item.isSelfSymbol) {
                removeCustomerOptional({ symbolList: [item.id],tradeType:tradeType.value }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        Toast(t('trade.removeOptionalOk'))
                        for(let key in selfSymbolList.value){
                            selfSymbolList.value[key].forEach((el,index)=>{
                                    if(item.id===el.symbolId||item.id===el.id){
                                        selfSymbolList.value[key].splice(index,1);
                                    }
                                }
                            )
                        }
                        //store.commit('_user/Update_selfSymbolList', selfSymbolList)
                        onSearch();
                    }
                }).catch(err => {
                })
            } else {
                addCustomerOptional({ symbolList: [item.id],tradeType:tradeType.value }).then(res => {
                    if (res.check()) {
                        store.dispatch('_user/queryCustomerOptionalList')
                        selfSymbolList.value[tradeType.value].push(item)
                        //store.commit('_user/Update_selfSymbolList', selfSymbolList)
                        onSearch();
                        Toast(t('trade.addOptionalOk'))
                    }
                }).catch(err => {
                 
                })
            }
        }

        return {
            updateVal,
            openSearch,
            addOptional ,
            openProduct,
            onSearch,
            onCancel,
            state,
            plansList,
            handleTradeType,
            tradeType
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
:deep(.van-cell) {
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
