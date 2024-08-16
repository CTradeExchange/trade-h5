<template>
    <div class='win'>
        <div class='winPart1'>
            <h1 class='title'>
                Ready to Profit from the FED FOMC Conference?
            </h1>
            <el-row class='row1'>
                <el-col :span='4'>
                    <p class='infoTitle'>
                        Release Date
                    </p>
                    <p class='info'>
                        03/05
                    </p>
                </el-col>
                <el-col class='colInfo' :span='4'>
                    <p class='infoTitle'>
                        Actual
                    </p>
                    <img alt='money' class='money' src='../../../images/cpi1/money.png' />
                </el-col>
                <el-col :span='4'>
                    <p class='infoTitle'>
                        Forecast
                    </p>
                    <p class='info'>
                        5.25%
                    </p>
                </el-col>
                <el-col :span='4'>
                    <p class='infoTitle'>
                        Previous
                    </p>
                    <p class='info'>
                        5%
                    </p>
                </el-col>
            </el-row>
            <div class='textBackground'>
                <el-row>
                    <el-col
                        :lg='4'
                        :md='4'
                        :sm='4'
                        style='justify-content: center;'
                        :xl='4'
                        :xs='4'
                    >
                        <img alt='box' class='box' src='../../../images/cpi1/landingPage/magic.png' />
                    </el-col>
                    <el-col
                        :lg='16'
                        :md='16'
                        :sm='16'
                        :xl='16'
                        :xs='16'
                    >
                        <p>Traders care about the FED FOMC conference because it provides insights into the monetary policy decisions of the Federal Reserve, which can have a significant impact on financial markets.</p>
                        <p class='secondText'>
                            The decisions made during the conference can affect interest rates, inflation, and overall economic conditions, all of which can impact the profitability of trading positions.
                        </p>
                    </el-col>
                </el-row>
            </div>
            <el-row style='position: relative; justify-content: center; top: 60px;'>
                <el-col :span='6'>
                    <img alt='news' class='newsImg' src='../../../images/cpi1/landingPage/img1.png' />
                </el-col>
                <el-col :span='6'>
                    <img alt='news' class='newsImg' src='../../../images/cpi1/landingPage/img2.jpg' />
                </el-col>
                <el-col :span='6'>
                    <img alt='news' class='newsImg' src='../../../images/cpi1/landingPage/img3.jpeg' />
                </el-col>
            </el-row>
        </div>
        <div class='container'>
            <h1 class='title'>
                How to Join The Contest
            </h1>
            <el-row class='row2'>
                <el-col
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <span class='number color1'>
                        01
                    </span>
                    <div class='content'>
                        <p>Register to get</p>
                        <p>free $50 bonus</p>
                    </div>
                </el-col>
                <el-col
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <span class='number color2'>
                        02
                    </span>
                    <div class='content'>
                        <p>Follow on FED' move </p>
                        <p>and Headline's insight</p>
                    </div>
                </el-col>
                <el-col
                    :lg='6'
                    :md='6'
                    :sm='6'
                    :xl='6'
                    :xs='6'
                >
                    <span class='number color3'>
                        03
                    </span>
                    <div class='content'>
                        <p>Trade on the related</p>
                        <p>instruments and win big</p>
                    </div>
                </el-col>
            </el-row>
            <el-button class='signUp' plain text @click='jumpPage(1)'>
                Register
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Win',
    components: {
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
.win{
  background: #fff;
  .winPart1{
    background: rgb(22, 22, 63);
    padding: 80px 0 0;

      .title{
        text-align: center;
        color: #fff;
        font-size: 36px;
      }
      .row1{
        justify-content: center;
        color: #fff;
        padding: 40px 0;

        p{
          text-align: center;
        }
        .infoTitle{
          font-size: 22px;
        }
        .info{
          font-size: 80px;
        }
        .colInfo{
          justify-content: center;
          display: grid;
        }
        .imgRow{
          position: relative;
          justify-content: center;
          top: 60px;
        }
      }
      .textBackground{
        background: rgb(126, 14, 34);
        justify-content: center;
        display: grid;
      p{
        font-size: 18px;
        color: #fff;
        padding-top: 30px;
        max-width: 1000px;
      }
      .secondText{
        padding-bottom: 20px;
      }
    }
  }
  .container{
    font-size:32px;
    text-align: center;
    padding: 100px 0 40px;

    .row2{
      justify-content: center;
      .number{
        color: #FFEAE8;
        line-height: normal;
        font-size: 176px;
        font-weight: bold;
      }
      .content{
        position: absolute;
        top: 50px;
        padding-left: 190px;
        z-index: 999;
        text-align: start;
      }
    }
    .signUp{
      background-color: #BB2423 !important;
      color: #fff;
      border-radius: unset !important;
    }
    .signUp:hover{
      background-color: #fff !important;
      border: 1px solid #BB2423;
      color:#BB2423
    }
  }
}
.money{
  width: 92px;
}
.newsImg{
  height: 300px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.box{
  width: 50px;
  filter: invert(100%) sepia(100%) saturate(8%) hue-rotate(190deg) brightness(102%) contrast(106%);
}
</style>
