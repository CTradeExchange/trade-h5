<template>
    <router-view />
    <div id='mw' class='mw'>
        <topNav />
        <div class='container1'>
        </div>
        <el-divider />

        <el-row class='container2' :gutter='20'>
            <el-col
                class='col1 container2Col1'
                :lg='6'
                :md='24'
                :sm='24'
                :xl='6'
                :xs='24'
            >
                <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(2)'>
                    <p class='startNow lp_btn lp_btn_register'>
                        See how easy it will be
                    </p>
                </el-button>
                <h1>Crypto Trading</h1>
                <h1>No KYC for deposit</h1>
                <h1>No Tax charged</h1>
            </el-col>

            <el-col
                class='col2'
                :lg='12'
                :md='24'
                :sm='24'
                style='text-align: center'
                :xl='12'
                :xs='24'
            >
                <div class='backgroundContainer'>
                    <h1 class='heading'>
                        Trading Tips from 2023 G7 Summit
                    </h1>
                    <div class='buttonContainer'>
                        <el-button class='homeButton lp_btn lp_btn_home' plain @click='jumpPage(1)'>
                            <p class='homeButton lp_btn lp_btn_home'>
                                Trade in "G7" Event with Us
                            </p>
                        </el-button>
                        <el-button class='tgButton lp_btn lp_btn_tgBot' plain @click='jumpPage(3)'>
                            <p class='tgButton lp_btn lp_btn_tgBot'>
                                Join TG groups for "WIN" tips
                            </p>
                        </el-button>
                    </div>
                </div>
                <el-row class='col2Row' :gutter='20'>
                    <el-col :span='8'>
                        <img alt='image1' class='imageContainer' src='../../images/cpi1/g7-summit/mwImage1.png' />
                        <div class='content'>
                            <h1>Asia ​Economic</h1>
                            <p>Asia's economy plays a vital role in shaping the global economic landscape. Its trading relationships, investment flows, energy consumption patterns, and technological advancements all have a significant impact on the world economy.</p>
                        </div>
                    </el-col>

                    <el-col :span='8'>
                        <img alt='image2' class='imageContainer' src='../../images/cpi1/g7-summit/mwImage2.jpg' />
                        <div class='content'>
                            <h1>Global  Recovery</h1>
                            <p>It is expected that the global economy will continue to recover gradually from the COVID-19 pandemic. The pace and timing of the recovery will depend on a government policies, vaccine distribution, and consumer behavior.</p>
                        </div>
                    </el-col>

                    <el-col :span='8'>
                        <img alt='image3' class='imageContainer' src='../../images/cpi1/g7-summit/mwImage3.jpg' />
                        <div class='content'>
                            <h1>ESG</h1>
                            <p>ESG industry is expected to continue its rapid growth in the coming years, driven by strong demand from investors, regulatory pressures, and a growing recognition of the importance of sustainability and social responsibility.</p>
                        </div>
                    </el-col>
                </el-row>
            </el-col>

            <el-col
                class='col1 container2Col3'
                :lg='6'
                :md='24'
                :sm='24'
                :xl='6'
                :xs='24'
            >
                <el-button class='startNow lp_btn lp_btn_home' plain @click='jumpPage(1)'>
                    <p class='startNow lp_btn lp_btn_home'>
                        See what you can take
                    </p>
                </el-button>
                <h1>Best Trading timing suggested</h1>
                <h1>Real-time notification</h1>
                <h1>Supportive team to help</h1>
            </el-col>
        </el-row>
        <mwCom />
        <userLayoutFooter />
    </div>
</template>

<script>
import mwCom from './components/mwCom.vue'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'CPI2',
    components: {
        mwCom,
        topNav,
        userLayoutFooter,
    },
    setup (props) {
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
.backgroundContainer{
  background: #ece4e8;
  padding-bottom: 200px;
}

.mw{
  overflow-x: hidden;
}
.el-divider--horizontal{
  width: 90%;
  margin: unset !important;
  border-top: 10px rgb(169,51,117) solid;
  padding-bottom: 20px;
}

.container1{
  background-image: url(../../images/cpi1/g7-summit/mwBackground.jpg);
  background-size: cover;
  background-position: center center;
  height: 490px;
  background-repeat:no-repeat;
}

.container2{
  .startNow{
    background-color: none !important;
    color: #BB2423 !important;
    border: 3px solid #BB2423;
    border-radius: unset !important;
    font-size: 20px;
    height: 40px;
    font-weight: bold;
  }
  .startNow:hover{
    background-color: #000 !important;
    color: #fff !important;
  }
  .imageContainer{
  border-radius: 150px 150px 0 0;
  width: 100%;
  height: 400px;
  object-fit: cover;
  }
  .col1{
    align-self: center;
    justify-content: center;
    display: grid;
    h1{
      font-size: 35px;
      color: #008AFC;
    }
    span{
      font-size: 20px;
    }
  }
  .col2{
    .heading{
      font-size: 50px;
      color: #000;
      font-weight: 800;
    }
    .col2Row{
      bottom: 150px;
    }

    .content{
      background-color: #eeeef5;
      text-align: start;
      min-height: 230px;
      font-weight: 800;
      h1{
        padding: 10px 10px 0;
      }
      p{
        padding: 30px 10px 20px;
      }
    }
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
  }
}
@media screen and (max-width: 1643px) {
  .buttonContainer{
    .homeButton{
      margin-left: 3px;
    }
    .tgButton{
      margin: 20px 12px;
    }
  }
  .col2{
    .content{
      min-height: 250px !important;
    }
  }
}

@media screen and (max-width: 1430px) {
  .col2{
    .content{
      min-height: 320px !important;
    }
  }
}

@media screen and (max-width: 1199px) {
  .col2{
    .col2Row{
      bottom: 100px;
    }
  }
  .backgroundContainer{
    margin-top: 50px;
  }
  .container2Col1{
    padding: 20px 40px !important;
  }
  .container2Col3{
    padding: 20px 40px !important;
    text-align: end;
  }
  .container2 .col1{
    justify-content: unset !important;
    display: unset !important;
  }
}

@media screen and (max-width: 811px) {
  .buttonContainer{
    .homeButton{
      margin-left: 3px;
    }
    .tgButton{
      margin: 20px 12px;
    }
  }
  .container2Col1{
    h1{
      font-size: 25px !important;
    }
  }
  .container2Col3{
    h1{
      font-size: 25px !important;
    }
  }
}

@media screen and (max-width: 600px) {
  .col2{
    .content{
      min-height: 450px !important;
      font-weight: 400px !important;
    }
  }
}

@media screen and (max-width: 430px) {
  .col2{
    .heading{
      font-size: 35px !important;
    }
    h1{
      font-size: 24px;
    }
    p{
      font-size: 13px;
    }
    .content{
      min-height: 566px !important;
    }
  }
  .buttonContainer{
    .homeButton{
      width: 330px !important;
      font-size: 16px !important;
    }
    .tgButton{
      width: 330px !important;
      font-size: 16px !important;
    }
  }
}
</style>
