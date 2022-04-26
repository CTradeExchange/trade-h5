
import { useStore } from 'vuex'
import { getListByParentCode } from '@/api/base'
import { ref } from 'vue'

// 产品标签分类
function productByLabel (product, symbolLabelMap) {
    const labels = product.labels
    if (!labels) return
    labels.split(',').forEach(el => {
        if (symbolLabelMap.value[el]) {
            symbolLabelMap.value[el].push(product)
        } else {
            symbolLabelMap.value[el] = [product]
        }
    })
}

export default (params) => {
    const store = useStore()
    const symbolLabelList = ref([]) // 标签列表
    const symbolLabelMap = ref({})
    const profitCurrencyMap = ref({})
    const sortPlans = ['5','3','2','1'];    // 取产品玩法的排序；现货 → 杠杆 → 合约全仓 → 合约逐仓
    const productByPlans = [];  // 按顺序取到的某个玩法的产品列表
    const productListByLabel = ref([]);  // 产品根据标签分类

    // 获取产品标签的字典
    getListByParentCode({ parentCode: 'SymbolLabel' }).then(res => {
        if (res.check()) symbolLabelList.value = res.data
    })

    store.dispatch('_quote/querySymbolBaseInfoList', null).then(res => {
        if (res.check()) {
            const planMap = store.state._quote.planMap; // 每个玩法下配置的产品
            const plans = store.state._base.plans;  // 玩法列表
            const isWallet = store.state._base.wpCompanyInfo?.isWallet;  // 现货是否当钱包使用
            const productMap = store.state._quote.productMap;
            if(isWallet) sortPlans.shift();
            sortPlans.forEach(plan=>{
                const planItem = plans.find(el=>el.tradeType===plan);
                const symbolList = planMap[plan].symbolList.filter(el=> productMap[`${el}_${plan}`]?.symbolName);   // 过滤出有权限的产品列表
                if(planItem && symbolList.length && productByPlans.length===0){
                    symbolList.forEach(el=> {
                        productByPlans.push(productMap[`${el}_${plan}`])
                    })
                }
            })

            productByPlans.forEach(el => {
                // 标签分类
                productByLabel(el, symbolLabelMap)

                // 盈利货币分类
                const profitCurrency = el.profitCurrency
                if (profitCurrencyMap.value[profitCurrency]) {
                    profitCurrencyMap.value[profitCurrency].push(el)
                } else {
                    profitCurrencyMap.value[profitCurrency] = [el]
                }
            })

            // 将产品列表根据标签、盈利货币进行分类
            Object.keys(symbolLabelMap.value).forEach(el=>{
                const proList = symbolLabelMap.value[el];   // 当前标签下的产品列表
                const proByCurrency = {}    // 当前标签的产品列表根据盈利货币进行分类
                proList.forEach(pro => {
                    const profitCurrency = pro.profitCurrency
                    if (proByCurrency[profitCurrency]) {
                        proByCurrency[profitCurrency].push(pro)
                    } else {
                        proByCurrency[profitCurrency] = [pro]
                    }
                })

                const proListByCurrency = Object.entries(proByCurrency).map(([key,val])=>{
                    return {
                        currency: key,
                        list: val,
                    }
                })

                productListByLabel.value.push({
                    labelCode: el,
                    list: proListByCurrency
                })
            })
        }
    })
    console.log(symbolLabelMap.value)
    console.log(profitCurrencyMap.value)
    return {
        symbolLabelList,
        symbolLabelMap,
        profitCurrencyMap,
        productListByLabel,
    }
}
