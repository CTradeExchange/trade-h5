<template>
    <div class='indicator'>
        <section>
            <h4>什么是MACD</h4>
            <p>MACD（（英语：Moving Average Convergence / Divergence，缩写：MACD），指数平滑异同移动平均线是由Geral Appel在1979年提出的一种趋势跟踪的动量指标。</p>
            <p>MACD通常由三个组成部分。MACD线是快速指数移动平均值（一般取12日）减去慢速指数移动平均值（一般取26日），一般称为差离值（DIF）。第二条线是信号线，是DIF的指数移动平均值（一般取9日），一般称为DEA。最后一个组成部分是MACD柱状图，它的值是DIF和DEA之间的差值。然而，MACD指标的时间取值也可以根据交易者的偏好和交易品类来调整</p>
            <img src='/images/signal/indicator/macd1.png' />
        </section>
        <section>
            <h4>指标特点</h4>
            <p>• 趋势性指标，其主要特点是稳健性</p>
            <p>• 前瞻性好，大部分的指标都是和股价或者指数同步运行的，有的甚至落后于股价的运行，而MACD是各种技术指标中前瞻性、预测性最好的指标之一</p>
            <p>• 准确率高：指标设计比较精巧，计算比较复杂，主力操纵、作假的难度相对较大，因此准确率也相对较高</p>
        </section>
        <section>
            <h4>MACD的用法</h4>
            <h5>金叉</h5>
            <p>在MACD分析中，当DIF线从下方穿越到DEA线上方叫金叉，这可能是一个看涨信号</p>
            <img src='/images/signal/indicator/macd2.png' />
            <h5>死叉</h5>
            <p>在MACD分析中，当DIF线从上方穿越到DEA线下方时，这可能是一个看跌信号</p>
            <img src='/images/signal/indicator/macd3.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
