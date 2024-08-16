<template>
    <div class='indicator'>
        <section>
            <h4>什麼是MA</h4>
            <p>MA指標是英文(Moving average)的簡寫，叫移動平均線指標，由著名的美國投資專家Joseph E.Granville（葛蘭碧，又譯為格蘭威爾）於20世紀中期提出來的。移動平均線利用統計學上移動平均的原理，將一定期間內的股價相加並加以平均，得出一個平均值，然後將其連接取得之平均線，即為移動平均線。</p>
        </section>
        <section>
            <h4>指標特點</h4>
            <p>• 平穩：不會像日線大起大落，通常是緩慢的升降。</p>
            <p>• 安定：MA通常在涨势明显后才会向上延伸；股价明显下降后才开始走下坡。但是，安定性越强，相对的，反应也较迟钝。</p>
            <p>• 趋势：可以反应股价走向，具有趋势性质。</p>
            <p>• 助漲助跌：當股價由下向上突破MA，MA則變為短期支撐線，當股價回跌至MA附近時，為買進時機。此為MA助漲的作用。反之，若向下突破，MA即有助跌的作用。</p>
        </section>
        <section>
            <h4>MA的用法</h4>
            <h5>金叉</h5>
            <p>一般來說，當移動平均線20MA向上突破60MA的時候，被稱為是黃金交叉，表示短期內可能會上漲、有波段漲幅，適合多單進場或是空單出場。</p>
            <h5>死叉</h5>
            <p>當移動平均線20MA跌破60MA的時候，被視為死亡交叉，表示短期內可能會下跌、有波段跌幅，適合空單進場或是多單出場。</p>
            <img src='/images/signal/indicator/MA.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
