<template>
    <div class='layout1'>
        <div class='title'>
            <h1 class='heading'>
                The FOMC Meeting and Your Trading Strategy
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
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/us_dollar.jpg' />
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
                                    FOMC decisions can have a significant impact on currency markets, particularly in relation to the US dollar. When interest rates rise, it can make US assets more attractive to foreign investors, which can lead to an increase in demand for US dollars and a strengthening of the currency.
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
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/Forex-vs-stocks.jpg' />
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
                                <p>Forex trading is also sensitive to changes in interest rates and can be affected by FOMC decisions. When interest rates rise, it can lead to an increase in the value of the currency of the country with higher interest rates, which can make it more expensive to import goods and potentially hurt exports.</p>
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
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/bitcoin.jpg' />
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
                                <p>Although cryptocurrencies are not directly tied to FOMC decisions, they can still be indirectly affected by interest rates and the economic environment. Changes in interest rates can impact inflation, economic growth, and investor sentiment, which can in turn impact the value of cryptocurrencies.</p>
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
                                <img alt='Silicon Valley Bank' class='layoutImg' src='../../../images/cpi1/metal_gold.jpg' />
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
                                <p>FOMC decisions can also have an impact on commodity prices, particularly those that are priced in US dollars such as oil and gold. When interest rates rise, it can lead to a strengthening of the US dollar, which can make commodities more expensive for foreign buyers and potentially lead to a decrease in demand.</p>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { h, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name: 'Cpi1',
    components: {
        ElMessage,
        ElMessageBox,
    },
    setup () {
        const open = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('span', null, 'Central banks use inflation to determine their monetary policies and may raise interest rates to control inflationary pressures. Therefore, traders closely monitor CPI as it can provide signals about future monetary policy decisions and ultimately affect investments. When CPI data is released, it can cause fluctuations in the forex and gold markets, requiring a deeper understanding to make informed investment decisions. Headline.net will provide comprehensive information on the importance of CPI data, how to analyze it, its impact on markets, and how to use it for trading strategies.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open1 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('p', null, 'Headline offers traders a three-step process to win big in global markets. '),
                    h('br', null,),
                    h('p', null, '1.	Headline provides faster information on key financial events, making it easier for traders to find the events that interest them.'),
                    h('br', null,),
                    h('p', null, '2.	Headline lists the assets related to these events, simplifying the filter and analysis process for traders.'),
                    h('br', null,),
                    h('p', null, '3.	Traders can take a position for trading by entering the market at a price they believe represents the likelihood the event will happen.'),
                    h('br', null,),
                    h('p', null, 'With Headline, traders can simplify their trading process and increase their chances of success in global markets.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const open3 = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('p', null, "In addition to providing timely information on key financial events, Headline also offers tools and resources to help traders make informed investment decisions. With access to up-to-date market data and customizable watchlists, traders can analyze market trends and identify potential trading opportunities more effectively. By combining Headline's information and tools with a solid understanding of market fundamentals, traders can increase their chances of success and achieve their investment goals. With Headline, traders can stay ahead of the curve and capitalize on big events in the global markets."),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
        }
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/infoDetail?id=11086')
                    break
            }
        }
        return {
            open,
            open1,
            open3,
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
    color: #fff;
    font-size: 40px;
    font-weight: 400;
  }
}
.heading{
  font-size: 50px;
  font-weight: 500;
  color: #fff;
}
.row{
  justify-content: center;
  padding-top: 30px;
}

.col{
  background: RGB(236, 228, 232);
  text-align: center;
  min-height: 353px !important;
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
