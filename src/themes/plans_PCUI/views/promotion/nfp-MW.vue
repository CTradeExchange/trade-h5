<template>
    <router-view />
    <div id='nfp' class='nfp'>
        <topNav />
        <div class='container'>
            <el-row>
                <el-col
                    class='containerCol1'
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <h1 class='heading'>
                        How will U.S. Non-farm Payroll affect our money?
                    </h1>
                    <p>
                        <span class='content'>
                            Make a Prediction
                        </span>
                    </p>
                    <el-row>
                        <el-col
                            :lg='12'
                            :md='12'
                            :sm='12'
                            :xl='12'
                            :xs='12'
                        >
                            <el-button class='arrowButton lp_btn_home lp_btn' plain text @click='jumpPage(3)'>
                                <p class='arrowButton lp_btn_home lp_btn'>
                                    Up
                                </p>
                            </el-button>
                            <img alt='up' class='arrow' src='../../images/cpi1/nfp/up.jpg' />
                        </el-col>
                        <el-col
                            :lg='12'
                            :md='12'
                            :sm='12'
                            :xl='12'
                            :xs='12'
                        >
                            <el-button class='arrowButton lp_btn lp_btn_home' plain text @click='jumpPage(3)'>
                                <p class='arrowButton lp_btn lp_btn_home'>
                                    Down
                                </p>
                            </el-button>
                            <img alt='down' class='arrow' src='../../images/cpi1/nfp/down.jpg' />
                        </el-col>
                    </el-row>
                </el-col>
                <el-col
                    class='containerCol2'
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <img alt='banner1' class='banner1' src='../../images/cpi1/nfp/homeBannerMW.jpg' />
                </el-col>
            </el-row>
        </div>

        <div class='container2'>
            <el-row class='row2'>
                <el-col
                    class='container2Col1'
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <img alt='banner' class='banner' src='../../images/cpi1/nfp/NoKYC.jpg' />
                </el-col>
                <el-col
                    class='container2Col2'
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <h1 class='title'>
                        Crypto Trading
                    </h1>
                    <h1 class='title title2'>
                        No KYC
                    </h1>
                    <h1 class='title title2'>
                        Reliable CFD broker
                    </h1>
                    <div class='cardContainer'>
                        <el-card class='box-card'>
                            <h1 class='heading'>
                                Best Timing to trade with HEADLINE
                            </h1>
                        </el-card>
                    </div>
                    <el-button class='trade lp_btn_register lp_btn' plain text @click='jumpPage(1)'>
                        <p class='trade lp_btn_register lp_btn'>
                            To Trade
                        </p>
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <div class='container3'>
            <el-row style='justify-content: center;'>
                <el-col
                    :lg='15'
                    :md='16'
                    :sm='17'
                    :xl='14'
                    :xs='22'
                >
                    <h1 class='heading'>
                        Do you Know?
                    </h1>
                    <p class='content'>
                        NFP stands for Non-Farm Payrolls report, which is a monthly report released by the US Department of Labor, mainly covering the number of new jobs added in the non-farm sector and changes in the unemployment rate during the previous month.
                    </p>
                    <p class='content content2'>
                        As the US is one of the largest economies in the world, NFP has an important impact on the global economy. Here are several ways in which NFP may affect the global economy
                    </p>
                </el-col>
            </el-row>
        </div>

        <information />
        <userLayoutFooter />
    </div>
</template>

<script>
import information from './components/nfpMWcard.vue'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'Nfp',
    components: {
        topNav,
        userLayoutFooter,
        information,
    },
    setup (props) {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/register')
                    break
                case 2 :
                    window.open('https://t.me/Headline_admin')
                    break
                case 3 :
                    window.open('https://www.headline.net/en-US/home')
                    break
            }
        }

        return {
            jumpPage,
            open,
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';

.nfp{
  overflow-x: hidden;
}

.container{
  background-color: #fff;
  text-align: center;
  .containerCol1{
    padding: 50px 0;
    .heading{
      line-height: 1.25em;
      font-size: 72px;
    }
    .content{
      background-color: #BADA55;
      line-height: 1.38em;
      font-size: 28px;
      margin-top: 20px;
    }
    .arrowButton{
      background: #000;
      color: #fff;
      font-size: 20px;
      width: 274px;
      height: 47px;
      border-radius: unset !important;
      margin-top: 20px;
    }
    .arrowButton:hover{
      color: #000;
      background: unset !important;
      border: 1px solid #000;
    }
    .arrow{
      width: 100%;
      max-width: 340px;
      padding-top: 20px;
    }
  }
  .containerCol2{
    .banner1{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.container2{
  margin-top: 40px;
  .row2{
    border-top: 3px solid #000;
  }
  .container2Col1{
    .banner{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .container2Col2{
    background-color: rgb(255, 245, 240);
    text-align: center;
    align-content: center;
    justify-content: center;
    display: grid;
    place-items: center;
    padding: 30px 0;
    .title{
      font-size: 30px;
    }
    .title2{
      padding-top: 10px;
    }
    .cardContainer{
      background-color: #fff;
      margin-top: 50px;
    }
    .box-card{
      width: 430px;
      height: 174px;
      border-radius: unset !important;
      align-content: center;
      display: grid;
      margin: 10px;
      border: 1px solid #000;
      .heading{
        font-size: 28px;
        font-weight: 400;
      }
    }
    .trade{
      background: #000;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      width: 132px;
      height: 48px;
      border-radius: unset !important;
      position: relative;
      bottom: 33px;
    }
    .trade:hover{
      font-size: 20px;
    }
  }
}
.container3{
  padding: 50px 0;
  .heading{
  font-size: 56px;
  }
  .content{
    font-size: 18px;
  }
  .content2{
    padding-top: 20px;
  }
}

@media screen and (max-width: 1200px) {
  .arrowButton{
      width: 230px !important;
    }
}

@media screen and (max-width: 700px) {
  .container{
  .containerCol1{
    .heading{
      line-height: 1em;
      font-size: 50px !important;
    }
  }
}
}

@media screen and (max-width: 600px) {
  .arrowButton{
      width: 180px !important;
    }
  .container2Col2{
    .box-card{
      width: 350px ! important;
    }
  }
}

</style>
