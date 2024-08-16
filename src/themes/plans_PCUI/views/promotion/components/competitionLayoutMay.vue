<template>
    <div class='layout1'>
        <el-row class='cardContainer' :gutter='12'>
            <el-col :span='12'>
                <el-card class='titleCard' shadow='always'>
                    <span class='redTitle'>
                        Federal Interest Rate
                    </span> <span class='greyTitle'>
                        Affects Global Markets
                    </span>
                </el-card>
            </el-col>
        </el-row>
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
                                <p>
                                    Investors tend to hold less gold if FED interest rate is higher. It may lead to decrease of gold price. Vice versa.
                                </p>
                            </el-col>
                        </el-row>
                        <div class='buttonContainer'>
                            <el-button class='readMore lp_btn' plain text @click='jumpPage(1)'>
                                <p class='readMore lp_btn'>
                                    Trade Gold
                                </p>
                            </el-button>
                        </div>
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
                                <p>Investors tend to hold more USD if FED interest rate is higher. It may lead to increase of USD value. Vice versa.</p>
                            </el-col>
                        </el-row>
                        <div class='buttonContainer'>
                            <el-button class='readMore lp_btn' plain text @click='jumpPage(2)'>
                                <p class='readMore lp_btn'>
                                    Trade Forex
                                </p>
                            </el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Cpi1',
    components: {
    },
    setup () {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/order?name=GOLD&symbolId=1419&tradeType=2')
                    break
                case 2 :
                    window.open('https://www.headline.net/en-US/order?name=EUR/USD&symbolId=1437&tradeType=2')
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
  .cardContainer{
    justify-content: center;
    .redTitle{
      text-decoration: underline;
      color: #D00B22;
    }
    .titleCard{
      font-size: 34px;
      font-weight: bold;
    }
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

@media screen and (max-width: 1622px) {
  .greyTitle{
    display: block;
  }
}
@media screen and (max-width: 991px) {
  .titleCard{
      font-size: 25px !important;
    }
  .heading{
    .money{
      display: none;
    }
  }
  .row{
    padding-top: unset;
  }
  .col{
    margin-top: 50px;
  }
}
</style>
