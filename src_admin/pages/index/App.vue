<template>
    <div id='app'>
        <router-view />
    </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

if (process.env.VUE_APP_h5Preview) {
    // 模拟家数据
    store.commit('_quote/add_products', [
        {
            symbolId: '1',
            symbolKey: '1_1',
            tradeType: '1'
        }
    ])
    store.commit('_quote/Update_product', {
        symbolDigits: 5,
        symbolId: 1,
        symbolName: '欧元美元',
        symbolCode: 'EURUSD',
        symbol_id: 1,
        tradeType: 1,
        buy_price: '1.12977',
        sell_price: '1.12945',
        buy_color: 'riseColor',
        sell_color: 'fallColor',
        cur_price: '1.23727',
        upDownWidth: '-1.0%',
        upDownColor: 'fallColor',
        price_digits: 5
    })
}

</script>

<style lang="scss">
</style>
