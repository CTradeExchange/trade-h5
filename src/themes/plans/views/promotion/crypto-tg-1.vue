<template>
    <router-view />
    <div id='crypto' class='cryptoDetails'>
        <div class='cpiPart1'>
            <div class='background1'>
                <div class='heading'>
                    <h1>Trade with Your CRYPTO</h1>
                    <p>
                        <span class='bold'>
                            Deposit and withdraw cryptocurrencies
                        </span>. Make informed trading decesion. Trade all financial instruments you want.
                    </p>
                    <p>
                        <span class='bold'>
                            ANYTHING, ANYTIME, ANYWHERE
                        </span>
                    </p>
                </div>
                <img alt='bull' class='money' src='../../images/cpi1/landingPage/GDNBrandCreative.png' />
                <img alt='bull' class='downImg' src='../../images/cpi1/landingPage/download.png' />
            </div>

            <div>
                <div class='part2'>
                    <img alt='bear' class='animals' src='../../images/cpi1/bull.png' />
                    <div class='challenge'>
                        <h1>Why Choose Headline?</h1>
                        <h1>An Unique Trading Platform</h1>
                    </div>
                    <img alt='bull' class='animals' src='../../images/cpi1/bear.png' />
                </div>
                <el-row class='cards' :gutter='40'>
                    <el-col :span='6'>
                        <el-card class='box-card'>
                            <h1>Crypto-friendly</h1>
                            <p>
                                Headline.net allows traders to deposit and withdraw with
                                <span class='bold'>
                                    fiat currencies and crypto currencies
                                </span> including USDT, USDC etc. Traders can select freely.
                            </p>
                        </el-card>
                    </el-col>
                    <el-col :span='6'>
                        <el-card class='box-card'>
                            <h1>Information Service</h1>
                            <p>
                                With <span class='bold'>
                                    global events and market information
                                </span>, traders can seize trading opportunities to win more. Headline.net offers <span class='bold'>
                                    various ways to ensure traders informed.
                                </span>
                            </p>
                        </el-card>
                    </el-col>
                    <el-col :span='6'>
                        <el-card class='box-card'>
                            <h1>Community-based</h1>
                            <p>
                                You can Register with your telegram account, trade with <span class='bold'>
                                    headline telegram bot
                                </span>, receive timely market information or ask for any instruments you want in <span class='bold'>
                                    telegram group.
                                </span>
                            </p>
                        </el-card>
                    </el-col>
                </el-row>
                <div class='containerPart2'>
                    <p>Are you ready to take your trading next level?</p>
                    <div class='part2Button'>
                        <el-button class='startNow lp_btn lp_btn_home' plain @click='jumpPage(1)'>
                            Official Website
                        </el-button>
                        <el-button class='startNow lp_btn lp_btn_appDownload' plain @click='jumpPage(1)'>
                            Download APP
                        </el-button>
                        <el-button class='startNow lp_btn lp_btn_tgBot' plain @click='jumpPage(1)'>
                            Telegram Bot
                        </el-button>
                    </div>
                </div>
            </div>
            <claimLayout />
            <advice />
        </div>
    </div>
</template>

<script>
import { h, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import claimLayout from './components/crypto-tg-1layout.vue'
import advice from './components/cryptoAdvice.vue'
export default {
    name: 'CryptoTg1',
    components: {
        claimLayout,
        advice,
        ElMessage,
        ElMessageBox,
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

    .animals{
      width: 50%;
      max-width: 537px;
    }
.cpiPart1{
  border-bottom: 1px solid #E8E6E6;
  .background1{
    background: radial-gradient(circle at 50% 50%, #000000 0%, #7D1817 100%);
    display: flex;
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

</style>
