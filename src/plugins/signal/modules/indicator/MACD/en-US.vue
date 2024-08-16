<template>
    <div class='indicator'>
        <section>
            <h4>What is MACD</h4>
            <p>MACD (English: Moving Average Convergence / Divergence, abbreviation: MACD), exponential moving average is a trend-following momentum indicator proposed by Geral Appel in 1979. MACD usually consists of three components. MACD line is fast The exponential moving average (generally 12 days) minus the slow exponential moving average (generally 26 days), generally called the difference value (DIF). The second line is the signal line, which is the exponential moving average of DIF (Generally take 9 days), generally called DEA. The last component is the MACD histogram, and its value is the difference between DIF and DEA. However, the time value of the MACD indicator can also be selected according to the trader's preference and trade categories to adjust.</p>
            <img src='/images/signal/indicator/macd1.png' />
        </section>
        <section>
            <h4>Indicator Features</h4>
            <p>• Trend indicators, whose main feature is robustness </p>
            <p>• Good forward-looking, most of the indicators are synchronized with the stock price or index, and some even lag behind the operation of the stock price, and MACD is a forward-looking and predictive indicator among various technical indicators One of the best indicators of sex</p>
            <p>• High accuracy rate: the indicator design is relatively delicate, the calculation is relatively complicated, and the main force is relatively difficult to manipulate and cheat, so the accuracy rate is relatively high</p>
        </section>
        <section>
            <h4>Usage of MACD</h4>
            <h5>Aolden fork</h5>
            <p>In MACD analysis, when the DIF line crosses from below to above the DEA line, it is called a golden cross, which may be a bullish signal.</p>
            <img src='/images/signal/indicator/macd2.png' />
            <h5>Death Cross</h5>
            <p>In MACD analysis, when the DIF line crosses from above to below the DEA line, it can be a bearish signal.</p>
            <img src='/images/signal/indicator/macd3.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
