<template>
    <div class='layout1'>
        <div class='title'>
            <h1 class='heading'>
                The G7 Summit and Your Trading Strategy
            </h1>
            <h2>What You Need to Know</h2>
        </div>
        <div class='cardContainer'>
            <el-row class='row' :gutter='30'>
                <el-col
                    :lg='10'
                    :md='12'
                    :sm='24'
                    :xl='8'
                    :xs='24'
                >
                    <div class='col'>
                        <el-row :gutter='10'>
                            <el-col
                                class='imgContainer'
                                :lg='10'
                                :md='12'
                                :sm='12'
                                :xl='10'
                                :xs='12'
                            >
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/g7-summit/currency.jpg' />
                            </el-col>
                            <el-col
                                class='reportTexting'
                                :lg='14'
                                :md='12'
                                :sm='12'
                                :xl='14'
                                :xs='12'
                            >
                                <h1 class='reportTitle'>
                                    Currency
                                </h1>
                                <p>
                                    G7 Summit decisions can have a significant impact on currency markets, particularly for currencies of the member countries. The summit can influence the monetary policies and exchange rates of these countries, which in turn can affect the global currency market. For example, if the G7 leaders announce a plan to stimulate economic growth, this could result in a stronger currency for the countries involved, as well as for other currencies that are closely linked to them.
                                </p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col
                    :lg='10'
                    :md='12'
                    :sm='24'
                    :xl='8'
                    :xs='24'
                >
                    <div class='col col2'>
                        <el-row :gutter='10'>
                            <el-col
                                class='imgContainer'
                                :lg='10'
                                :md='12'
                                :sm='12'
                                :xl='10'
                                :xs='12'
                            >
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/g7-summit/forex.jpg' />
                            </el-col>
                            <el-col
                                class='reportTexting'
                                :lg='14'
                                :md='12'
                                :sm='12'
                                :xl='14'
                                :xs='12'
                            >
                                <h1 class='reportTitle'>
                                    Forex
                                </h1>
                                <p>The G7 Summit decisions can also impact the forex market, as changes in monetary policies and exchange rates can lead to fluctuations in currency values. Traders in the forex market may closely monitor the decisions made at the summit to predict potential currency movements and adjust their trading strategies accordingly. For instance, if the G7 leaders announce measures to combat inflation, this could result in a strengthening of the respective country's currency, leading to potentially profitable forex trades for traders who have taken positions in anticipation of such a move.</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <el-row class='row' :gutter='30'>
                <el-col
                    :lg='10'
                    :md='12'
                    :sm='24'
                    :xl='8'
                    :xs='24'
                >
                    <div class='col'>
                        <el-row :gutter='10'>
                            <el-col
                                class='imgContainer'
                                :lg='10'
                                :md='12'
                                :sm='12'
                                :xl='10'
                                :xs='12'
                            >
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/g7-summit/cryptocurrencies.jpg' />
                            </el-col>
                            <el-col
                                class='reportTexting'
                                :lg='14'
                                :md='12'
                                :sm='12'
                                :xl='14'
                                :xs='12'
                            >
                                <h1 class='reportTitle'>
                                    Cryptocurrencies
                                </h1>
                                <p>G7 Summit decisions can also have an impact on cryptocurrencies. As cryptocurrency trading becomes more mainstream, regulators are increasingly looking to establish guidelines for their use. The G7 leaders may discuss issues such as taxation, regulation, and adoption of cryptocurrencies, which could have an impact on the value of these assets. For example, if the G7 countries agree on a common approach to regulate cryptocurrencies, this could provide more certainty to investors and potentially increase demand for these assets, leading to a rise in their value.</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col
                    :lg='10'
                    :md='12'
                    :sm='24'
                    :xl='8'
                    :xs='24'
                >
                    <div class='col col2'>
                        <el-row :gutter='10'>
                            <el-col
                                class='imgContainer'
                                :lg='10'
                                :md='12'
                                :sm='12'
                                :xl='10'
                                :xs='12'
                            >
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/g7-summit/commodities.jpg' />
                            </el-col>
                            <el-col
                                class='reportTexting'
                                :lg='14'
                                :md='12'
                                :sm='12'
                                :xl='14'
                                :xs='12'
                            >
                                <h1 class='reportTitle'>
                                    Commodities
                                </h1>
                                <p>G7 Summit decisions can also impact the commodity markets, particularly for commodities that are widely traded in the member countries. Changes in economic policies, trade agreements, and environmental regulations can have a significant impact on commodity prices. For example, if the G7 leaders announce plans to increase investment in renewable energy sources, this could lead to a decrease in demand for fossil fuels, potentially leading to a drop in oil prices. On the other hand, if the leaders announce measures to promote economic growth, this could lead to an increase in demand for commodities such as metals and energy, potentially leading to a rise in their prices.</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SummitCard',
    setup () {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/infoDetail?id=11086')
                    break
            }
        }
        return {
            jumpPage,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.layout1{
  text-align: center;
  padding-top: 30px;
  background-color: rgb(125,24,23);
  h2{
    font-size: 40px;
    font-weight: 400;
  }
}
.heading{
  font-size: 50px;
  font-weight: 500;
}
.row{
  justify-content: center;
  padding-top: 30px;
}

.col{
  background: RGB(236, 228, 232);
  text-align: center;
  min-height: 607px !important;
}
.layoutImg{
  width: 100%;
}

.buttonContainer{
  padding: 30px 0;
}
.readMore{
  background-color: #BB2423 !important;
  color: #fff;
  border-radius: unset !important;
}
.readMore:hover{
  background-color: #fff !important;
  border: 1px solid #BB2423;
  color:#BB2423
}
.reportTexting{
  align-self: center;
  text-align: left;
  padding: 20px 10px !important;
  p{
    color: #000;
    font-size: 18px;
    line-height: 1.75em;
  }
}
.reportTitle{
  font-size: 24px;
  color: #000;
}
.cardContainer{
  padding: 40px 0;
}

.title{
  padding-top: 60px;
}

@media screen and (max-width: 1560px) {
  .col{
    height: 400px;
  }
}
@media screen and (max-width: 1160px) {
  .col{
    height: 517px;
  }
}
@media screen and (max-width: 991px) {
  .cardContainer{
    padding: 0 0 40px;
  }
  h2{
    font-size: 25px;
  }
  .heading{
    font-size: 35px;
    .money{
      display: none;
    }
  }
  .row{
    padding-top: unset;
  }
  .col{
    margin-top: 50px;
    height: auto;
  }
  .imgContainer{
    align-self: center;
  }
}
</style>
