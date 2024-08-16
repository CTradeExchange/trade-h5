<template>
    <router-view />
    <div id='cpi1' class='cpiDetails'>
        <top />
        <div class='background'>
            <el-row class='row'>
                <el-col
                    :lg='14'
                    :md='16'
                    :sm='18'
                    style='align-self: center'
                    :xl='12'
                    :xs='22'
                >
                    <div class='intro'>
                        <h1>49th G7 Summit</h1>
                        <p>Fri, May 19, 2023 - Sun, May 21, 2023</p>
                        <p>in Hiroshima, Hiroshima Prefecture, Japan</p>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class='container2'>
            <el-row class='row'>
                <el-col :lg='14' :md='16' :sm='18' :xl='12' :xs='24'>
                    <h2 class='heading'>
                        What is G7 Summit
                    </h2>
                    <p class='text'>
                        G7 summit is an International forum held annually for the leaders of the G7 member states of France, the United Kingdon, the United States, Germany, Japan, Canada and Italy, and the European Union.
                    </p>
                </el-col>
            </el-row>

            <div class='row1Image'>
                <img alt='japan' class='country' src='../../images/cpi1/g7-summit/japan.png' />
                <img alt='italy' class='country' src='../../images/cpi1/g7-summit/italy.png' />
                <img alt='canada' class='country' src='../../images/cpi1/g7-summit/canada.png' />
                <img alt='france' class='country' src='../../images/cpi1/g7-summit/france.png' />
            </div>
            <div class='row2Image'>
                <img alt='us' class='country' src='../../images/cpi1/g7-summit/united-states-of-america.png' />
                <img alt='uk' class='country' src='../../images/cpi1/g7-summit/united-kingdom.png' />
                <img alt='germany' class='country' src='../../images/cpi1/g7-summit/germany.png' />
            </div>

            <el-row class='row'>
                <el-col :lg='14' :md='16' :sm='18' :xl='12' :xs='24'>
                    <p class='text'>
                        To receive Headline event notices, news, and analysis in your inbox, <span class='underline'>
                            Join us!
                        </span>
                    </p>
                </el-col>
            </el-row>

            <el-row class='row'>
                <el-col :lg='14' :md='16' :sm='18' :xl='12' :xs='24'>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            Register
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class='background2'>
            <el-row class='row'>
                <el-col
                    :lg='8'
                    :md='8'
                    :sm='22'
                    style='text-align: center'
                    :xl='8'
                    :xs='22'
                >
                    <h1 class='title'>
                        Buy Or Sell Cryptocurrency CFDs instantly.
                    </h1>
                    <p class='text3'>
                        Buy, Sell and Swap Crypto: <br />Simple and Fast
                    </p>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            Register
                        </el-button>
                    </div>
                    <el-link class='terms' target='_blank' :underline='false' @click='open'>
                        Terms & Conditions Apply
                    </el-link>
                </el-col>

                <el-col
                    class='boxContainer'
                    :lg='8'
                    :md='8'
                    :sm='24'
                    style='align-self: center;'
                    :xl='8'
                    :xs='24'
                >
                    <el-card class='box-card'>
                        <div class='text item'>
                            <p>
                                Start your Trading Journey
                            </p>
                        </div>
                    </el-card>
                    <el-link class='terms' target='_blank' :underline='false' @click='open'>
                        Terms & Conditions Apply
                    </el-link>
                </el-col>
            </el-row>
        </div>

        <div class='part2Container'>
            <el-row style='justify-content: center'>
                <el-col
                    :lg='15'
                    :md='16'
                    :sm='17'
                    :xl='14'
                    :xs='18'
                >
                    <h1 class='titleContainer'>
                        Why Headline.net
                    </h1>
                    <p class='content'>
                        Founded in 2016, Headline is a financial service platform based on the financial event. We provide services to investors by analyzing hot topics in finance and helping you to improve your trading efficiency, build up “the top trading opportunities and trade in accordance with financial essence” investing value conception. Reduce investor's difficulty of obtaining information at the bottom level of capital movement.
                    </p>
                </el-col>
            </el-row>
            <el-row class='row2' style='justify-content: center'>
                <el-col
                    class='colContainer'
                    :lg='6'
                    :md='7'
                    :sm='8'
                    :xl='5'
                    :xs='24'
                >
                    <img alt='fotor' class='fotor' src='../../images/cpi1/g7-summit/fotor3.png' />
                    <h1 class='title'>
                        Trade CFD with Crypto
                    </h1>
                    <p class='content'>
                        Gets easy to transfer your money without any involvement of banks and other financial institutions for CFDs trading
                    </p>
                </el-col>

                <el-col
                    class='colContainer'
                    :lg='6'
                    :md='7'
                    :sm='8'
                    :xl='5'
                    :xs='24'
                >
                    <img alt='fotor' class='fotor' src='../../images/cpi1/g7-summit/fotor1.png' />
                    <h1 class='title'>
                        Non-KYC
                    </h1>
                    <p class='content'>
                        No personal information such as their name, address, and ID card during DEPOSIT
                    </p>
                </el-col>

                <el-col
                    class='colContainer'
                    :lg='6'
                    :md='7'
                    :sm='8'
                    :xl='5'
                    :xs='24'
                >
                    <img alt='fotor' class='fotor' src='../../images/cpi1/g7-summit/fotor2.png' />
                    <h1 class='title'>
                        Tax FREE in European Countries
                    </h1>
                    <p class='content'>
                        Maximise your earnings that are not taxed
                    </p>
                </el-col>
            </el-row>
        </div>

        <userLayoutFooter />
    </div>
</template>

<script>
import top from '../../components/eventTop.vue'
import { h, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import claimLayout from './components/claim50_3layout.vue'
import advice from './components/AdviceClaim50_3.vue'
import topNav from '@planspc/layout/topNav'
import userLayoutFooter from '@planspc/modules/footer/footer'
export default {
    name: 'CPI2',
    components: {
        claimLayout,
        advice,
        ElMessage,
        ElMessageBox,
        top,
        userLayoutFooter,
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
  .background{
    background-image: url(../../images/cpi1/g7-summit/backgroundImage.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    height: 490px;
    color: #000;

    .row{
          justify-content: center;
          background: rgba(255,255,255,0.3);
          height: 100%;
          .intro{
            padding: 40px 0;
            h1{
              font-weight: bold;
              font-size: 88px;
            }
            p{
              font-size: 50px;
            }
          }
        }
  }

      .container2{
        background-color: rgb(125,24,23);
        color: #fff;
        .row{
          justify-content: center;
          .heading{
            font-size: 40px;
            padding-top: 30px;
          }
          .text{
            font-size: 22px;
            padding: 40px 0;
            .underline{
              text-decoration: underline;
            }
          }
          .part2Button{
            padding-bottom: 20px;
          }
        }
        .row1Image{
          text-align: center;
          .country{
            width: 115px;
          }
        }
        .row2Image{
          text-align: center;
          .country{
            width: 115px;
          }
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
      .background2{
        background-image: url(../../images/cpi1/g7-summit/background2.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        color: #000;
        .text3{
          font-size: 20px;
        }
        .row{
          background: rgba(255,255,255, 0.4);
          justify-content: center;
        }
        .socialMedia{
          width: 65px;
        }
        .title{
          font-size: 50px;
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
          background-color: #fff !important;
          color: #000 !important;
          border: 1px solid #000 !important;
        }
        .box-card{
          font-size: 46px;
          background: rgb(50,50,50) !important;
          color: #fff;
          border: unset;
          border-radius: unset !important;
          width: 400px;
          height: 170px;
        }
      }

      .terms{
        color: #000;
        font-size: 15px;
        text-decoration: underline;
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
}

@media screen and (max-width: 1100px) {
.background{
  .row{
    .intro{
      padding: 40px 0;
        h1{
          font-weight: bold;
          font-size: 60px;
        }
        p{
          font-size: 30px;
        }
      }
    }
}
  .container2{
    .row{
      .heading{
        font-size: 30px;
        padding-top: 30px;
      }
      .text{
        font-size: 18px;
        padding: 40px 0;
      }
    }
        .country{
            width: 100px;
          }
        }

    .background2{
      .socialMedia{
        width: 45px;
      }
      .title{
        font-size: 35px;
      }
      .box-card{
        font-size: 30px;
        width: 300px;
        height: 140px;
      }
    }
}

 @media screen and (max-width: 991px) {
  .part2Button{
    text-align: center;
  }
  .background2{
    .title{
      padding-top: 50px;
    }
    .box-card{
      justify-content: center;
      display: grid;
      margin: 30px 0 10px;
    }
    .terms{
      padding-bottom: 20px;
    }
  }
  .boxContainer{
    justify-content: center;
    display: grid;
  }
  .part2Container{
    .titleContainer{
      font-size: 40px !important;
      padding-top: 50px !important;
    }
  }
}

@media screen and (max-width: 500px) {
  .country{
  width: 40px !important;
  }
}
</style>
