<template>
    <div class='indicator'>
        <section>
            <h4>什麼是MACD</h4>
            <p>MACD（（英語：Moving Average Convergence / Divergence，縮寫：MACD），指數平滑異同移動平均線是由Geral Appel在1979年提出的一種趨勢跟踪的動量指標。 MACD通常由三個組成部分。 MACD線是快速指數移動平均值（一般取12日）減去慢速指數移動平均值（一般取26日），一般稱為差離值（DIF）。第二條線是信號線，是DIF的指數移動平均值（一般取9日），一般稱為DEA。最後一個組成部分是MACD柱狀圖，它的值是DIF和DEA之間的差值。然而，MACD指標的時間取值也可以根據交易者的偏好和交易品類來調整。</p>
            <img src='/images/signal/indicator/macd1.png' />
        </section>
        <section>
            <h4>指標特點</h4>
            <p>• 趨勢性指標，其主要特點是穩健性  </p>
            <p>• 前瞻性好，大部分的指標都是和股價或者指數同步運行的，有的甚至落後於股價的運行，而MACD是各種技術指標中前瞻性、預測性最好的指標之一</p>
            <p>• 準確率高：指標設計比較精巧，計算比較複雜，主力操縱、作假的難度相對較大，因此準確率也相對較高</p>
        </section>
        <section>
            <h4>MACD的用法</h4>
            <h5>金叉</h5>
            <p>在MACD分析中，當DIF線從下方穿越到DEA線上方叫金叉，這可能是一個看漲信號</p>
            <img src='/images/signal/indicator/macd2.png' />
            <h5>死叉</h5>
            <p>在MACD分析中，當DIF線從上方穿越到DEA線下方時，這可能是一個看跌信號</p>
            <img src='/images/signal/indicator/macd3.png' />
        </section>
    </div>
</template>

<style lang="scss" scoped>
@import '@/plugins/signal/style/indicator.scss';
</style>
