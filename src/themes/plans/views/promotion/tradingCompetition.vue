<template>
    <router-view />
    <top />
    <div id='tradingCompetition' class='cpiDetails'>
        <div class='cpiPart1'>
            <div class='container1'>
                <el-row class='banner'>
                    <el-col
                        class='youtubeVideo'
                        :lg='8'
                        :md='24'
                        :sm='24'
                        :xl='8'
                        :xs='24'
                    >
                        <iframe
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                            allowfullscreen
                            class='iframe-player'
                            frameborder='0'
                            src='https://www.youtube.com/embed/3WTMEHmBKWY'
                            title='YouTube video player'
                        ></iframe>
                    </el-col>
                    <el-col
                        class='part1Banner'
                        :lg='12'
                        :md='24'
                        :sm='24'
                        :xl='12'
                        :xs='24'
                    >
                        <div>
                            <div class='bannerButton'>
                                <el-button class='claimButton lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                                    Claim $50 Register bonus now!
                                </el-button>
                            </div>
                            <h1 class='bannerTitle'>
                                Win $5,000 Prize in
                            </h1>
                            <h1 class='bannerTitle'>
                                FED Trading Competition
                            </h1>
                            <p class='bannerText'>
                                HEADLINE | EVENT-DRIVEN | TRADING COMPETITION
                            </p>
                        </div>
                        <div class='part1Button'>
                            <el-button class='detailsButton lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                                More Details
                            </el-button>
                            <span class='tradeContainer'>
                                <el-button class='tradeButton lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                                    Trade Now
                                </el-button>
                            </span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <claimLayout />
        <information />
        <partner />
    </div>
</template>

<script>
import { h, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import claimLayout from './components/competitionLayoutMay.vue'
import information from './components/competitionDetails.vue'
import partner from './components/partners.vue'
import top from '../../components/eventTop.vue'
export default {
    name: 'CPI2',
    components: {
        claimLayout,
        partner,
        information,
        ElMessage,
        ElMessageBox,
        top,
    },
    setup (props) {
        const jumpPage = (attr) => {
            switch (attr) {
                case 1 :
                    window.open('https://www.headline.net/en-US/register')
                    break
            }
        }

        const open = () => {
            ElMessageBox({
                title: 'Message',
                message: h('p', null, [
                    h('h2', null, 'Terms and Condition'),
                    h('br', null,),
                    h('p', null, "1. After opening a real account, use your personal Telegram to add Headline's Telegram account. You will receive 50 USDT bonus after confirming your identity with Headline Telegram admin."),
                    h('br', null,),
                    h('p', null, '2. The 50 USDT bonus is not to be withdrawn and to be used for trading purposes only.'),
                    h('br', null,),
                    h('p', null, '3. You can withdraw the profit made by using the 50 USDT bonus after making a deposit without any transaction volume restrictions. The 50 USDT bonus will be deducted after the promotion expires.'),
                    h('br', null,),
                    h('p', null, '4. Trading loses made by using the bonus are not to be borne. You can contact customer service to deduct the remaining bonus before making a deposit to make sure the system does not deduct your deposit amount after the promotion expires in the future.'),
                    h('br', null,),
                    h('p', null, '5. The promotion is valid for one month. If you do not make any transaction with the bonus or do not make any deposit until after the promotion expires, the 50 USDT bonus will be deducted.'),
                    h('br', null,),
                    h('p', null, '6. Headline reserves all rights regarding any dispute on this promotion.'),
                ]),
                confirmButtonClass: 'btnConfirm',
            })
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

.cpiDetails{
  overflow-x: hidden;
}
    .animals{
      width: 50%;
      max-width: 537px;
    }
.cpiPart1{
  border-bottom: 1px solid #E8E6E6;
  .background1{
    background: radial-gradient(circle at 50% 50%, #000000 0%, #7D1817 100%);
    display: flex;
    .animals{
      transform: rotateY(180deg);
      filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(68deg) brightness(103%) contrast(105%);
    }
    .heading{
      justify-content: center;
      display: grid;
      h1{
        font-weight: bold;
        font-size: 80px;
        color: #fff;
      }
      p{
        font-size: 35px;
        text-align: center;
        color: #fff;
      }
      .yellow{
        color: #FFF86B;
      }
      .bold{
        font-size: 50px;
      }
      .signUpButton{
        justify-content: center;
        display: flex;
      }

      .terms{
        color: #FFF86B;
        font-size: 16px;
      }
      .terms:hover{
        color: #BB2423;
      }
      .part2Button{
        justify-content: center;
        display: flex;
        .part2Button{
          padding: 30px 0;
          justify-content: center;
          display: grid;
        }
        .startNow{
          border: none;
          background-color: #fff !important;
          color: #000 !important;
          border-radius: unset !important;
          width: 150px;
          height: 50px;
          font-size: 20px;
        }
        .startNow:hover{
          color: #d27d7c !important;
        }
      }
    }
  }
  .part2{
    display: flex;
    justify-content: center;
    .challenge{
      align-self: center;
      text-align: center;
      h1{
        font-weight: 700;
        font-size: 43px;
      }
    }
  }
  .cards{
    justify-content: center;
    .box-card{
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
  padding: 20px 0;
  .banner{
    justify-content: center;
  }
  .part1Banner{
    background-image: url("../../images/cpi1/newsBanner.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    .bannerTitle{
      color: #fff;
      font-size: 40px;
      text-align: start;
      padding: 0px 40px;
    }
    .bannerText{
      color: #fff;
      font-size: 18px;
      text-align: start;
      padding: 10px 40px;
    }
  }
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
.iframe-player{
  height: 100%;
  width: 100%;
}

.containerPart2{
  justify-content: center;
  display: grid;
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
.part1Button{
  padding: 40px;
  .tradeContainer{
    padding-left: 20px;
  }
}
.bannerButton{
  padding: 40px;
  text-align: end;
}
    .claimButton{
      background-color: rgba(128,128,128,0.5) !important;
      color: #fff;
      border-radius: 4px;
      border: unset;
      font-weight: bold;
      font-size: 25px;
    }
    .claimButton:hover{
      background-color: #BB2423 !important;
      color: #fff;
    }
    .detailsButton{
      background-color: unset !important;
      color: #fff;
      border-radius: unset !important;
    }
    .detailsButton:hover{
      background-color: #fff !important;
      color:#BB2423;
      border: unset;
    }

    .tradeButton{
      background-color: #BB2423 !important;
      color: #fff;
      border-radius: unset !important;
      border: unset;
    }
    .tradeButton:hover{
      background-color: #fff !important;
      color:#BB2423
    }

  @media screen and (max-width: 1500px) {
    .cpiPart1{
      .container1{
        .banner{
          .part1Banner{
            .bannerTitle{
              font-size: 30px;
            }

            .bannerText{
              font-size: 15px;
            }
            .claimButton{
              font-size: 18px;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1199px) {
    .cpiPart1{
      .container1{
          .banner{
            flex-direction: column-reverse;
            .part1Banner{
              background-position: center;
            }
          }
          .youtubeVideo{
            padding-top: 30px;
            .iframe-player{
              height: 350px;
            }
          }
        }
      }
    }

    @media screen and (max-width: 500px) {
    .cpiPart1{
      .container1{
        .banner{
          .part1Banner{
            .claimButton{
              font-size: 15px;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 500px) {
    .detailsButton{
      width: 90px;
    }
    .tradeContainer{
      display: grid;
      padding-top: 15px;
      padding-left: unset !important;
      .tradeButton{
        width: 90px;
      }
    }
  }
</style>
