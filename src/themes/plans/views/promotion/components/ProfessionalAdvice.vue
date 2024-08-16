<template>
    <div class='advice'>
        <h1 class='proAdvice'>
            Professional advice
        </h1>
        <el-row class='row adviceRow' :gutter='30'>
            <el-col
                class='cardAdv'
                :lg='7'
                :md='8'
                :sm='8'
                :xl='6'
                :xs='24'
            >
                <img alt='klay' class='proImg' src='../../../images/cpi1/K.jpg' />
                <h2 class='proTitle'>
                    Klay Glazer, Financial advisor
                </h2>
                <p class='adviceContent'>
                    &quot;I rely on Headline.net to keep me informed and make smarter trading decisions. It's the reliable partner to my other tools, such as Magic Compass services, that have contributed to my successful trading over the past three years.&quot;
                </p>
            </el-col>
            <el-col
                class='cardAdv cardAdv2'
                :lg='7'
                :md='8'
                :sm='8'
                :xl='6'
                :xs='24'
            >
                <img alt='diana' class='proImg' src='../../../images/cpi1/Diana.png' />
                <h2 class='proTitle'>
                    Diana Fischer, Hedge fund manager
                </h2>
                <p class='adviceContent'>
                    &quot;Headline.net is an online platform that makes it easy to understand market trends quickly and accurately. You can get a clear picture of the current market conditions and make informed decisions on your investments.&quot;
                </p>
            </el-col>
            <el-col
                class='cardAdv cardAdv2'
                :lg='7'
                :md='8'
                :sm='8'
                :xl='6'
                :xs='24'
            >
                <img alt='paula' class='proImg' src='../../../images/cpi1/Paula.png' />
                <h2 class='proTitle'>
                    Paula D. Macht, Security analyst
                </h2>
                <p class='adviceContent'>
                    &quot;Maximize Your Profits with Headline Informing - the Ultimate Platform for Today's Trades Seeking Swift Decisions. In today's fast-paced world of trading, making quick decisions is key to success. That's why I turn to Headline.net to stay ahead of the game.&quot;
                </p>
            </el-col>
        </el-row>
    </div>
    <div class='partners'>
        <h1 class='partnersTitle'>
            Our Partners
        </h1>
        <el-row class='row partnersRow' :gutter='20'>
            <el-col
                class='col-logo'
                :lg='5'
                :md='6'
                :sm='8'
                :xl='4'
                :xs='24'
            >
                <img alt='Trading View' class='partnersLogo' src='../../../images/cpi1/TradingView.jpg' />
            </el-col>
            <el-col
                class='col-logo'
                :lg='5'
                :md='6'
                :sm='8'
                :xl='4'
                :xs='24'
            >
                <img alt='Magic Compass' class='partnersLogo' src='../../../images/cpi1/MagicCompass.jpg' />
            </el-col>
            <el-col
                class='col-logo'
                :lg='5'
                :md='6'
                :sm='8'
                :xl='4'
                :xs='24'
            >
                <img alt='Investing.com' class='partnersLogo' src='../../../images/cpi1/investing.jpg' />
            </el-col>
        </el-row>
    </div>
    <div class='banner'>
        <div class='center'>
            <h2>THE TOP TRADER WILL WALK AWAY WITH</h2>
            <h1 class='money'>
                $5000
            </h1>
            <h2>AS A RESULT OF CPI REPORT RELEASE</h2>
            <div class='bannerButton'>
                <el-button class='lp_btn' plain size='large' @click='jumpPage(1)'>
                    Get Started
                </el-button>
            </div>
        </div>
    </div>

    <div class='testimonials'>
        <h1 class='testimonialsTitle'>
            Testimonials
        </h1>
        <el-row class='row' :gutter='20'>
            <el-col
                :lg='6'
                :md='8'
                :sm='24'
                :xl='6'
                :xs='24'
            >
                <iframe
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowfullscreen
                    class='testimonialsYoutube'
                    frameborder='0'
                    src='https://www.youtube.com/embed/74GGgYn7bHM'
                    title='YouTube video player'
                ></iframe>
                <div class='detailsContainer'>
                    <h2 class='name'>
                        Laura, UK
                    </h2>
                    <h2 class='job'>
                        Financal journalism
                    </h2>
                </div>
            </el-col>
            <el-col
                class='youtube'
                :lg='6'
                :md='8'
                :sm='24'
                :xl='6'
                :xs='24'
            >
                <iframe
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowfullscreen
                    class='testimonialsYoutube'
                    frameborder='0'
                    src='https://www.youtube.com/embed/6s6H6Qabhp4'
                    title='YouTube video player'
                ></iframe>
                <div class='detailsContainer'>
                    <h2 class='name'>
                        Ron, USA
                    </h2>
                    <h2 class='job'>
                        Retired school teacher
                    </h2>
                </div>
            </el-col>
            <el-col
                class='youtube'
                :lg='6'
                :md='8'
                :sm='24'
                :xl='6'
                :xs='24'
            >
                <iframe
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowfullscreen
                    class='testimonialsYoutube'
                    frameborder='0'
                    src='https://www.youtube.com/embed/bHg-vHN-UNY'
                    title='YouTube video player'
                ></iframe>
                <div class='detailsContainer'>
                    <h2 class='name'>
                        Brigitte, Germany
                    </h2>
                    <h2 class='job'>
                        Housewife
                    </h2>
                </div>
            </el-col>
        </el-row>
        <div class='testimonialsButton'>
            <el-button class='lp_btn lp_btn_register' plain size='large' @click='jumpPage(2)'>
                Register
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PA',
    components: {
    },
    setup () {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/order?name=EUR/USD&symbolId=1437&tradeType=2')
                    break
                case 2 :
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
.advice{
  text-align: center;
  margin: 30px 0;
  background: #E8E6E6;
}
.proImg{
  width: 100%;
}
.proAdvice{
    font-size: 36px;
    font-weight: 800;
    padding: 30px 0;
}
.adviceRow{
  padding-bottom: 50px;
}
.proTitle{
  padding-top: 10px;
}
.adviceContent{
  padding-top: 20px
}
.row{
  justify-content: center;
}
.partners{
  text-align: center;
  padding: 40px 0;
  .partnersTitle{
    font-size: 40px;
    font-weight: 800;
  }
  .partnersLogo{
    width: 100%;
  }
  .col-logo{
  align-self: center;
  }
}
.banner {
  background-image: url("../../../images/cpi1/Banner.jpg");
  width: 100%;
  text-align: center;
  background-repeat:no-repeat;
  background-position: center center;
  margin: 30px 0 50px;
  .center {
  color: #fff;
  padding: 50px 0;
    .money{
      font-size: 100px;
    }
    .bannerButton{
      padding-top: 40px;
    }
  }
}

.el-button{
  background-color: #BB2423;
  color: #fff;
  border-radius: unset !important;
  border: unset;
  width: 140px;
}
.el-button:hover{
  background-color: #fff;
  color:#BB2423;
  border: 1px solid #BB2423;
}

.testimonials{
  text-align: center;
  .testimonialsTitle{
    padding-bottom: 20px;
    font-size: 36px;
    font-weight: 800;
  }
  .testimonialsYoutube{
    width: 100%;
    aspect-ratio: 16 / 9;
  }
  .detailsContainer{
    padding: 20px 0;
    .name{
      font-size: 26px;
    }
  }
  .testimonialsButton{
    padding: 30px 0 60px;
  }
}

@media screen and (max-width: 991px) {
  .youtube{
    padding-top: 50px;
  }
}

@media screen and (max-width: 767px) {
  .cardAdv{
    padding: 0 30px !important;
  }
  .cardAdv2{
    margin-top: 30px !important;
  }
  .money{
    font-size: 60px !important;
  }
  .partnersRow{
    padding-top: 50px;
    .partnersLogo{
      width: 250px !important;
    }
  }

}
</style>
