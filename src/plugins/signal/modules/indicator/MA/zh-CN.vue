<template>
    <div class='indicator'>
        <section>
            <h4>什么是MA</h4>
            <p>MA指标是英文(Moving average)的简写，叫移动平均线指标，由著名的美国投资专家Joseph E.Granville（葛兰碧，又译为格兰威尔）于20世纪中期提出来的。移动平均线利用统计学上移动平均的原理，将一定期间内的股价相加并加以平均，得出一个平均值，然后将其连接取得之平均线，即为移动平均线。</p>
        </section>
        <section>
            <h4>指标特点</h4>
            <p>• 平稳：不会像日线大起大落，通常是缓慢的升降。</p>
            <p>• 安定：MA通常在涨势明显后才会向上延伸；股价明显下降后才开始走下坡。但是，安定性越强，相对的，反应也较迟钝。</p>
            <p>• 趋势：可以反应股价走向，具有趋势性质。</p>
            <p>• 助涨助跌：当股价由下向上突破MA，MA则变为短期支撑线，当股价回跌至MA附近时，为买进时机。此为MA助涨的作用。反之，若向下突破，MA即有助跌的作用。</p>
        </section>
        <section>
            <h4>MA的用法</h4>
            <h5>金叉</h5>
            <p>一般来说，当移动平均线20MA向上突破60MA的时候，被称为是黄金交叉，表示短期内可能会上涨、有波段涨幅，适合多单进场或是空单出场。</p>
            <h5>死叉</h5>
            <p>当移动平均线20MA跌破60MA的时候，被视为死亡交叉，表示短期内可能会下跌、有波段跌幅，适合空单进场或是多单出场。</p>
            <img src='/images/signal/indicator/MA.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
