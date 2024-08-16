<template>
    <div class='win'>
        <div class='container5'>
            <el-row class='cardContainer' style='justify-content: center;'>
                <el-col
                    :lg='5'
                    :md='11'
                    :sm='11'
                    style='justify-content: center; display: grid;'
                    :xl='5'
                    :xs='20'
                >
                    <img alt='change' class='card' src='../../../images/cpi1/nfp/MWcard1.jpg' />
                    <el-card class='box-card cardRow5'>
                        <h1>Global stock markets</h1>
                        <p>NFP -> USD</p>
                        <div class='buttonContainer'>
                            <el-button class='knowMore lp_btn_infoDetail lp_btn' plain text @click='jumpPage(5)'>
                                <p class='lp_btn_infoDetail lp_btn'>
                                    Know More
                                </p>
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    :lg='5'
                    :md='11'
                    :sm='11'
                    style='justify-content: center; display: grid;'
                    :xl='5'
                    :xs='20'
                >
                    <img alt='change' class='card' src='../../../images/cpi1/nfp/MWcard2.jpeg' />
                    <el-card class='box-card cardRow5'>
                        <h1>Foreign exchange market</h1>
                        <p>NFP -> Investor confidence</p>
                        <div class='buttonContainer'>
                            <el-button class='knowMore lp_btn_infoDetail lp_btn' plain text @click='jumpPage(5)'>
                                <p class='lp_btn_infoDetail lp_btn'>
                                    Know More
                                </p>
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    :lg='5'
                    :md='11'
                    :sm='11'
                    style='justify-content: center; display: grid;'
                    :xl='5'
                    :xs='20'
                >
                    <img alt='change' class='card' src='../../../images/cpi1/nfp/MWcard3.png' />
                    <el-card class='box-card cardRow5'>
                        <h1>
                            Central bank policy
                        </h1>
                        <p>NFP -> interest rates</p>
                        <div class='buttonContainer'>
                            <el-button class='knowMore lp_btn_infoDetail lp_btn' plain text @click='jumpPage(5)'>
                                <p class='lp_btn_infoDetail lp_btn'>
                                    Know More
                                </p>
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    :lg='5'
                    :md='11'
                    :sm='11'
                    style='justify-content: center; display: grid;'
                    :xl='5'
                    :xs='20'
                >
                    <img alt='change' class='card' src='../../../images/cpi1/nfp/MWcard4.jpg' />
                    <el-card class='box-card cardRow5'>
                        <h1>
                            Commodity price
                        </h1>
                        <p>NFP -> Oil</p>
                        <div class='buttonContainer'>
                            <el-button class='knowMore lp_btn_infoDetail lp_btn' plain text @click='jumpPage(5)'>
                                <p class='lp_btn_infoDetail lp_btn'>
                                    Know More
                                </p>
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col
                    class='container5View'
                    :lg='4'
                    :md='24'
                    :sm='24'
                    :xl='4'
                    :xs='24'
                >
                    <el-button class='viewAll lp_btn_home lp_btn' plain text @click='jumpPage(4)'>
                        <p class='lp_btn_home lp_btn'>
                            View All
                        </p>
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <div class='container6'>
            <el-row class='row2' style='justify-content: center;'>
                <el-col
                    class='container6Col1'
                    :lg='11'
                    :md='11'
                    :sm='22'
                    :xl='11'
                    :xs='22'
                >
                    <h1 class='heading'>
                        Real-time Trading Tips
                    </h1>
                    <p class='content'>
                        To grab the best timing
                    </p>
                    <div class='tgLink'>
                        <el-button class='tgBtn lp_btn_telegram lp_btn' plain text @click='jumpPage(3)'>
                            <p class='lp_btn_telegram lp_btn'>
                                Telegram
                            </p>
                        </el-button>
                    </div>
                </el-col>
                <el-col
                    :lg='11'
                    :md='11'
                    :sm='22'
                    :xl='11'
                    :xs='22'
                >
                    <img alt='banner' class='banner' src='../../../images/cpi1/nfp/mwBanner3.jpg' />
                </el-col>
            </el-row>
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
                case 2 :
                    window.open('https://www.headline.net/en-US/download')
                    break
                case 3 :
                    window.open('https://t.me/Headline_OfficialBot')
                    break
                case 4 :
                    window.open('https://www.headline.net/en-US/home')
                    break
                case 5 :
                    window.open('https://www.headline.net/en-US/infoDetail?id=27967')
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
.container5{
  margin: 0 40px;
  background-color: rgb(236,228,232);
  .container5View{
    text-align: end; align-self: center;
  }
  .cardContainer{
    padding-top: 50px;
    .card{
      width:  286px;
      height: 335px;
      object-fit: cover;
    }
    .cardRow5{
      position: relative;
      bottom: 50px;
      left: 30px;
    }
    .box-card{
      max-width: 286px;
      border-radius: unset !important;
      h1{
        font-size: 20px;
      }
      p{
        font-size: 16px;
      }
      .buttonContainer{
        text-align: end;
        padding-top: 10px;
        .knowMore{
          background-color: #E5EBFA !important;
          color: #0069FF !important;
          border-radius: 60px;
          height: 35px;
          font-size: 16px;
        }
        .knowMore:hover{
          background-color: #689ade !important;
          color: #FFF !important;
        }
      }
    }
    .viewAll{
      background: #000;
      color: #fff;
      font-size: 15px;
      width: 142px;
      height: 40px;
      border-radius: unset !important;
    }
    .viewAll:hover{
      color: #000;
      background: #fff;
      border: 1px solid #000;
    }
  }
}

.container6{
  .row2{
    margin: 50px 0;
  }
  .container6Col1{
    background-color: rgb(175,152,196);
    align-content: center;
    display: grid;
    text-align: center;
  }
  .heading{
    font-size: 40px;
    line-height: 1.35em;
    color: #000;
    font-weight: 800;
  }
  .content{
    font-size: 24px;
    font-weight: 800;
    color: #000;
    line-height: 1.35em;
    padding-top: 20px;
  }
  .tg{
    width: 50px;
  }
  .link{
    font-size: 20px;
    font-weight: bolder;
    color: #000;
    text-decoration: underline;
  }
  .tgLink{
    padding-top: 30px;
    align-content: center;
    display: flex;
    justify-content: center;
    .tgBtn{
      background-color: #074151 !important;
      color: #fff !important;
      border-radius: unset !important;
      width: 140px;
      height: 40px;
      font-size: 16px;
      font-weight: bold;
    }
    .tgBtn:hover{
      background-color: #417586 !important;
    }
  }
  .banner{
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 1650px) {
  .container5{
  .cardContainer{
    .card{
      width:  240px;
      height: 335px;
    }
    .box-card{
      max-width: 240px;
    }
  }
}
}

@media screen and (max-width: 1400px) {
  .container5{
  .cardContainer{
    .card{
      width:  200px;
      height: 335px;
    }
    .box-card{
      max-width: 200px;
    }
  }
}
}

@media screen and (max-width: 1199px) {
  .cardContainer{
    .card{
      width:  286px !important;
      height: 335px !important;
    }
    .box-card{
      max-width: 286px !important;
    }
  }
  .container5{
  .container5View{
    text-align: center !important;
    align-self: unset !important;
    padding-bottom: 30px;
    }
  }
    .container6{
    .container6Col1{
      padding: 30px 0;
    }
  }
}
@media screen and (max-width: 600px) {
  .container6{
    .heading{
      font-size: 30px;
      line-height: 1.35em;
      color: #000;
      font-weight: 800;
    }
    .content{
      font-size: 20px;
    }
  }
}

@media screen and (max-width: 500px) {
  .cardRow5{
    width: 250px !important;
  }
  .container5{
    .cardContainer{
      .card{
        width: 250px !important;
        }
      }
    }
  }
</style>
