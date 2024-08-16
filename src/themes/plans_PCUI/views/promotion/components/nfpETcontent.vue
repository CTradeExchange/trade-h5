<template>
    <div class='layout1'>
        <div class='title'>
            <h1 class='heading'>
                The Non-FarmPayroll and Your Trading Strategy
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
                                    The US Non-Farm Payroll (NFP) report is a key economic indicator that measures the number of jobs added or lost in the US economy, excluding the farming sector. A strong NFP report, indicating a high number of job additions, typically boosts investor confidence in the US economy. This can lead to an increased demand for the US dollar, as investors anticipate higher interest rates and a stronger economy. Consequently, the value of the US dollar may appreciate against other currencies in the forex market.
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
                                <p>The US Non-Farm Payroll data has a significant impact on the forex market. Currency pairs involving the US dollar, such as EUR/USD or USD/JPY, often experience heightened volatility during the release of the NFP report. If the NFP data exceeds expectations, suggesting robust job growth, it may lead to an immediate strengthening of the US dollar. Conversely, weaker-than-expected NFP figures can result in a decline in the value of the US dollar. Forex traders closely monitor NFP releases to gauge potential currency fluctuations and adjust their trading strategies accordingly.</p>
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
                                <p>The US Non-Farm Payroll report can influence the cryptocurrency market, although the relationship is not as direct as with traditional currencies. Cryptocurrencies like Bitcoin and Ethereum are often viewed as alternative investment assets that are influenced by broader market sentiments. Positive NFP data, indicating a healthy US economy, may boost investor confidence and increase the appetite for riskier assets like cryptocurrencies. As a result, cryptocurrencies could experience increased demand and potentially rise in value. However, it's important to note that cryptocurrency markets are also influenced by various other factors and can exhibit high volatility unrelated to traditional economic indicators.</p>
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
                                <p>The US Non-Farm Payroll report can have implications for commodity markets. A strong NFP report, indicating a thriving labor market and potential economic growth, can drive up demand for commodities such as oil, metals, and agricultural products. This increased demand stems from the expectation of higher consumer spending and industrial activity. Consequently, commodity prices may rise as market participants anticipate higher consumption levels. Conversely, weaker-than-expected NFP figures could dampen demand expectations, leading to potential declines in commodity prices. Traders and investors in commodity markets pay attention to the NFP report as part of their fundamental analysis when making trading decisions.</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class='signUpButton'>
            <el-button class='signUp lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                <p class='signUp lp_btn lp_btn_register'>
                    Register
                </p>
            </el-button>
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
                    window.open('https://www.headline.net/en-US/register')
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

.signUpButton{
  padding: 30px 0;
}
.signUp{
  background-color: #000 !important;
  color: #fff;
  border-radius: unset !important;
  width: 300px;
  height: 50px;
  border: unset !important;
  font-size: 18px;
}
.signUp:hover{
  background-color: #fff !important;
  color:#000;
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
}
</style>
