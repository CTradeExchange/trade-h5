<template>
    <router-view />
    <div id='cpi1' class='cpiDetails'>
        <topNav />
        <div class='cpiPart1'>
            <div class='background1'>
                <el-row>
                    <el-col
                        :lg='6'
                        :md='6'
                        :sm='24'
                        :xl='6'
                        :xs='24'
                    >
                        <img alt='bear' class='animals bear' src='../../images/cpi1/bear.png' />
                    </el-col>
                    <el-col
                        :lg='12'
                        :md='12'
                        :sm='24'
                        :xl='12'
                        :xs='24'
                    >
                        <div class='heading'>
                            <h1>Trade and Win Big</h1>
                            <p>
                                Get <span class='bold'>
                                    USD $50
                                </span> Trading Credit <span class='yellow'>
                                    After Verification
                                </span>
                            </p>
                            <p>
                                Win <span class='bold'>
                                    USD $5,000
                                </span> by Trading on Our Platform
                            </p>
                            <div class='part2Button signUpButton'>
                                <el-button class='startNow lp_btn_register lp_btn' plain @click='jumpPage(1)'>
                                    <p class='startNow lp_btn_register lp_btn'>
                                        Register
                                    </p>
                                </el-button>
                            </div>
                            <el-button
                                class='terms lp_btn'
                                link
                                @click='open'
                            >
                                <p class='lp_btn'>
                                    *Terms and conditions apply
                                </p>
                            </el-button>
                        </div>
                    </el-col>
                    <el-col
                        class='bullContainer1'
                        :lg='6'
                        :md='6'
                        :sm='24'
                        :xl='6'
                        :xs='24'
                    >
                        <img alt='bull' class='animals bull' src='../../images/cpi1/bull.png' />
                    </el-col>
                </el-row>
            </div>

            <div>
                <div class='part2'>
                    <el-row>
                        <el-col
                            :lg='6'
                            :md='6'
                            :sm='24'
                            :xl='6'
                            :xs='24'
                        >
                            <img alt='bear' class='animals' src='../../images/cpi1/bull.png' />
                        </el-col>
                        <el-col
                            class='challenge'
                            :lg='12'
                            :md='12'
                            :sm='24'
                            :xl='12'
                            :xs='24'
                        >
                            <div class='challenge'>
                                <h1>CHALLENGE YOURSELF</h1>
                                <h1>and battle your way up to the top trader!</h1>
                            </div>
                        </el-col>
                        <el-col
                            class='animalTwo'
                            :lg='6'
                            :md='6'
                            :sm='24'
                            :xl='6'
                            :xs='24'
                        >
                            <img alt='bull' class='animals' src='../../images/cpi1/bear.png' />
                        </el-col>
                    </el-row>
                </div>
                <el-row class='cards' :gutter='60'>
                    <el-col
                        class='cardContainer'
                        :lg='8'
                        :md='8'
                        :sm='24'
                        :xl='6'
                        :xs='24'
                    >
                        <el-card class='box-card'>
                            <h1>REGISTRATION</h1>
                            <p>
                                <span class='bold'>
                                    Register
                                </span> and join our <span class='bold'>
                                    Telegram group
                                </span> to verify your registration. After confirmation of your verification, you will receive USD $50 trading credit in your account.
                            </p>
                        </el-card>
                    </el-col>
                    <el-col
                        class='cardContainer'
                        :lg='8'
                        :md='8'
                        :sm='24'
                        :xl='6'
                        :xs='24'
                    >
                        <el-card class='box-card'>
                            <h1>HOW TO WIN?</h1>
                            <p>Simply trade on our platform during 1 to 14 May 2023 and aim for the highest profit – the top trader will receive an incredible prize of USD $5,000.</p>
                        </el-card>
                    </el-col>
                    <el-col
                        class='cardContainer'
                        :lg='8'
                        :md='8'
                        :sm='24'
                        :xl='6'
                        :xs='24'
                    >
                        <el-card class='box-card'>
                            <h1>HOW DO I ENTER?</h1>
                            <p>Once you've completed your registration, we'll automatically credit your account with USD $50 that you can use to start trading right away.</p>
                        </el-card>
                    </el-col>
                </el-row>
                <div class='containerPart2'>
                    <p>Are you ready to up your game?</p>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn lp_btn_register' plain @click='jumpPage(1)'>
                            <p class='startNow lp_btn lp_btn_register'>
                                Register
                            </p>
                        </el-button>
                    </div>
                </div>
            </div>
            <claimLayout />
            <advice />
        </div>
        <userLayoutFooter />
    </div>
</template>

<script>
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
        topNav,
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

.cpiPart1{
  border-bottom: 1px solid #E8E6E6;
  .background1{
    background: radial-gradient(circle at 50% 50%, #000000 0%, #7D1817 100%);
    display: flex;
    .animals{
      width: 550px;
      transform: rotateY(180deg);
      filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(68deg) brightness(103%) contrast(105%);
    }
    .bear{
      position: relative;
      right: 50px;
    }
    .bull{
      position: relative;
      right: 50px;
    }
    .bullContainer1{
      align-self: end;
    }
    .heading{
      text-align: center;
      padding: 120px 0;
      z-index: 999;
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
        padding: 40px 0 10px;
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
    padding: 20px 0;
    .challenge{
      align-self: center;
      text-align: center;
      align-self: center;
      h1{
        font-weight: 700;
        font-size: 43px;
      }
    }
    .animals{
      width: 100%;
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

  .signUpButton{
    .startNow{
      width: 120px !important;
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

@media screen and (max-width: 991px) {

}
</style>
