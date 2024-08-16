<template>
    <router-view />
    <div id='summit-et' class='summit-et'>
        <topNav />
        <div class='Part1'>
            <div class='background1'>
                <el-row class='row1' style='justify-content: center;'>
                    <el-col
                        class='colPart1'
                        :lg='12'
                        :md='12'
                        :sm='22'
                        :xl='12'
                        :xs='22'
                    >
                        <p class='subTitle'>
                            No KYC, No Obstacles
                        </p>
                        <h1 class='heading'>
                            Guess The NFP Impact
                        </h1>
                        <h1 class='heading'>
                            Trade CFDs In Crypto
                        </h1>
                        <div class='buttonContainer'>
                            <div class='part2Button signUpButton'>
                                <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                                    <p class='lp_btn lp_btn_register'>
                                        Register Now
                                    </p>
                                </el-button>
                                <el-button class='startNow lp_btn_register lp_btn' plain @click='jumpPage(1)'>
                                    <p class='startNow lp_btn_register lp_btn'>
                                        Try Free Demo
                                    </p>
                                </el-button>
                            </div>
                        </div>
                        <el-row class='row2'>
                            <el-col
                                class='colPart2'
                                :lg='8'
                                :md='8'
                                :sm='24'
                                :xl='5'
                                :xs='24'
                            >
                                <img alt='point' class='point' src='../../images/cpi1/g7-summit/badge-check.svg' />
                                <el-divider direction='vertical' style='height: 100%;' />
                                <div class='advContainer'>
                                    <p class='advans'>
                                        CFDs Trading
                                    </p>
                                    <p class='advans'>
                                        In Cryptocurrency
                                    </p>
                                </div>
                            </el-col>
                            <el-col
                                class='colPart2 col2Part2'
                                :lg='8'
                                :md='8'
                                :sm='24'
                                :xl='5'
                                :xs='24'
                            >
                                <img alt='point' class='point' src='../../images/cpi1/g7-summit/badge-check.svg' />
                                <el-divider direction='vertical' style='height: 100%;' />
                                <div class='advContainer'>
                                    <p class='advans'>
                                        KYC
                                    </p>
                                    <p class='advans'>
                                        No needed
                                    </p>
                                </div>
                            </el-col>
                            <el-col
                                class='colPart2 col2Part2'
                                :lg='8'
                                :md='8'
                                :sm='24'
                                :xl='5'
                                :xs='24'
                            >
                                <img alt='point' class='point' src='../../images/cpi1/g7-summit/badge-check.svg' />
                                <el-divider direction='vertical' style='height: 100%;' />
                                <div class='advContainer'>
                                    <p class='advans'>
                                        Tax Free
                                    </p>
                                    <p class='advans'>
                                        in European countries
                                    </p>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col
                        class='colPart1Money'
                        :lg='10'
                        :md='10'
                        :sm='22'
                        style='align-self: center; justify-content: center;'
                        :xl='10'
                        :xs='22'
                    >
                        <img alt='money' class='money' src='../../images/cpi1/g7-summit/pngwing.png' />
                    </el-col>
                </el-row>
            </div>
            <animals />
            <nfpCard />
            <advice />
            <userLayoutFooter />
        </div>
    </div>
</template>

<script>
import animals from './components/nfpETcard.vue'
import nfpCard from './components/nfpETcontent.vue'
import advice from './components/partnerSummitEt.vue'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'G7SummitEt',
    components: {
        nfpCard,
        advice,
        topNav,
        userLayoutFooter,
        animals,
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

.summit-et{
  overflow-x: hidden;
}

.el-divider--vertical{
          border-left: 1px #ff3d24 solid !important;
}

.Part1{
  color: #fff;
  .money{
    width: 100%;
    max-width: 600px;
  }
  .background1{
    background-image: url("../../images/cpi1/nfp/bannerET.jpg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    .advContainer{
      align-self: center;
    }
    .colPart1{
      padding: 50px 40px 50px;
    }
    .heading{
      font-size: 70px;
      font-weight: 800;
    }
    .subTitle{
      font-size: 35px;
      font-weight: 700;
      .logo{
      width: 46px;
    }
    }
        .startNow{
          border: none;
          background-color: #ff3d24 !important;
          color: #000 !important;
          border-radius: 25px;
          width: 150px;
          height: 50px;
          font-size: 20px;
        }
        .startNow:hover{
          color: #fff !important;
          background-color: unset !important;
          border: #fff 1px solid !important;
        }
        .row2{
          padding: 40px 0;
          .colPart2{
            display: flex;
            .point{
              width: 46px;
              filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(153deg) brightness(105%) contrast(105%);
            }
          }
        }
      }
  .cards{
    justify-content: center;
    .box-card{
      min-height: 270px;
      border-radius: 25px;
      h1{
        font-weight: bold;
        font-size: 35px;
      }
      p{
        padding-top: 20px;
        font-size: 21px;
        .bold{
          font-weight: bold;
        }
      }
    }
  }
}
.container1{
  text-align: center;
  padding: 20px 0;
}
.sub-heading{
  font-size: 20px;
  padding: 0 0 20px;
}
.row{
  justify-content: center;
  color: #000;
  word-wrap: break-word;
}
.youtubeVideo{
  text-align: -webkit-center;
  padding: 30px 0;
  display: flex;
}
.iframe-player{
  width: 100%;
  aspect-ratio: 16 / 9;
}

.containerPart2{
  text-align: center;
  color: #000;
  p{
    font-size: 30px;
    padding-top: 50px;
  }
  .part2Button{
    padding: 30px 0;
    justify-content: center;
    display: grid;
  }
  .startNow{
    border: none;
    background-color: #000 !important;
    color: #fff !important;
    border-radius: unset !important;
    width: 150px;
    height: 50px;
    font-size: 20px;
}
.startNow:hover{
    background-color: #d27d7c !important;
}
}

.part2Container{
  background-color: #000;
  color: #fff;
  text-align: center;
  .titleContainer{
    font-size: 56px;
  }
  .content{
    font-size: 18px;
    line-height: 1.8em;
  }
  .row2{
    padding: 50px 0 30px;
    .colContainer{
      .title{
        font-size: 30px;
        text-decoration: underline;
      }
      .content{
        font-size: 20px;
        padding-top: 20px;
      }
      .fotor{
        width: 100px;
      }
    }
  }
  .buttonContainer{
    padding: 30px 0;
    .startNow{
          border: none;
          background-color: #ff3d24 !important;
          color: #000 !important;
          border-radius: 25px;
          width: 150px;
          height: 50px;
          font-size: 20px;
        }
        .startNow:hover{
          color: #fff !important;
          background-color: unset !important;
          border: #fff 1px solid !important;
        }
  }
}
@media screen and (max-width: 1715px) {
  .box-card{
    min-height: 323px !important;
  }
}
@media screen and (max-width: 1500px) {
  .heading{
    h1{
      font-size: 60px !important;
    }
    .bold{
      font-size: 30px !important;
    }
    p{
      font-size: 20px !important;
    }
  }
}
@media screen and (max-width: 1400px) {
    .cpiPart1{
    .background1{
      .animals{
        width: 450px;
      }
    }
  }
}
@media screen and (max-width: 1300px) {
  .background1{
    .row1{
      .colPart1{
        .subTitle{
          font-size: 25px;
        }
        .heading{
          font-size: 50px;
        }
      }
    }
  }
    .cpiPart1{
    .background1{
      .animals{
        width: 430px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .box-card{
    min-height: 417px !important;
  }
}

@media screen and (max-width: 991px) {
  .col2Part2{
    padding-top: 20px;
  }
  .background1{
    .row1{
      .colPart1{
        justify-content: center;
        display: grid;
        padding: 50px 10px 30px;
      }
      .colPart1Money{
        display: grid;
        .money{
          padding-bottom: 30px;
          max-width: 500px;
        }
      }
    }
  }
  .heading{
    padding: unset !important;
  }
  .background1{
    .animals{
      width: 100%;
      max-width: 350px;
    }
  }
  .bullContainer1{
    text-align: end;
  }

  .cardContainer{
    padding-top: 20px;
  }
  .box-card{
    height: auto !important;
    min-height: unset !important;
  }
  .part2{
    .animals{
      max-width: 400px;
    }
    .animalTwo{
      text-align: end !important;
    }
  }
}

@media screen and (max-width: 650px) {
  .background1{
    .row1{
      .colPart1{
        .point{
          width: 35px;
        }
      }
    }
  }
  .heading{
    h1{
      font-size: 35px !important;
    }
    .bold{
      font-size: 24px !important;
    }
    p{
      font-size: 14px !important;
    }
    .terms{
      font-size: 12px !important;
    }
  }
  .background1{
    .animals{
      max-width: 250px;
    }
  }

  .part2{
    .challenge{
      h1{
        font-size: 30px !important;
      }
    }
    .animals{
      max-width: 300px;
    }
  }
}
</style>
