<template>
    <router-view />
    <div>
        <banner />
        <div class='part2'>
            <el-row>
                <el-col :offset='4' :span='14'>
                    <h1 class='prize' style='font-size: 36px; padding-bottom: 10px;'>
                        To Win The Prize
                    </h1>
                    <p class='info'>
                        Join our trading competition from April 12th to April 26th, the account with the highest profit from trading EUR/USD during this period will receive an additional bonus of $5,000.
                    </p>
                    <p class='info'>
                        Use your trading skills to beat the performance of other traders from all over the world and trade your way to the top to receive cash prize!
                    </p>
                    <p class='info'>
                        The cash prize is fully withdrawable and is added into the winners' live account.
                    </p>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            Start Now
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter='20'>
            <el-col :offset='4' :span='14'>
                <div class='part3'>
                    <h1 class='heading'>
                        Consumer Price Index vs Gold Price
                    </h1>
                    <div class='container'>
                        <h2 class='title'>
                            What is Consumer Price Index (CPI)?
                        </h2>
                        <p class='text'>
                            The CPI, or Consumer Price Index is a gauge of the monthly fluctuations in the costs paid by American consumers. The Bureau of Labor Statistics determines the CPI by computing a weighted mean of prices for a collection of commodities and services that reflect the total expenses of U.S. consumers. This index is widely used to monitor trends in inflation and deflation. Although the CPI report adopts a distinct survey technique, price samples, and index weights from the PPI, or producer price index, the latter evaluates variations in the prices received by U.S. manufactures of goods and services.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            The Formula of Calculating the Consumer Price Index
                        </h2>
                        <p class='text'>
                            CPI = (Cost of market basket in a given year / Cost of market basket in base year) * 100
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            The Changes in the CPI Data Can Have a Significant Impact to the Economy
                        </h2>
                        <p class='text'>
                            When the CPI of an economy is on the rise, it tends to discourage consumers from saving and reduces their purchasing power, leading to a contraction in spending. In such an environment, central banks may increase benchmark interest rates in an effort to combat inflationary pressures. It will lead to a reduction in borrowing for expansion purposes, as businesses seek to avoid high borrowing costs.
                        </p>
                        <p class='text'>
                            Conversely, a declining CPI, which is typical of deflationary periods, tends to signal an economic slowdown in a country. During such periods, central banks may lower benchmark interest rates in order to reduce borrowing costs and stimulate lending. This can help to encourage consumer spending and investment in the economy, potentially spurring growth.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            US Annual Inflation Fell in February
                        </h2>
                        <p class='text'>
                            The Consumer Price Index started to decrease from 6.4% to 6% in the last 12 months (until late February), continuing a 8 months trend of decreasing annual inflation.
                        </p>
                        <div class='index'>
                            <img alt='Trading Index' class='index' src='../../images/cpi1/tradingIndex.jpg' />
                        </div>
                        <p class='source'>
                            Source: US Bureau of Labor StatisticsGraphic: Matt Stiles, CNN
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            A Close Relationship Between CPI and Gold
                        </h2>
                        <p class='text'>
                            Gold is commonly believed to serve as a hedge against inflation, as investors often turn to gold bullion s a way to protect themselves from potential future inflation. If the theory is true, one could potentially profit from buying gold as soon as signs of increased consumer prices emerge.
                        </p>
                        <p class='text'>
                            However, while gold has proven to be an effective hedge against inflation over extended periods (for example, from 1895 to 1999, the real value of gold remained relatively constant), its effectiveness as a hedge in the short and medium term is somewhat controversial. For instance, during the “medium-term” period of 1980 to 2001, the price of gold, adjusted for CPI, decreased by over 80%.
                        </p>
                    </div>

                    <div class='container'>
                        <h2 class='title'>
                            Why Invest In Gold To Protect Yourself Against Inflation
                        </h2>
                        <p class='text'>
                            Investing in gold is often touted as a wise move for protecting yourself against inflation. However, when everyone starts thinking and acting in the same way, rationalizations can quickly become excuses for all types of madness. Moreover, the relationship between gold and inflation may not be as strong as commonly believed. Although gold has experienced a bull run throughout the 2000s, fueled by the easy money policies of central banks around the world, inflation has remained relatively subdued in the U.S. and elsewhere since Paul Volker’s decisive leadership renewed public confidence in the Federal Reserve’s commitment to controlling price pressures. The median value of year-end inflation statistics over the past 30 years is a mere 3.2%, which, while above the Federal Reserve’s target, is not necessarily a sign of failure. This number is skewed towards the higher side due to the very high numbers seen in the 1980s.
                        </p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import banner from './components/tradingCompetition.vue'
export default {
    name: 'PrizeWinner',
    components: {
        banner,
    },
    setup (props) {
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

.part2{
  background-color: #7D1718;
  color: #fff;
  padding: 50px 0px;
  font-weight: 400;
  .prize{
    font-weight: 400;
    font-size: 40px;
  }
  .info{
    font-size: 22px;
    padding-top: 10px;
  }
  .part2Button{
    padding-top: 20px;
  }
}

.part3{
  padding: 50px 0;
  .heading{
    font-size: 50px;
    font-weight: 600;
  }
  .container{
    .title{
      font-size: 28px;
      text-decoration: underline;
      padding-top: 40px;
    }
    .text{
      font-size: 18px;
      padding-top: 10px
    }
    .index{
      text-align: center;
      padding-top: 20px;
      width: 100%;
      min-width: 350px;
    }
  }
}
.startNow{
  border: 1px solid #BB2423;
  background-color: #fff !important;
  color: #BB2423 !important;
  border-radius: unset !important;
  width: 200px;
  height: 50px;
  font-size: 20px;
}
.startNow:hover{
  color: #fff !important;
  background-color: #BB2423 !important;
}

</style>
