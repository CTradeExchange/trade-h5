<template>
    <div class='partners'>
        <div class='tradeCrypto'>
            <h1>What Can You Trade?</h1>
            <p>
                As an event-driven trading platform, we hope traders can make informed trading decisions and seize all the important trading opportunities. Therefore, <span class='underline'>
                    Headline.net
                </span> provides multiple financial instruments in the global markets and the variety will become more and more.
            </p>
            <div>
                <el-row :gutter='20'>
                    <el-col :span='6'>
                        <img alt='Investing.com' class='partnersLogo' src='../../../images/cpi1/investing.jpg' />
                        <div class='part1Button'>
                            <el-button class='detailsButton lp_btn' plain @click='jumpPage(1)'>
                                Forex
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span='6'>
                        <img alt='Investing.com' class='partnersLogo' src='../../../images/cpi1/investing.jpg' />
                        <div class='part1Button'>
                            <el-button class='detailsButton lp_btn' plain @click='jumpPage(1)'>
                                Commodities
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span='6'>
                        <img alt='Investing.com' class='partnersLogo' src='../../../images/cpi1/investing.jpg' />
                        <div class='part1Button'>
                            <el-button class='detailsButton lp_btn' plain @click='jumpPage(1)'>
                                Crypto
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span='6'>
                        <img alt='Investing.com' class='partnersLogo' src='../../../images/cpi1/investing.jpg' />
                        <div class='part1Button'>
                            <el-button class='detailsButton lp_btn' plain @click='jumpPage(1)'>
                                Indices
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
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
  padding: 50px 0;
  .partnersTitle{
    font-size: 56px;
    font-weight: bold;
    color:#BB2423;
  }
  .partnersLogo{
    width: 100%;
    padding-top: 30px;
  }
  .col-logo{
  align-self: center;
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
}

.testimonials{
  text-align: center;
  background-color: rgb(0,0,0);
  color: #fff;
  .testimonialsTitle{
    padding: 20px 0;
    font-size: 56px;
    font-weight: bold;
    color: #BB2423;
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

@media screen and (max-width: 767px) {
  .cardAdv{
    padding: 0 30px !important;
  }
  .cardAdv2{
    margin-top: 20px;
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
