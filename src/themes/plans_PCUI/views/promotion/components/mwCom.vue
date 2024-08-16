<template>
    <div class='mwContainer'>
        <div class='part1'>
            <el-row class='row' :gutter='20'>
                <el-col
                    class='col'
                    :lg='14'
                    :md='16'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <h1 class='heading'>
                        Win Big with HEADLINE
                    </h1>
                    <p class='content'>
                        Easy trading toward your wealth accumulation
                    </p>
                </el-col>
            </el-row>

            <el-row class='row cardRow' :gutter='20'>
                <el-col
                    class='card'
                    :lg='5'
                    :md='6'
                    :sm='8'
                    :xl='4'
                    :xs='24'
                >
                    <el-card class='box-card'>
                        <div class='text item'>
                            <h1>1. Crypto Trading</h1>
                            <p class='text1'>
                                Yes, we allow direct crypto currency trading on various financial products without KYC required
                            </p>
                        </div>
                    </el-card>
                </el-col>

                <el-col
                    class='card2'
                    :lg='5'
                    :md='6'
                    :sm='8'
                    :xl='4'
                    :xs='24'
                >
                    <el-card class='box-card card2_1'>
                        <div class='text item'>
                            <h1>2. Tips to trade</h1>
                            <p class='text2'>
                                Yes, real-time useful trading tips will be sent on all social platforms by notification to help you catch the best buy or sell moment
                            </p>
                        </div>
                    </el-card>
                </el-col>

                <el-col
                    class='card3'
                    :lg='5'
                    :md='6'
                    :sm='8'
                    :xl='4'
                    :xs='24'
                >
                    <el-card class='box-card card2_1'>
                        <div class='text item'>
                            <h1>3. Win Bigger</h1>
                            <p class='text3'>
                                Yes, we recommend to invest the deliverables only once there is high possibility to win instead of seeking without a trading goal. To always win BIG with HEADLNE.net!
                            </p>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <el-carousel class='part2' indicator-position='outside'>
            <el-carousel-item class='carousel'>
                <div class='carouselContainer'>
                    <h3>Testimonials</h3>
                    <p class='info'>
                        “Has G7 Summit been a meeting that mattered?”
                    </p>
                    <p class='info'>
                        "Yes, if we can see anything to find a new way or stop the Economic Slowdown"
                    </p>
                    <p class='name'>
                        Jason Strauss
                    </p>
                    <p class='name'>
                        Consultant of HEADLINE
                    </p>
                </div>
            </el-carousel-item>
        </el-carousel>
        <el-divider />

        <div class='part3'>
            <el-row class='row ' :gutter='20'>
                <el-col
                    class='youtubeVideo'
                    :lg='9'
                    :md='10'
                    :sm='24'
                    :xl='8'
                    :xs='24'
                >
                    <iframe
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowfullscreen
                        class='video'
                        frameborder='0'
                        src='https://www.youtube.com/embed/qULycVp4mhQ'
                        title='YouTube video player'
                    ></iframe>
                </el-col>
                <el-col
                    class='buttonContainer'
                    :lg='6'
                    :md='7'
                    :sm='24'
                    :xl='5'
                    :xs='24'
                >
                    <div class='button1'>
                        <el-button class='homeButton lp_btn lp_btn_home' plain @click='jumpPage(1)'>
                            <p class='homeButton lp_btn lp_btn_home'>
                                Start to Trade
                            </p>
                        </el-button>
                    </div>

                    <div class='button2'>
                        <el-button class='tgButton lp_btn lp_btn_tgBot' plain @click='jumpPage(3)'>
                            <p class='tgButton lp_btn lp_btn_tgBot'>
                                Join TG groups
                            </p>
                        </el-button>
                    </div>
                </el-col>
            </el-row>
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
                    window.open('https://www.headline.net/en-US/home')
                    break
                case 2 :
                    window.open('https://www.headline.net/en-US/register')
                    break
                case 3 :
                    window.open('https://t.me/Headline_Group')
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
.row{
  justify-content: center;
}
.part1{
  background-color: rgb(169,51,117);
  padding: 50px 0;
  .heading{
    font-size: 83px;
    color: #fff;
  }
  .content{
    font-size: 22px;
    color: #fff;
  }
  .cardRow{
    padding-top: 30px;
  }
  .box-card{
    max-width: 279px;
    background-color: #ece4e8;
    border-radius: unset;
    h1{
      font-size: 40px;
      font-weight: 800;
    }
    p{
      font-size: 18px;
      padding-bottom: 70px;
    }
    .text1{
      padding-bottom: 50px;
    }
    .text2{
      padding-bottom: 70px;
    }
    .text3{
      padding-bottom: 90px;
    }
  }
}

.part2{
  align-items: center;
  align-self: center;
  background-color: rgb(236,228,232);
  color: #000;
  height: auto;
    .carousel{
      text-align: center;
      justify-content: center;
      display: grid;
      padding: 30px 0;
      .carouselContainer{
        max-width: 1000px;
      }
      h3{
        font-size: 40px;
        font-weight: bold;
      }
      .info{
        font-size: 40px;
        line-height: 1.3em;
        font-weight: bold;
      }
      .name{
        color: #3D9BE9;
        font-size: 18px;
        line-height: 1.7em;
        font-weight: bold;
      }
    }
}

.el-divider--horizontal{
  margin: unset !important;
  border-top: 2px rgb(255,255,255) solid;
}

.part3{
  background-color: rgb(236,228,232);
  padding: 50px 0;
  .video {
     aspect-ratio : 16/9;
     width: 100%;
  }
  .buttonContainer{
    align-self: center;
    .homeButton{
          border: none;
          background-color: #000 !important;
          color: #fff !important;
          border-radius: unset !important;
          width: 400px;
          height: 50px;
          font-size: 20px;
        }
        .homeButton:hover{
          background-color: rgb(169,51,117) !important;
        }

        .tgButton{
          border: none;
          background-color: rgb(169,51,117) !important;
          color: #fff !important;
          border-radius: unset !important;
          width: 400px;
          height: 50px;
          font-size: 20px;
        }
        .tgButton:hover{
          background-color: #000 !important;
        }
        .button2{
          padding-top: 30px;
        }
  }
}

@media screen and (max-width: 1300px) {
  .box-card{
    max-width: unset;
    h1{
      font-size: 30px !important;
      font-weight: 800;
    }
    p{
      font-size: 16px;
    }
    .text1{
      padding-bottom: 30px;
    }
    .text2{
      padding-bottom: 50px;
    }
    .text3{
      padding-bottom: 70px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .cardRow{
    text-align: -webkit-center;
  }
  .box-card{
    max-width: unset;
    height: 400px;
    text-align: start;
    p{
      padding-bottom: unset;
    }
    .text1{
      padding-bottom: unset;
    }
    .text2{
      padding-bottom: unset;
    }
    .text3{
      padding-bottom: unset;
    }
  }
}

@media screen and (max-width: 991px) {
  .part1{
    .heading{
      font-size: 60px;
    .content{
      font-size: 18px;
    }
  }
}
  .buttonContainer{
    display: grid;
    justify-content: center;
    padding-top: 20px;
  }
  .part2{
    .carousel{
      .carouselContainer{
        align-self: center;
        max-width: 800px;
      }
      h3{
        font-size: 25px;
      }
      .info{
        font-size: 25px;
        line-height: 1.3em;
      }
      .name{
        font-size: 16px;
        line-height: 1.7em;
      }
    }
}
}

@media screen and (max-width: 767px) {
  .box-card{
    width: 400px !important;
    max-width: unset !important;
    height: auto !important;
  }
  .card2_1{
    margin-top: 20px;
  }
}

@media screen and (max-width: 600px) {
  .buttonContainer{
    .homeButton{
      width: 250px !important;
    }
    .tgButton{
      width: 250px !important;
    }
  }
}

@media screen and (max-width: 450px) {
  .part1{
    .heading{
      font-size: 50px;
    .content{
      font-size: 16px;
    }
  }
}
  .box-card{
    width: 350px !important;
  }
}
</style>
