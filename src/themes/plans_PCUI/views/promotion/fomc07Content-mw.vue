<template>
    <router-view />
    <div id='nfp' class='nfp'>
        <div class='container1'>
            <el-row class='row1'>
                <el-col
                    class='container1Col1'
                    :lg='12'
                    :md='12'
                    :sm='24'
                    :xl='12'
                    :xs='24'
                >
                    <h1>Why trade FOMC meetings with Headline.net?</h1>
                    <el-button class='trade lp_btn_register lp_btn' plain text @click='jumpPage(1)'>
                        <p class='lp_btn_register lp_btn'>
                            Trade Now
                        </p>
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class='container2'>
            <el-row class='row2'>
                <el-col
                    class='container2Col1'
                    :lg='11'
                    :md='11'
                    :sm='22'
                    :xl='11'
                    :xs='22'
                >
                    <img alt='banner' class='banner' src='../../images/cpi1/fomc07/backgroundImg2Mw.jpg' />
                </el-col>
                <el-col
                    class='container2Col2'
                    :lg='11'
                    :md='11'
                    :sm='22'
                    :xl='11'
                    :xs='22'
                >
                    <h1 class='title'>
                        Seeing whole from a part
                    </h1>
                    <p class='content'>
                        FOMC meetings effectively acts as the base interest rate for the US economy. Changes to the federal funds rate will impact short and long-term interest rates, forex rates, and eventually economic factors like unemployment or inflation. This, in turn, will play out across the global economy and all kinds of finance products.
                    </p>
                    <el-button class='trade lp_btn_infoDetail lp_btn' plain text @click='jumpPage(2)'>
                        <p class='lp_btn_infoDetail lp_btn'>
                            LEARN MORE
                        </p>
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <div class='container3'>
            <el-row class='row1'>
                <el-col
                    class='container2Col1'
                    :lg='11'
                    :md='11'
                    :sm='22'
                    :xl='11'
                    :xs='22'
                >
                    <p>One step ahead of the market to grab the chance</p>
                    <p>To keep inline with the market Join our TG group</p>
                    <img alt='icon' class='icon' src='../../images/cpi1/fomc07/telegramBtn.png' @click='jumpPage(3)' />
                </el-col>
                <el-col
                    class='container2Col2'
                    :lg='11'
                    :md='11'
                    :sm='22'
                    :xl='11'
                    :xs='22'
                />
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Nfp',
    components: {
    },
    setup (props) {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/register')
                    break
                case 2 :
                    window.open('https://www.headline.net/en-US/infoDetail?id=30713')
                    break
                case 3 :
                    window.open('https://t.me/Headline_Group')
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
.container1{
  background-image: url("../.././images/cpi1/fomc07/backgroundImg1Mw.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  .row1{
    justify-content: center;
    justify-content: center;
    padding: 200px 20px;
    font-family: 'Playfair Display', serif;
    background-color: rgba(0,0,0,0.2);
    .container1Col1{
      text-align: center;
      h1{
        text-align: center !important;
        color: #fff;
        font-size: 72px;
      }
      .trade{
        background: #E5EBFA;
        color: #0069FF;
        font-size: 20px;
        font-weight: 700;
        width: 240px;
        height: 48px;
        border-radius: 60px;
        margin-top: 30px;
      }
      .trade:hover{
        background: #689ade;
        color: #fff;
      }
    }
  }
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
    justify-content: center;
  }
  .container2Col1{
    .banner{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .container2Col2{
    background-color: rgb(252,214,140);
    text-align: center;
    align-content: center;
    justify-content: center;
    display: grid;
    place-items: center;
    padding: 30px 20px;
    .title{
      font-size: 46px;
    }
    .content{
      font-size: 20px;
      line-height: 1.5em;
      text-align: center;
      max-width: 460px;
    }
    .trade{
      background: #074151;
      color: #fff;
      font-size: 20px;
      font-weight: 700;
      width: 240px;
      height: 48px;
      border-radius: unset !important;
      margin-top: 30px;
    }
    .trade:hover{
      background: #3d7283;
    }
  }
}
.container3{
  margin-top: 40px;
  .row1{
    justify-content: center;
    .container2Col1{
      text-align: center;
      padding: 150px 20px;
      p{
        font-style:italic;
        font-size: 23px;
        color: #191919;
      }
      .icon{
        cursor: pointer;
      }
    }
    .container2Col2{
        background-image: url("../.././images/cpi1/fomc07/backgroundImg3Mw.jpg");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
  }
}
@media screen and (max-width: 1200px) {
  .container1{
    .row1{
      .container1Col1{
        h1{
          font-size: 60px;
        }
      }
    }
  }
}
@media screen and (max-width: 991px) {
  .container3{
    .row1{
      .container2Col1{
        text-align: center;
        padding: 50px 20px;
        p{
          font-size: 20px;
        }
      }
      .container2Col2{
        min-height: 300px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .container2{
  .container2Col2{
      .title{
        font-size: 35px;
      }
      .content{
        font-size: 18px;
      }
      .trade{
        font-size: 18px;
        width: 220px;
      }
    }
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
@media screen and (max-width: 550px) {
  .container1{
    .row1{
      .container1Col1{
        h1{
          font-size: 40px;
        }
      }
    }
  }
}
</style>
