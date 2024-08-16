import { formatAmount, divide, mul, } from '@/utils/calculation'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useAssets } from '../assets'

export default function () {
    const store = useStore()
    const product = computed(() => store.getters.productActived)
    // 钱包资产信息
    const assetsInfo = useAssets()
    /** 是否按量下单 */
    const isQuantity = computed(() => {
        return store.state._trade.entryType === 1
    })

    /**
         * 处理逐仓合约盘口数据
         * - 如果是按量下单
         *     盘口每一档接口返回的数量➗该产品的合约大小=数量（手）
         *     计算结果：小数位取的是手数小数位进行截取约位显示）
         *
         * - 如果是按额下单
         *     第1步，计算产品”盈利货币”的总额：盘口每一档接口返回的数量*盘口每一档接口返回价格=总额（盈亏货币）
         *     第2步，计算“账户货币”的总额：第一步得到的结果去找汇率接口计算【盈亏货币】兑换成【账户货币】的总额
         *     计算结果：小数位取的是资产小数位进行截取约位显示）
         */
    const formatVolume = (volume, price, digits) => {
        if (![1, 2].includes(product?.value?.tradeType) || volume === '--') return volume
        const tradeExchangeRate = store.state._trade.tradeExchangeRate
        if (store.state._trade.entryType === 1) {
            // 盘口每一档接口返回的数量➗该产品的合约大小=数量（手）
            // （计算结果：小数位取的是手数小数位进行截取约位显示）
            const contractSize = product.value.contractSize
            const numberDigits = product.value.numberDigits
            return formatAmount(divide(volume, contractSize), numberDigits)
        } else if (tradeExchangeRate) {
            // 盘口每一档接口返回的数量*盘口每一档接口返回价格=总额（盈亏货币）
            const total = mul(volume, price)
            // 计算“账户货币”的总额：第一步得到的结果去找汇率接口计算【盈亏货币】兑换成【账户货币】的总额
            const { rate, formulaSymbol } = tradeExchangeRate
            const calculate = formulaSymbol === 'divide' ? divide : mul
            return formatAmount(calculate(total, rate), digits || assetsInfo.value?.digits || 4)
        }

        return volume
    }

    return { formatVolume, isQuantity }
}
