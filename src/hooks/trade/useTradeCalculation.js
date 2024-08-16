import { computed, reactive, toRefs } from 'vue'
import { mul, div } from '@/utils/calculation'
import { useStore } from 'vuex'
import { getTradeExchangeRate } from '@/api/fund'
import { useAssets } from '@/hooks/assets'

export default function useTradeCalculation () {
    const store = useStore()
    const account = useAssets()
    const activeProduct = computed(() => store.getters.productActived)
    const contractSize = activeProduct.value.contractSize
    const baseCurrency = activeProduct.value.baseCurrency
    const accountCurrency = account.value?.currency

    const state = reactive({
        loading: false
    })

    /**
     * 根据手数和杠杆计算所需保证金
     * @param {number} volume - 交易手数
     * @param {number} leverage - 交易杠杆
     * @returns {Promise<number>} - 计算的交易价值
     */
    const calculateTradeValue = async (volume, leverage) => {
        state.loading = true
        try {
            const baseToUsdRate = await getTradeExchangeRate({
                targetCurrency: baseCurrency,
                sourceCurrency: 'USD'
            })
            console.log('基础货币兑美元汇率:', baseToUsdRate)

            const usdToAccountRate = await getTradeExchangeRate({
                targetCurrency: 'USD',
                sourceCurrency: accountCurrency
            })
            console.log('美元兑账户货币汇率:', usdToAccountRate)

            const baseToUsdFormula = baseToUsdRate.formulaSymbol === 'multiply' ? mul : div
            const usdToAccountFormula = usdToAccountRate.formulaSymbol === 'multiply' ? mul : div

            const tradeValue = usdToAccountFormula(
                baseToUsdFormula(
                    mul(mul(volume, contractSize), div(1, leverage)),
                    baseToUsdRate.rate
                ),
                usdToAccountRate.rate
            )

            return tradeValue
        } catch (error) {
            console.error('计算交易价值时出错:', error)
            throw new Error(error)
        } finally {
            state.loading = false
        }
    }

    /**
     * 根据提供的保证金和杠杆计算交易手数
     * 手数*合约大小*（1/杠杆）*基础货币兑美元汇率*美元兑账户货币汇率
     * @param {number} margin - 保证金金额
     * @param {number} leverage - 交易杠杆
     * @returns {Promise<number>} - 计算的交易手数
     */
    const calculateVolumeFromMargin = async (margin, leverage) => {
        state.loading = true
        try {
            const baseToUsdRate = await getTradeExchangeRate({
                targetCurrency: baseCurrency,
                sourceCurrency: 'USD'
            })
            console.log('基础货币兑美元汇率:', baseToUsdRate)

            const usdToAccountRate = await getTradeExchangeRate({
                targetCurrency: 'USD',
                sourceCurrency: accountCurrency
            })
            console.log('美元兑账户货币汇率:', usdToAccountRate)

            const baseToUsdFormula = baseToUsdRate.data.formulaSymbol === 'multiply' ? div : mul
            const usdToAccountFormula = usdToAccountRate.data.formulaSymbol === 'multiply' ? div : mul

            const volume = usdToAccountFormula(
                baseToUsdFormula(
                    div(div(margin, contractSize), div(1, leverage)),
                    baseToUsdRate.data.rate
                ),
                usdToAccountRate.data.rate
            )

            return volume
        } catch (error) {
            throw new Error(error)
        } finally {
            state.loading = false
        }
    }

    return {
        calculateTradeValue,
        calculateVolumeFromMargin,
        ...toRefs(state)
    }
}
